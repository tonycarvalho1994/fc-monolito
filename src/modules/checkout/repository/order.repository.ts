import Id from "../../@shared/domain/value-object/id.value-object";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import { OrderItemModel } from "./order-item.model";
import { OrderModel } from "./order.model";

export default class CheckoutRepository implements CheckoutGateway {
  async addOrder(entity: Order): Promise<void> {
    await OrderModel.create({
      id: entity.id.id,
      clientId: entity.client.id.id,
      status: entity.status,
    });

    await Promise.all(
      entity.products.map((product) => {
        return OrderItemModel.create({
          id: new Id().id,
          productId: product.id.id,
          name: product.name,
          description: product.description,
          salesPrice: product.salesPrice,
          orderId: entity.id.id,
        });
      })
    );
  }

  async findOrder(id: string): Promise<Order> {
    const order = await OrderModel.findOne({ where: { id } });

    if (!order) {
      throw new Error("Order not found");
    }

    const orderItems = await OrderItemModel.findAll({
      where: { orderId: id },
    });

    return new Order({
      id: new Id(order.id),
      client: null,
      products: orderItems.map(
        (item) =>
          new Product({
            id: new Id(item.productId),
            name: item.name,
            description: item.description,
            salesPrice: item.salesPrice,
          })
      ),
      status: order.status,
    });
  }
}
