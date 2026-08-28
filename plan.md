1. **Remove Dexie dependencies** from `storage-provider.tsx`.
2. **Add state**: `diagramCache` object.
3. **Add `debouncedSave`**: uses `debounce` to trigger `PUT /diagrams/:id` every 1000ms after an update.
4. **Rewrite `addTable` etc**: modify `diagramCache` directly, then call `debouncedSave`.
5. **Rewrite `addDiagram`**: map it to `POST /diagrams`.
6. **Rewrite `listDiagrams`**: map it to `GET /diagrams` and correctly parse ISO date strings to JS `Date` objects (`createdAt`, `updatedAt`).
7. **Rewrite `getDiagram`**: map it to `GET /diagrams/:id` and parse dates, resolve full diagram to update `diagramCache`.
8. Ensure `debouncedSave` sends full diagram object: `databaseType`, `tables`, `relationships`, `areas`, etc.
