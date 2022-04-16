
// | Products Type
export type ProductItem = {
  id: number;
  product_id: number;
  is_active: boolean;
  retail_price: number;
  height_cm: number;
  length_cm: number;
  weight_kg: number;
  width_cm: number;
  product_variants?: ProductVariant[]
  product_variant_ids: number[]

}

type ProductVariantGroup = {
  id: number;
  name: string;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

type ProductVariant = ProductVariantGroup & {
  product_variant_group_id: number;
}

export type ProductsPayloadT = {
  id?: number;
  name: string;
  brand: string;
  description: string;
  product_variant_groups: ProductVariantGroup[]

  // Used for lists
  product_items: ProductItem[];

  // Used for view
  product_item: ProductItem[];
}


export type ProductListsResponse = {
  products: ProductsPayloadT[]
}

export type ProductViewResponse = {
  product: ProductsPayloadT
}

// | Variant Group Types
export type VariantGroupPayloadT = {
  name: string;
  description: string;
  product_variants: [
    {
      name: string
    }
  ]
}
