
type ProductItem = {
  product_item_id: number;
  is_active: boolean;
  retail_price: number;
  height_cm: number;
  length_cm: number;
  weight_kg: number;
  width_cm: number;
  product_variant_ids: number[]

}

export type ProductsPayloadT = {
  name: string;
  brand: string;
  description: string;
  product_item: ProductItem[];
  product_variant_group_ids?: number[]
}
