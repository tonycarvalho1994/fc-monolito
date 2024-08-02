import express from "express";
import bodyParser from "body-parser";
import clientRouter from "../../modules/client-adm/infra/web/routes/client.routes";
import productRouter from "../../modules/product-adm/infra/web/routes/product.routes";
import checkoutRouter from "../../modules/checkout/infra/web/routes/checkout.routes";
import catalogProductRouter from "../../modules/store-catalog/infra/web/routes/product.routes";
import invoiceRouter from "../../modules/invoice/infra/web/routes/invoice.routes";

const app = express();

app.use(bodyParser.json());
app.use("/clients", clientRouter);
app.use("/products", productRouter);
app.use("/store-catalog", catalogProductRouter);
app.use("/checkout", checkoutRouter);
app.use("/invoice", invoiceRouter);

export default app;
