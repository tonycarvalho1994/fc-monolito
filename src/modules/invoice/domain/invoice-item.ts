import Id from "../../@shared/domain/value-object/id.value-object";

export default class InvoiceItem {
  private readonly _id: Id;
  private readonly _name: string;
  private readonly _price: number;

  constructor(props: { id: Id; name: string; price: number }) {
    this._id = props.id;
    this._name = props.name;
    this._price = props.price;
  }

  get id(): Id {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }
}
