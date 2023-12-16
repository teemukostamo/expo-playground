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

export interface LineItemNode {
  title: string;
  variant: {
    id: string;
  };
  currentQuantity: number;
  customAttributes: Array<{
    key: string;
    value: string;
  }>;
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
      node: LineItemNode;
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

export interface PickupTime {
  name: string;
  integration_name: string;
  end_sales_time: string; // formatted as date-time
}

export interface PickupLocation {
  name: string;
  integration_name: string;
  description: string;
  img_src: string; // formatted as URI
}

export interface PickupOptions {
  pickup_times: PickupTime[];
  pickup_locations: PickupLocation[];
}
