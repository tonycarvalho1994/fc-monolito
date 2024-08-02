import { Request, Response } from "express";
import AddClientUseCase from "../../../usecase/add-client/add-client.usecase";
import { AddClientInputDto } from "../../../usecase/add-client/add-client.usecase.dto";
import Address from "../../../../@shared/domain/value-object/address";

export class AddClientController {
  constructor(private _addClientUseCase: AddClientUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const input: AddClientInputDto = request.body;

      const { street, number, complement, city, state, zipCode } =
        input.address;
      const _address = new Address(
        street,
        number,
        complement,
        city,
        state,
        zipCode
      );
      _address.validate();

      const result = await this._addClientUseCase.execute(input);

      return response.status(201).send({
        id: result.id,
        name: result.name,
        email: result.email,
        document: result.document,
        address: {
          street: result.address.street,
          number: result.address.number,
          complement: result.address.complement,
          city: result.address.city,
          state: result.address.state,
          zipCode: result.address.zipCode,
        },
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      });
    } catch (error) {
      console.log(error);
      return response.status(400).json({
        message: "Unexpected error.",
      });
    }
  }
}
