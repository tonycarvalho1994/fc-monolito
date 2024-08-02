export interface AddCatalogProductInputDto {
  id?: string;
  name: string;
  description: string;
  salesPrice: number;
}

export interface AddCatalogProductOutputDto {
  id: string;
  name: string;
  description: string;
  salesPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
