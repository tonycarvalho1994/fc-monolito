import { Request, Response } from "express";
import PlaceOrderUseCase from "../../../usecase/place-order/place-order.usecase";
import { PlaceOrderInputDto } from "../../../usecase/place-order/place-order.dto";

export class PlaceOrderController {
  constructor(private _placeOrderUseCase: PlaceOrderUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const input: PlaceOrderInputDto = request.body;

      const result = await this._placeOrderUseCase.execute(input);

      return response.status(200).send(result);
    } catch (error) {
      console.log(error);
      return response.status(400).json({
        message: "Unexpected error.",
      });
    }
  }
}
