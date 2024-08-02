import { Router } from "express";
import ClientAdmFacadeFactory from "../../../../client-adm/factory/client-adm.facade.factory";
import ProductAdmFacadeFactory from "../../../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../../../store-catalog/factory/facade.factory";
import InvoiceFacadeFactory from "../../../../invoice/factory/client-adm.facade.factory";
import PaymentFacadeFactory from "../../../../payment/factory/payment.facade.factory";

import PlaceOrderUseCase from "../../../usecase/place-order/place-order.usecase";
import { PlaceOrderController } from "../controllers/place-order.controller";
import CheckoutRepository from "../../../repository/order.repository";

const checkoutRouter = Router();

const clientFacade = ClientAdmFacadeFactory.create();
const productFacate = ProductAdmFacadeFactory.create();
const catalogFacade = StoreCatalogFacadeFactory.create();
const invoiceFacade = InvoiceFacadeFactory.create();
const paymentFacade = PaymentFacadeFactory.create();
const checkoutRepository = new CheckoutRepository();
const placeOrderUseCase = new PlaceOrderUseCase(
  clientFacade,
  productFacate,
  catalogFacade,
  checkoutRepository,
  invoiceFacade,
  paymentFacade
);

const placeOrderController = new PlaceOrderController(placeOrderUseCase);

checkoutRouter.post(
  "/",
  placeOrderController.handle.bind(placeOrderController)
);

export default checkoutRouter;
