import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateDiagramDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  name: string;

  @IsObject()
  content: Record<string, unknown>;

  @IsString()
  @IsOptional()
  projectId?: string;
}

export class UpdateDiagramDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsObject()
  @IsOptional()
  content?: Record<string, unknown>;
}
