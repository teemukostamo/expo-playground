export type CustomAttribute = {
  key: string;
  value: string;
};

export interface CartItem {
  variantId: string;
  title: string;
  variantTitle?: string;
  price: number;
  quantity: number;
  imageSrc?: string;
  customAttributes: CustomAttribute[];
}

export type ProductAttributeOptions = {
  humanReadable: string;
  integration: string;
};

export interface CustomerOrdersQuery {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    orders: {
      edges: Array<{
        node: OrderNode;
      }>;
    };
  };
}

export interface OrderNode {
  id: string;
  name: string;
  customAttributes: Array<{
    key: string;
    value: string;
  }>;
  orderNumber: string;
  processedAt: string;
  totalPriceV2: {
    amount: string;
    currencyCode: string;
  };
  lineItems: {
    edges: Array<{
      node: {
        title: string;
        quantity: number;
      };
    }>;
  };
}

export interface Order {
  node: OrderNode;
  parsedEventDate?: Date;
}

export interface SortedOrders {
  past: Order[];
  upcoming: Order[];
}
