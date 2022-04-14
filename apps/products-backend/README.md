# Bioma Interview Backend

Bioma interview backend

Running the server:

```
# Start Docker before running
make dev
# Server is now available on port 8000
```

## Schema

### Definition

- Product: a product offering, such as Olympic Road Bike
- Product Variant Group: a grouping that consists of multiple variants, such as Size and Color
- Product Variant: a variant of the product, such as Small and Blue
- Product Item: a combination of the variants for the product, such as Olympic Road Bike Small Blue

### Relationship

Products

- has many Product Variant Groups, e.g. Size, Color, Wheels
- has many Product Items, e.g. Small Blue Bike with 4 Wheels
  - has many Product Variants, e.g. Small, Blue, 4 Wheels

Product Variant Groups, e.g. Size

- has many Product Variants, e.g. Small

## APIs

### Products list - GET localhost:8000/api/products

Fetches all products with variants.

Sample Response:

```
{
   "products" : [
      {
         "brand" : "Olympic",
         "created_at" : "2022-03-09T02:52:21.082822Z",
         "deleted_at" : null,
         "description" : "Road Bike",
         "id" : 1,
         "name" : "Bike",
         "product_item" : [
            {
               "created_at" : "2022-03-09T02:52:21.084729Z",
               "deleted_at" : null,
               "height_cm" : 10,
               "id" : 1,
               "is_active" : true,
               "length_cm" : 10,
               "product_id" : 1,
               "product_variants" : [
                  {
                     "created_at" : "2022-03-09T02:52:21.071207Z",
                     "deleted_at" : null,
                     "id" : 1,
                     "name" : "Small",
                     "product_variant_group_id" : 1,
                     "updated_at" : "2022-03-09T02:52:21.071207Z"
                  },
                  {
                     "created_at" : "2022-03-09T02:52:21.071207Z",
                     "deleted_at" : null,
                     "id" : 2,
                     "name" : "Medium",
                     "product_variant_group_id" : 1,
                     "updated_at" : "2022-03-09T02:52:21.071207Z"
                  },
                  {
                     "created_at" : "2022-03-09T02:52:21.071207Z",
                     "deleted_at" : null,
                     "id" : 3,
                     "name" : "Large",
                     "product_variant_group_id" : 1,
                     "updated_at" : "2022-03-09T02:52:21.071207Z"
                  }
               ],
               "retail_price" : 1000,
               "updated_at" : "2022-03-09T02:52:21.084729Z",
               "weight_kg" : 1,
               "width_cm" : 10
            }
         ],
         "product_variant_groups" : [
            {
               "created_at" : "2022-03-09T02:52:21.068379Z",
               "deleted_at" : null,
               "description" : "Item size",
               "id" : 1,
               "name" : "Size",
               "updated_at" : "2022-03-09T02:52:21.068379Z"
            }
         ],
         "updated_at" : "2022-03-09T02:52:21.082822Z"
      }
   ]
}
```

### Product create - POST localhost:8000/api/products

Accept creation of products with variants.

Request:

```
{
   "name" : "Bike",
   "brand" : "Olympic",
   "description" : "Road Bike",
   "product_item" : [
      {
         "is_active" : true,
         "retail_price" : 1000,
         "height_cm" : 10,
         "length_cm" : 10,
         "weight_kg" : 1,
         "width_cm" : 10
         "product_variant_ids" : [1, 2, 3],
      }
   ],
   "product_variant_group_ids" : [1]
}
```

### Product update - PATCH localhost:8000/api/products/{product_id}

Accept updating of products with variants.

Request:

```
{
   "name" : "New Bike",
   "brand" : "New Olympic",
   "description" : "New Road Bike",
   "product_item" : [
      {
         "product_item_id" : 1,
         "is_active" : false,
         "retail_price" : 10000,
         "height_cm" : 100,
         "length_cm" : 100,
         "weight_kg" : 2,
         "width_cm" : 100
         "product_variant_ids" : [1],
      }
   ],
   "product_variant_group_ids" : [1]
}
```

### Product fetch - GET localhost:8000/api/products/{product_id}

Get a single product details

```
{
   "product" : {
      "brand" : "Olympic",
      "created_at" : "2022-03-09T02:52:21.082822Z",
      "deleted_at" : null,
      "description" : "Road Bike",
      "id" : 1,
      "name" : "Bike",
      "product_item" : [
         {
            "created_at" : "2022-03-09T02:52:21.084729Z",
            "deleted_at" : null,
            "height_cm" : 10,
            "id" : 1,
            "is_active" : true,
            "length_cm" : 10,
            "product_id" : 1,
            "product_variants" : [
               {
                  "created_at" : "2022-03-09T02:52:21.071207Z",
                  "deleted_at" : null,
                  "id" : 1,
                  "name" : "Small",
                  "product_variant_group_id" : 1,
                  "updated_at" : "2022-03-09T02:52:21.071207Z"
               },
               {
                  "created_at" : "2022-03-09T02:52:21.071207Z",
                  "deleted_at" : null,
                  "id" : 2,
                  "name" : "Medium",
                  "product_variant_group_id" : 1,
                  "updated_at" : "2022-03-09T02:52:21.071207Z"
               },
               {
                  "created_at" : "2022-03-09T02:52:21.071207Z",
                  "deleted_at" : null,
                  "id" : 3,
                  "name" : "Large",
                  "product_variant_group_id" : 1,
                  "updated_at" : "2022-03-09T02:52:21.071207Z"
               }
            ],
            "retail_price" : 1000,
            "updated_at" : "2022-03-09T02:52:21.084729Z",
            "weight_kg" : 1,
            "width_cm" : 10
         }
      ],
      "product_variant_groups" : [
         {
            "created_at" : "2022-03-09T02:52:21.068379Z",
            "deleted_at" : null,
            "description" : "Item size",
            "id" : 1,
            "name" : "Size",
            "updated_at" : "2022-03-09T02:52:21.068379Z"
         }
      ],
      "updated_at" : "2022-03-09T02:52:21.082822Z"
   }
}
```

### Product delete - DELETE localhost:8000/api/products/{product_id}

Delete a product

### Product variant group list - GET localhost:8000/api/product_variant_groups

Get list of available product variant groups.

```
{
   "product_variant_groups" : [
      {
         "created_at" : "2022-03-09T02:52:21.068379Z",
         "deleted_at" : null,
         "description" : "Item size",
         "id" : 1,
         "name" : "Size",
         "product_variants" : [
            {
               "created_at" : "2022-03-09T02:52:21.071207Z",
               "deleted_at" : null,
               "id" : 1,
               "name" : "Small",
               "product_variant_group_id" : 1,
               "updated_at" : "2022-03-09T02:52:21.071207Z"
            },
            {
               "created_at" : "2022-03-09T02:52:21.071207Z",
               "deleted_at" : null,
               "id" : 2,
               "name" : "Medium",
               "product_variant_group_id" : 1,
               "updated_at" : "2022-03-09T02:52:21.071207Z"
            },
            {
               "created_at" : "2022-03-09T02:52:21.071207Z",
               "deleted_at" : null,
               "id" : 3,
               "name" : "Large",
               "product_variant_group_id" : 1,
               "updated_at" : "2022-03-09T02:52:21.071207Z"
            }
         ],
         "updated_at" : "2022-03-09T02:52:21.068379Z"
      }
   ]
}
```

### Product variant group create - POST localhost:8000/api/product_variant_groups

Create a product variant group and its variants.

Request:

```
{
   "name" : "Size",
   "description" : "Item size",
   "product_variants" : [
      {
         "name" : "Small",
      },
      {
         "name" : "Medium",
      },
      {
         "name" : "Large",
      }
   ],
}
```

### Product variant group fetch - GET localhost:8000/api/product_variant_groups/{id}

Get a single product variant group.

```
{
   "created_at" : "2022-03-09T02:52:21.068379Z",
   "deleted_at" : null,
   "description" : "Item size",
   "id" : 1,
   "name" : "Size",
   "product_variants" : [
      {
         "created_at" : "2022-03-09T02:52:21.071207Z",
         "deleted_at" : null,
         "id" : 1,
         "name" : "Small",
         "product_variant_group_id" : 1,
         "updated_at" : "2022-03-09T02:52:21.071207Z"
      },
      {
         "created_at" : "2022-03-09T02:52:21.071207Z",
         "deleted_at" : null,
         "id" : 2,
         "name" : "Medium",
         "product_variant_group_id" : 1,
         "updated_at" : "2022-03-09T02:52:21.071207Z"
      },
      {
         "created_at" : "2022-03-09T02:52:21.071207Z",
         "deleted_at" : null,
         "id" : 3,
         "name" : "Large",
         "product_variant_group_id" : 1,
         "updated_at" : "2022-03-09T02:52:21.071207Z"
      }
   ],
   "updated_at" : "2022-03-09T02:52:21.068379Z"
}
```
