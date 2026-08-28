export class CreateDiagramDto {
  id?: string;
  name: string;
  content: Record<string, unknown>;
}

export class UpdateDiagramDto {
  name?: string;
  content?: Record<string, unknown>;
}
