import Id from "../../../@shared/domain/value-object/id.value-object";
import CatalogProduct from "../../domain/product.entity";
import CatalogProductGateway from "../../gateway/product.gateway";
import {
  AddCatalogProductInputDto,
  AddCatalogProductOutputDto,
} from "./add-product.dto";

export default class AddCatalogProductUseCase {
  private _catalogProductRepository: CatalogProductGateway;

  constructor(_catalogProductRepository: CatalogProductGateway) {
    this._catalogProductRepository = _catalogProductRepository;
  }

  async execute(
    input: AddCatalogProductInputDto
  ): Promise<AddCatalogProductOutputDto> {
    const props = {
      id: new Id(input.id),
      name: input.name,
      description: input.description,
      salesPrice: input.salesPrice,
    };

    const product = new CatalogProduct(props);
    this._catalogProductRepository.add(product);

    return {
      id: product.id.id,
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
