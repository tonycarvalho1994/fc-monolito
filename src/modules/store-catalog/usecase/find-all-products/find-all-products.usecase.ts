import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import CatalogProductGateway from "../../gateway/product.gateway";

export default class FindAllProductsUsecase implements UseCaseInterface {
  constructor(private productRepository: CatalogProductGateway) {}

  async execute(): Promise<any> {
    const products = await this.productRepository.findAll();

    return {
      products: products.map((product) => ({
        id: product.id.id,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
      })),
    };
  }
}
