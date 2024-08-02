import { Router } from "express";
import CatalogProductRepository from "../../../repository/product.repository";
import { AddCatalogProductController } from "../controllers/add-product.controller";
import AddCatalogProductUseCase from "../../../usecase/add-product/add-product.usecase";

const catalogProductRouter = Router();

const catalogProductRepository = new CatalogProductRepository();
const addCatalogProductUseCase = new AddCatalogProductUseCase(
  catalogProductRepository
);
const addCatalogProductController = new AddCatalogProductController(
  addCatalogProductUseCase
);

catalogProductRouter.post(
  "/",
  addCatalogProductController.handle.bind(addCatalogProductController)
);

export default catalogProductRouter;
