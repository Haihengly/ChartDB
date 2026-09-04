"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagramsController = void 0;
const common_1 = require("@nestjs/common");
const diagrams_service_1 = require("./diagrams.service");
const diagram_dto_1 = require("../../dto/diagram.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const user_entity_1 = require("../../entities/user.entity");
let DiagramsController = class DiagramsController {
    constructor(diagramsService) {
        this.diagramsService = diagramsService;
    }
    async create(createDiagramDto, user) {
        return this.diagramsService.create(createDiagramDto, user.id);
    }
    async findAll(user) {
        return this.diagramsService.findAll(user.id);
    }
    async findOne(id, user) {
        return this.diagramsService.findOne(id, user.id);
    }
    async update(id, updateDiagramDto, user) {
        return this.diagramsService.update(id, updateDiagramDto, user.id);
    }
    async remove(id, user) {
        return this.diagramsService.remove(id, user.id);
    }
};
exports.DiagramsController = DiagramsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [diagram_dto_1.CreateDiagramDto, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], DiagramsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], DiagramsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], DiagramsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, diagram_dto_1.UpdateDiagramDto, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], DiagramsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], DiagramsController.prototype, "remove", null);
exports.DiagramsController = DiagramsController = __decorate([
    (0, common_1.Controller)('diagrams'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [diagrams_service_1.DiagramsService])
], DiagramsController);
//# sourceMappingURL=diagrams.controller.js.map