import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "../repository/invoice.model";
import { InvoiceItemModel } from "../repository/invoice-item.model";
import InvoiceFacadeFactory from "../factory/client-adm.facade.factory";

describe("Invoice Facade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create an invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const input = {
      id: "1",
      name: "Lucian",
      email: "lucian@xpto.com",
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipCode: "88888-888",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 100,
        },
      ],
    };

    await facade.generate(input);

    const invoice = await InvoiceModel.findOne({ where: { id: "1" } });

    expect(invoice).toBeDefined();
    expect(invoice.id).toBeDefined();
    expect(invoice.name).toBe(input.name);
    expect(invoice.document).toBe(input.document);
    expect(invoice.street).toBe(input.street);
    expect(invoice.number).toBe(input.number);
    expect(invoice.complement).toBe(input.complement);
    expect(invoice.city).toBe(input.city);
    expect(invoice.state).toBe(input.state);
    expect(invoice.zipcode).toBe(input.zipCode);

    const items = await InvoiceItemModel.findAll({ where: { invoiceId: "1" } });

    expect(items).toHaveLength(1);
    expect(items[0].id).toBeDefined();
    expect(items[0].name).toBe(input.items[0].name);
    expect(items[0].price).toBe(input.items[0].price);
  });

  it("should find an invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const input = {
      id: "1",
      name: "Lucian",
      email: "lucian@xpto.com",
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipCode: "88888-888",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 100,
        },
      ],
    };

    await facade.generate(input);

    const invoice = await facade.find({ id: "1" });

    expect(invoice).toBeDefined();
    expect(invoice.id).toBeDefined();
    expect(invoice.name).toBe(input.name);
    expect(invoice.document).toBe(input.document);
    expect(invoice.address.street).toBe(input.street);
    expect(invoice.address.number).toBe(input.number);
    expect(invoice.address.complement).toBe(input.complement);
    expect(invoice.address.city).toBe(input.city);
    expect(invoice.address.state).toBe(input.state);
    expect(invoice.address.zipCode).toBe(input.zipCode);

    const items = await InvoiceItemModel.findAll({ where: { invoiceId: "1" } });

    expect(items).toHaveLength(1);
    expect(items[0].id).toBeDefined();
    expect(items[0].name).toBe(input.items[0].name);
    expect(items[0].price).toBe(input.items[0].price);
  });
});
