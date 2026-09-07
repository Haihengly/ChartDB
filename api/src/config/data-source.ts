import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { UserEntity } from '../entities/user.entity';
import { DiagramEntity } from '../entities/diagram.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'chartdb',
  password: process.env.DB_PASSWORD || 'chartdb',
  database: process.env.DB_NAME || 'chartdb',
  entities: [UserEntity, DiagramEntity],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
});
