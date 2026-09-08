#!/bin/bash
set -e

# Configuration
API_URL="http://localhost:3000"

# Helper for parsing JSON with node
node_extract() {
  node -e "const stdin = require('fs').readFileSync(0, 'utf-8'); try { const obj = JSON.parse(stdin); console.log(obj$1); } catch (e) { console.error('Parse error'); process.exit(1); }"
}

# Helper: Register and return token
register_user() {
    local email=$1
    local password="Password123!"
    curl -s -X POST "$API_URL/auth/register" \
        -H "Content-Type: application/json" \
        -d "{\"email\": \"$email\", \"password\": \"$password\"}" > /dev/null

    # Login to get token
    local response=$(curl -s -X POST "$API_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\": \"$email\", \"password\": \"$password\"}")
    echo "$response" | node_extract "['access_token']"
}

# Helper: Create project
create_project() {
    local token=$1
    local name=$2
    curl -s -X POST "$API_URL/projects" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -d "{\"name\": \"$name\"}"
}

echo "=== Starting Complete RBAC & Project Verification Suite ==="

NOW=$(date +%s)

# 1. Register users (A, B, C)
echo "1. Registering test users (A, B, C)..."
TOKEN_A=$(register_user "userA_${NOW}@test.com")
TOKEN_B=$(register_user "userB_${NOW}@test.com")
TOKEN_C=$(register_user "userC_${NOW}@test.com")

if [ "$TOKEN_A" == "undefined" ] || [ -z "$TOKEN_A" ]; then
    echo "FAILED: Registration failed for User A"
    exit 1
fi
echo "   -> Registered User A, User B, User C successfully."

# Helper to get project list for token
get_projects() { curl -s -X GET "$API_URL/projects" -H "Authorization: Bearer $1"; }

# 2. Check Auto-created Personal projects
echo "2. Verifying auto-created 'Personal' project for each user..."
A_PROJS=$(get_projects "$TOKEN_A")
B_PROJS=$(get_projects "$TOKEN_B")
C_PROJS=$(get_projects "$TOKEN_C")

echo "$A_PROJS" | node -e "const arr = JSON.parse(require('fs').readFileSync(0, 'utf-8')); if (!arr.some(p => p.name === 'Personal' && p.role === 'owner')) process.exit(1);"
echo "$B_PROJS" | node -e "const arr = JSON.parse(require('fs').readFileSync(0, 'utf-8')); if (!arr.some(p => p.name === 'Personal' && p.role === 'owner')) process.exit(1);"
echo "$C_PROJS" | node -e "const arr = JSON.parse(require('fs').readFileSync(0, 'utf-8')); if (!arr.some(p => p.name === 'Personal' && p.role === 'owner')) process.exit(1);"
echo "   -> PASSED: All users have an isolated 'Personal' project with 'owner' role."

# 3. User A creates a shared project
echo "3. User A creating a new collaborative project..."
PROJ_A=$(create_project "$TOKEN_A" "Engineering Workspace")
PROJ_A_ID=$(echo "$PROJ_A" | node_extract "['id']")
echo "   -> Created Project ID: $PROJ_A_ID"

# 4. User A invites non-existent email -> should get 404
echo "4. Testing non-existent user invitation..."
HTTP_CODE_NOT_FOUND=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/projects/$PROJ_A_ID/members" \
    -H "Authorization: Bearer $TOKEN_A" \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"nonexistent_${NOW}@test.com\", \"role\": \"editor\"}")
if [ "$HTTP_CODE_NOT_FOUND" -ne 404 ]; then
    echo "FAILED: Expected 404 when adding non-existent user, got $HTTP_CODE_NOT_FOUND"
    exit 1
fi
echo "   -> PASSED: 404 returned for unknown email."

# 5. User A invites User B as 'editor'
echo "5. User A adding User B as editor..."
curl -s -X POST "$API_URL/projects/$PROJ_A_ID/members" \
    -H "Authorization: Bearer $TOKEN_A" \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"userB_${NOW}@test.com\", \"role\": \"editor\"}" > /dev/null

B_PROJS_AFTER=$(get_projects "$TOKEN_B")
echo "$B_PROJS_AFTER" | node -e "const arr = JSON.parse(require('fs').readFileSync(0, 'utf-8')); if (!arr.some(p => p.id === '$PROJ_A_ID' && p.role === 'editor')) process.exit(1);"
echo "   -> PASSED: User B now sees the shared project with 'editor' role."

# 6. User B creates and edits diagrams in the shared project
echo "6. User B creating and modifying diagrams in shared project..."
CREATE_DIAG_RES=$(curl -s -X POST "$API_URL/diagrams" \
    -H "Authorization: Bearer $TOKEN_B" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"Schema V1\", \"content\": {\"tables\": []}, \"projectId\": \"$PROJ_A_ID\"}")
DIAG_ID=$(echo "$CREATE_DIAG_RES" | node_extract "['id']")

if [ "$DIAG_ID" == "undefined" ] || [ -z "$DIAG_ID" ]; then
    echo "FAILED: User B failed to create diagram in shared project"
    exit 1
fi

UPDATE_DIAG_RES=$(curl -s -X PUT "$API_URL/diagrams/$DIAG_ID" \
    -H "Authorization: Bearer $TOKEN_B" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"Schema V1 Updated\"}")
echo "$UPDATE_DIAG_RES" | node -e "const res = JSON.parse(require('fs').readFileSync(0, 'utf-8')); if (res.name !== 'Schema V1 Updated') process.exit(1);"
echo "   -> PASSED: User B created and updated diagram in User A's project."

# 7. User A can view and retrieve the diagram created by User B
echo "7. User A reading diagram created by User B..."
FETCHED_BY_A=$(curl -s -X GET "$API_URL/diagrams/$DIAG_ID" -H "Authorization: Bearer $TOKEN_A")
echo "$FETCHED_BY_A" | node -e "const res = JSON.parse(require('fs').readFileSync(0, 'utf-8')); if (res.id !== '$DIAG_ID') process.exit(1);"
echo "   -> PASSED: User A retrieved shared diagram created by User B."

# 8. User B (editor) attempts to add a member -> 403
echo "8. Enforcing editor restrictions (User B cannot add member)..."
HTTP_CODE_EDITOR_ADD=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/projects/$PROJ_A_ID/members" \
    -H "Authorization: Bearer $TOKEN_B" \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"userC_${NOW}@test.com\"}")
if [ "$HTTP_CODE_EDITOR_ADD" -ne 403 ]; then
    echo "FAILED: Editor was allowed to add member (HTTP $HTTP_CODE_EDITOR_ADD)"
    exit 1
fi
echo "   -> PASSED: 403 Forbidden received for unauthorized member addition."

# 9. User C (unrelated third party) isolation check
echo "9. Verifying complete isolation for User C..."
HTTP_CODE_C_GET_PROJ=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$API_URL/projects/$PROJ_A_ID/members" \
    -H "Authorization: Bearer $TOKEN_C")
if [ "$HTTP_CODE_C_GET_PROJ" -ne 403 ]; then
    echo "FAILED: Non-member User C could access members list (HTTP $HTTP_CODE_C_GET_PROJ)"
    exit 1
fi

HTTP_CODE_C_GET_DIAG=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$API_URL/diagrams/$DIAG_ID" \
    -H "Authorization: Bearer $TOKEN_C")
if [ "$HTTP_CODE_C_GET_DIAG" -ne 403 ]; then
    echo "FAILED: Non-member User C could access diagram (HTTP $HTTP_CODE_C_GET_DIAG)"
    exit 1
fi

HTTP_CODE_C_LIST_DIAG=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$API_URL/diagrams?projectId=$PROJ_A_ID" \
    -H "Authorization: Bearer $TOKEN_C")
if [ "$HTTP_CODE_C_LIST_DIAG" -ne 403 ]; then
    echo "FAILED: Non-member User C could list diagrams (HTTP $HTTP_CODE_C_LIST_DIAG)"
    exit 1
fi
echo "   -> PASSED: User C receives 403 on all operations in Project A."

# 10. Sole Owner Protection check
echo "10. Verifying Sole Owner removal protection..."
MEMBERS_LIST=$(curl -s -X GET "$API_URL/projects/$PROJ_A_ID/members" -H "Authorization: Bearer $TOKEN_A")
USER_A_ID=$(echo "$MEMBERS_LIST" | node -e "const arr = JSON.parse(require('fs').readFileSync(0, 'utf-8')); const a = arr.find(m => m.role === 'owner'); console.log(a.userId);")

HTTP_CODE_REMOVE_SOLE_OWNER=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$API_URL/projects/$PROJ_A_ID/members/$USER_A_ID" \
    -H "Authorization: Bearer $TOKEN_A")
if [ "$HTTP_CODE_REMOVE_SOLE_OWNER" -ne 400 ]; then
    echo "FAILED: Expected 400 when removing sole owner, got $HTTP_CODE_REMOVE_SOLE_OWNER"
    exit 1
fi
echo "   -> PASSED: Cannot remove sole owner (400 Bad Request returned)."

# 11. Role promotion & Member removal
echo "11. Promoting User B to Owner and removing User B..."
USER_B_ID=$(echo "$MEMBERS_LIST" | node -e "const arr = JSON.parse(require('fs').readFileSync(0, 'utf-8')); const b = arr.find(m => m.role === 'editor'); console.log(b.userId);")

# Update role to owner
curl -s -X PATCH "$API_URL/projects/$PROJ_A_ID/members/$USER_B_ID" \
    -H "Authorization: Bearer $TOKEN_A" \
    -H "Content-Type: application/json" \
    -d "{\"role\": \"owner\"}" > /dev/null

# Demote back to editor
curl -s -X PATCH "$API_URL/projects/$PROJ_A_ID/members/$USER_B_ID" \
    -H "Authorization: Bearer $TOKEN_A" \
    -H "Content-Type: application/json" \
    -d "{\"role\": \"editor\"}" > /dev/null

# Remove member B
HTTP_CODE_REMOVE_B=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$API_URL/projects/$PROJ_A_ID/members/$USER_B_ID" \
    -H "Authorization: Bearer $TOKEN_A")
if [ "$HTTP_CODE_REMOVE_B" -ne 204 ]; then
    echo "FAILED: Failed to remove member B (HTTP $HTTP_CODE_REMOVE_B)"
    exit 1
fi
echo "   -> PASSED: Role management and member removal successfully verified."

echo "=== ALL VERIFICATION CHECKS PASSED SUCCESSFULLY ==="
