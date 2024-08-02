import {
  BelongsTo,
  Column,
  Model,
  PrimaryKey,
  ForeignKey,
  Table,
} from "sequelize-typescript";
import { OrderModel } from "./order.model";
import { ProductModel } from "../../product-adm/repository/product.model";

@Table({
  tableName: "order_item",
  timestamps: false,
})
export class OrderItemModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @ForeignKey(() => ProductModel)
  @Column({ allowNull: false })
  productId: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  description: string;

  @Column({ allowNull: false })
  salesPrice: number;

  @ForeignKey(() => OrderModel)
  @Column({ allowNull: false })
  orderId: string;

  @BelongsTo(() => OrderModel)
  order: OrderModel;

  @BelongsTo(() => ProductModel)
  product: ProductModel;
}
