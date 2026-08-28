"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypeOrmConfig = void 0;
const getTypeOrmConfig = (configService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST', 'postgres'),
    port: configService.get('DB_PORT', 5432),
    username: configService.get('DB_USERNAME', 'chartdb'),
    password: configService.get('DB_PASSWORD', 'chartdb'),
    database: configService.get('DB_NAME', 'chartdb'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    autoLoadEntities: true,
    synchronize: true,
    logging: false,
});
exports.getTypeOrmConfig = getTypeOrmConfig;
//# sourceMappingURL=typeorm.config.js.map