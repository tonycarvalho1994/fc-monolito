import { Request, Response } from "express";
import { AddCatalogProductInputDto } from "../../../usecase/add-product/add-product.dto";
import AddCatalogProductUseCase from "../../../usecase/add-product/add-product.usecase";

export class AddCatalogProductController {
  constructor(private _addCatalogProductUseCase: AddCatalogProductUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const input: AddCatalogProductInputDto = request.body;

      const result = await this._addCatalogProductUseCase.execute(input);

      return response.status(201).send(result);
    } catch (error) {
      console.log(error);
      return response.status(400).json({
        message: "Unexpected error.",
      });
    }
  }
}
