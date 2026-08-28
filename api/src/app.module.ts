import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envConfig } from './config/env.config';
import { getTypeOrmConfig } from './config/typeorm.config';
import { DiagramsModule } from './modules/diagrams/diagrams.module';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    DiagramsModule,
  ],
})
export class AppModule {}