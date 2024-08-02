import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import { PlaceOrderInputDto } from "./place-order.dto";
import PlaceOrderUseCase from "./place-order.usecase";

const mockDate = new Date(2000, 1, 1);

describe("PlaceOrderUsecase unit test", () => {
  describe("validateProducts method", () => {
    //@ts-expect-error - no params in constructor
    const placeOrderUseCase = new PlaceOrderUseCase();

    it("should throw an error when products are not valid", async () => {
      const input: PlaceOrderInputDto = { clientId: "0", products: [] };

      await expect(
        placeOrderUseCase["validateProducts"](input)
      ).rejects.toThrow(new Error("No products selected"));
    });

    it("should throw an error when product is out of stock", async () => {
      const mockProductFacade = {
        checkStock: jest.fn(({ productId }: { productId: string }) =>
          Promise.resolve({
            productId,
            stock: productId === "1" ? 0 : 1,
          })
        ),
      };

      //@ts-expect-error - force set productFacade
      placeOrderUseCase["_productFacade"] = mockProductFacade;

      let input: PlaceOrderInputDto = {
        clientId: "0",
        products: [{ productId: "1" }],
      };

      await expect(
        placeOrderUseCase["validateProducts"](input)
      ).rejects.toThrow(new Error("Product 1 is not available in stock"));

      input = {
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }],
      };

      await expect(
        placeOrderUseCase["validateProducts"](input)
      ).rejects.toThrow(new Error("Product 1 is not available in stock"));
      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);

      input = {
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }, { productId: "2" }],
      };

      await expect(
        placeOrderUseCase["validateProducts"](input)
      ).rejects.toThrow(new Error("Product 1 is not available in stock"));
      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5);
    });
  });

  describe("getProduct method", () => {
    beforeAll(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    //@ts-expect-error - no params in constructor
    const placeOrderUseCase = new PlaceOrderUseCase();

    it("should thrown an error when product not found", async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue(null),
      };

      //@ts-expect-error - force set catalogFacade
      placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

      await expect(placeOrderUseCase["getProduct"]("0")).rejects.toThrow(
        new Error("Product not found")
      );
    });

    it("should return product when found", async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue({
          id: "0",
          name: "Product 0",
          description: "Description 0",
          salesPrice: 0,
        }),
      };

      //@ts-expect-error - force set catalogFacade
      placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

      await expect(placeOrderUseCase["getProduct"]("0")).resolves.toEqual(
        new Product({
          id: new Id("0"),
          name: "Product 0",
          description: "Description 0",
          salesPrice: 0,
        })
      );
      expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1);
    });
  });

  describe("execute method", () => {
    it("should throw an error when client not found", async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(null),
      };

      //@ts-expect-error - no params in constructor
      const placeOrderUseCase = new PlaceOrderUseCase();
      //@ts-expect-error - force set clientFacade
      placeOrderUseCase["_clientFacade"] = mockClientFacade;

      const input: PlaceOrderInputDto = { clientId: "0", products: [] };

      await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
        new Error("Client not found")
      );
    });

    it("should throw an error when products are not valid", async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(true),
      };

      //@ts-expect-error - no params in constructor
      const placeOrderUseCase = new PlaceOrderUseCase();

      const mockValidateProducts = jest
        //@ts-expect-error - spy on private method
        .spyOn(placeOrderUseCase, "validateProducts")
        //@ts-expect-error - not return never
        .mockRejectedValue(new Error("No products selected"));

      //@ts-expect-error - force set clientFacade
      placeOrderUseCase["_clientFacade"] = mockClientFacade;

      const input: PlaceOrderInputDto = { clientId: "1", products: [] };
      await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
        new Error("No products selected")
      );
      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
    });
  });

  describe("place an order", () => {
    const clientProps = {
      id: "1c",
      name: "Client 0",
      document: "0000",
      email: "email@email.com",
      address: {
        street: "Street 0",
        number: "0",
        complement: "",
        city: "City 0",
        state: "State 0",
        zipCode: "00000-000",
      },
    };

    const mockClientFacade = {
      find: jest.fn().mockResolvedValue(clientProps),
    };

    const mockPaymentFacade = {
      process: jest.fn(),
    };

    const mockCheckoutRepo = {
      addOrder: jest.fn(),
      // findOrder: jest.fn(),
    };

    const mockInvoiceFacade = {
      generate: jest.fn().mockResolvedValue({ id: "1i" }),
      // find: jest.fn().mockResolvedValue({ id: "1i" }),
    };

    const placeOrderUsecase = new PlaceOrderUseCase(
      mockClientFacade as any,
      null,
      null,
      mockCheckoutRepo as any,
      mockInvoiceFacade as any,
      mockPaymentFacade
    );

    const products = {
      "1": new Product({
        id: new Id("1"),
        name: "Product 1",
        description: "Description 1",
        salesPrice: 10,
      }),
      "2": new Product({
        id: new Id("2"),
        name: "Product 2",
        description: "Description 2",
        salesPrice: 20,
      }),
    };

    const mockValidateProducts = jest
      //@ts-expect-error - spy on private method
      .spyOn(placeOrderUsecase, "validateProducts")
      //@ts-expect-error - spy on private method
      .mockResolvedValue(null);

    const mockGetProduct = jest
      //@ts-expect-error - spy on private method
      .spyOn(placeOrderUsecase, "getProduct")
      //@ts-expect-error - spy on private method
      .mockImplementation((productId: keyof typeof products) => {
        return products[productId];
      });

    it("should not be approved", async () => {
      mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
        transactionId: "1t",
        orderId: "1o",
        amount: 30,
        status: "error",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const input: PlaceOrderInputDto = {
        clientId: "1c",
        products: [{ productId: "1" }, { productId: "2" }],
      };

      let output = await placeOrderUsecase.execute(input);

      expect(output.invoiceId).toBeNull();
      expect(output.total).toBe(30);
      expect(output.products).toStrictEqual([
        { productId: "1" },
        { productId: "2" },
      ]);
      expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
      expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
      expect(mockValidateProducts).toHaveBeenCalledWith(input);
      expect(mockGetProduct).toHaveBeenCalledTimes(2);
      expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.process).toHaveBeenCalledWith({
        orderId: output.orderId,
        amount: output.total,
      });

      expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0);
    });

    it("should be approved", async () => {
      mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
        transactionId: "1t",
        orderId: "1o",
        amount: 30,
        status: "approved",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const input: PlaceOrderInputDto = {
        clientId: "1c",
        products: [{ productId: "1" }, { productId: "2" }],
      };

      let output = await placeOrderUsecase.execute(input);

      expect(output.invoiceId).toBe("1i");
      expect(output.total).toBe(30);
      expect(output.products).toStrictEqual([
        { productId: "1" },
        { productId: "2" },
      ]);
      expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
      expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
      expect(mockGetProduct).toHaveBeenCalledTimes(2);
      expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.process).toHaveBeenCalledWith({
        orderId: output.orderId,
        amount: output.total,
      });

      expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1);
      expect(mockInvoiceFacade.generate).toHaveBeenCalledWith({
        name: clientProps.name,
        document: clientProps.document,
        street: clientProps.address.street,
        city: clientProps.address.city,
        state: clientProps.address.state,
        zipCode: clientProps.address.zipCode,
        number: clientProps.address.number,
        complement: clientProps.address.complement,
        items: [
          {
            id: products["1"].id.id,
            name: products["1"].name,
            price: products["1"].salesPrice,
          },
          {
            id: products["2"].id.id,
            name: products["2"].name,
            price: products["2"].salesPrice,
          },
        ],
      });
    });
  });
});
