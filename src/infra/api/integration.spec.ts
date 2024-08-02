import request from "supertest";
import app from "./server";
import { startDb } from "../db/start-db";

describe("Integration tests", () => {
  const db = startDb();
  beforeEach(async () => {
    await db.sync({ force: true });
  });

  describe("POST /clients", () => {
    it("should return 201 status code", async () => {
      const input = {
        name: "Anakin Skywalker",
        email: "lord.vader@empire.com",
        document: "12345678900",
        address: {
          street: "Death Star Avenue",
          number: 123,
          complement: "Sith's Tower",
          city: "Galaxy City",
          state: "Outer Rim",
          zipCode: "12345678",
        },
      };
      const response = await request(app).post("/clients").send(input);

      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
    });
  });

  describe("POST /products", () => {
    it("should return 201 status code", async () => {
      const input1 = {
        name: "Lightsaber",
        description: "An elegant weapon for a more civilized age",
        purchasePrice: 1000,
        stock: 10,
      };
      const response1 = await request(app).post("/products").send(input1);

      expect(response1.status).toBe(201);
      expect(response1.body.id).toBeDefined();

      const input2 = {
        name: "TIE Fighter",
        description: "The fighter of the Empire",
        purchasePrice: 100000,
        stock: 5,
      };
      const response2 = await request(app).post("/products").send(input2);

      expect(response2.status).toBe(201);
      expect(response2.body.id).toBeDefined();
    });
  });

  describe("POST /store-catalog", () => {
    it("should return 201 status code", async () => {
      // Create Products
      const inputP1 = {
        name: "Lightsaber",
        description: "An elegant weapon for a more civilized age",
        purchasePrice: 1000,
        stock: 10,
      };
      const responseP1 = await request(app).post("/products").send(inputP1);

      expect(responseP1.status).toBe(201);
      expect(responseP1.body.id).toBeDefined();

      const inputP2 = {
        name: "TIE Fighter",
        description: "The fighter of the Empire",
        purchasePrice: 100000,
        stock: 5,
      };
      const responseP2 = await request(app).post("/products").send(inputP2);

      expect(responseP2.status).toBe(201);
      expect(responseP2.body.id).toBeDefined();

      const input = {
        productId: responseP1.body.id,
        name: responseP1.body.name,
        description: responseP1.body.description,
        salesPrice: 1500,
      };
      const response = await request(app).post("/store-catalog").send(input);

      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();

      const input2 = {
        productId: responseP2.body.id,
        name: responseP2.body.name,
        description: responseP2.body.description,
        salesPrice: 150000,
      };
      const response2 = await request(app).post("/store-catalog").send(input2);

      expect(response2.status).toBe(201);
      expect(response2.body.id).toBeDefined();
    });
  });

  describe("POST /checkout", () => {
    it("should place an order and return 200 status code", async () => {
      // Create Client
      const inputClient = {
        name: "Anakin Skywalker",
        email: "lord.vader@empire.com",
        document: "12345678900",
        address: {
          street: "Death Star Avenue",
          number: 123,
          complement: "Sith's Tower",
          city: "Galaxy City",
          state: "Outer Rim",
          zipCode: "12345678",
        },
      };
      const responseClient = await request(app)
        .post("/clients")
        .send(inputClient);

      expect(responseClient.status).toBe(201);
      expect(responseClient.body.id).toBeDefined();

      const clientId = responseClient.body.id;

      // Create Products
      const input1 = {
        name: "Lightsaber",
        description: "An elegant weapon for a more civilized age",
        purchasePrice: 1000,
        stock: 10,
      };
      const response1 = await request(app).post("/products").send(input1);

      expect(response1.status).toBe(201);
      expect(response1.body.id).toBeDefined();

      const productId1 = response1.body.id;
      const product1Name = response1.body.name;
      const product1Description = response1.body.description;

      const input2 = {
        name: "TIE Fighter",
        description: "The fighter of the Empire",
        purchasePrice: 100000,
        stock: 5,
      };
      const response2 = await request(app).post("/products").send(input2);

      expect(response2.status).toBe(201);
      expect(response2.body.id).toBeDefined();

      const productId2 = response2.body.id;
      const product2Name = response2.body.name;
      const product2Description = response2.body.description;

      // Create Store Catalog
      const inputStore = {
        id: productId1,
        name: product1Name,
        description: product1Description,
        salesPrice: 1500,
      };
      const responseStore = await request(app)
        .post("/store-catalog")
        .send(inputStore);

      expect(responseStore.status).toBe(201);
      expect(responseStore.body.id).toBeDefined();

      const inputStore2 = {
        id: productId2,
        name: product2Name,
        description: product2Description,
        salesPrice: 150000,
      };
      const responseStore2 = await request(app)
        .post("/store-catalog")
        .send(inputStore2);

      expect(responseStore2.status).toBe(201);
      expect(responseStore2.body.id).toBeDefined();

      const input = {
        clientId,
        products: [
          {
            productId: productId1,
          },
          {
            productId: productId2,
          },
        ],
      };
      const response = await request(app).post("/checkout").send(input);

      expect(response.status).toBe(200);
      expect(response.body.invoiceId).toBeDefined();
    });
  });
});
