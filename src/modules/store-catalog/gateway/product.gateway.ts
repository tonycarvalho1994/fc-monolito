import CatalogProduct from "../domain/product.entity";

export default interface CatalogProductGateway {
  add(product: CatalogProduct): Promise<void>;
  findAll(): Promise<CatalogProduct[]>;
  find(id: string): Promise<CatalogProduct>;
}
