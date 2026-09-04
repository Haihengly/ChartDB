import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'postgres'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'chartdb'),
  password: configService.get<string>('DB_PASSWORD', 'chartdb'),
  database: configService.get<string>('DB_NAME', 'chartdb'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false), // Set to false, controlled by env
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  migrationsRun: true, // Auto-run migrations on startup
  logging: false,
});