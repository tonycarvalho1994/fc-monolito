import { Router } from "express";
import ProductRepository from "../../../repository/product.repository";
import AddProductUseCase from "../../../usecase/add-product/add-product.usecase";
import { AddProductController } from "../controllers/add-product.controller";

const productRouter = Router();

const productRepository = new ProductRepository();
const addProductUseCase = new AddProductUseCase(productRepository);
const addProductController = new AddProductController(addProductUseCase);

productRouter.post("/", addProductController.handle.bind(addProductController));

export default productRouter;
