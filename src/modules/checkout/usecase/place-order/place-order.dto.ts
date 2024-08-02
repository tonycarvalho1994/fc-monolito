export interface PlaceOrderInputDto {
  clientId: string;
  products: {
    productId: string;
  }[];
}

export interface PlaceOrderOutputDto {
  orderId: string;
  invoiceId: string;
  total: number;
  products: {
    productId: string;
  }[];
}
