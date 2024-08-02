import { Router } from "express";
import FindInvoiceUseCase from "../../../usecase/find-invoice/find-invoice.usecase";
import InvoiceRepository from "../../../repository/invoice.repository";
import { FindInvoiceController } from "../controllers/find-invoice.controller";

const invoiceRouter = Router();

const invoiceRepository = new InvoiceRepository();
const findInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository)
const findInvoiceController = new FindInvoiceController(findInvoiceUseCase);

invoiceRouter.get("/:id", findInvoiceController.handle.bind(findInvoiceController));

export default invoiceRouter;
