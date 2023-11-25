export interface CartItem {
  variantId: string;
  title: string;
  variantTitle?: string;
  price: number;
  quantity: number;
  imageSrc?: string;
}
