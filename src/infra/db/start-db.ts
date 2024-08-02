import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import { ProductModel } from "../../modules/product-adm/repository/product.model";
import { OrderModel } from "../../modules/checkout/repository/order.model";
import { OrderItemModel } from "../../modules/checkout/repository/order-item.model";
import CatalogProductModel from "../../modules/store-catalog/repository/product.model";
import TransactionModel from "../../modules/payment/repository/transaction.model";
import { InvoiceModel } from "../../modules/invoice/repository/invoice.model";
import { InvoiceItemModel } from "../../modules/invoice/repository/invoice-item.model";

export const startDb = () => {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
    models: [
      ClientModel,
      ProductModel,
      OrderModel,
      OrderItemModel,
      CatalogProductModel,
      TransactionModel,
      InvoiceModel,
      InvoiceItemModel,
    ],
  });

  return sequelize;
};
