import Id from "../../@shared/domain/value-object/id.value-object";
import CatalogProduct from "../domain/product.entity";
import CatalogProductGateway from "../gateway/product.gateway";
import CatalogProductModel from "./product.model";

export default class CatalogProductRepository implements CatalogProductGateway {
  async add(product: CatalogProduct): Promise<void> {
    const result = await CatalogProductModel.create({
      id: product.id.id,
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    });
  }

  async findAll(): Promise<CatalogProduct[]> {
    const products = await CatalogProductModel.findAll();

    return products.map(
      (product) =>
        new CatalogProduct({
          id: new Id(product.id),
          name: product.name,
          description: product.description,
          salesPrice: product.salesPrice,
        })
    );
  }

  async find(id: string): Promise<CatalogProduct> {
    const product = await CatalogProductModel.findOne({
      where: {
        id: id,
      },
    });

    return new CatalogProduct({
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    });
  }
}
