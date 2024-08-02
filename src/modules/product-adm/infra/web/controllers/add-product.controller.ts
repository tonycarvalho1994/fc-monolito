import { Request, Response } from "express";
import AddProductUseCase from "../../../usecase/add-product/add-product.usecase";
import { AddProductInputDto } from "../../../usecase/add-product/add-product.dto";

export class AddProductController {
  constructor(private _addProductUseCase: AddProductUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const input: AddProductInputDto = request.body;

      const result = await this._addProductUseCase.execute(input);

      return response.status(201).send(result);
    } catch (error) {
      console.log(error);
      return response.status(400).json({
        message: "Unexpected error.",
      });
    }
  }
}
