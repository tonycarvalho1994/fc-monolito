import { Request, Response } from "express";
import FindInvoiceUseCase from "../../../usecase/find-invoice/find-invoice.usecase";

export class FindInvoiceController {
  constructor(private _findInvoiceUseCase: FindInvoiceUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.params;

      const result = await this._findInvoiceUseCase.execute({ id });

      return response.status(200).send({
        id: result.id,
        name: result.name,
        document: result.document,
        address: {
          street: result.address.street,
          number: result.address.number,
          complement: result.address.complement,
          city: result.address.city,
          state: result.address.state,
          zipCode: result.address.zipCode,
        },
        items: result.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
        })),
        total: result.total,
        createdAt: result.createdAt,
      });
    } catch (error) {
      console.log(error);
      return response.status(400).json({
        message: "Unexpected error.",
      });
    }
  }
}
