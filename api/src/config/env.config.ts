import { ConfigModuleOptions } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

export const envConfig: ConfigModuleOptions = {
  isGlobal: true,
  cache: false,
  envFilePath: '.env',
};