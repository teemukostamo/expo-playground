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
