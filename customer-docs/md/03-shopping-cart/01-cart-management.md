# 🛒 Shopping Cart Management

This guide details shopping cart operations for both authenticated users and anonymous guest shoppers. The cart system supports real-time stock validation, dynamic totals calculation, item quantity adjustments, and auto-cleanup.

---

## 📋 Endpoints Overview

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/cart` | Guest / Authenticated | Fetch current shopping cart with item totals and stock status |
| `POST` | `/api/v1/cart/items` | Guest / Authenticated | Add a product variant to cart (increments if exists) |
| `PATCH` | `/api/v1/cart/items/:itemId` | Guest / Authenticated | Update item quantity (setting `0` removes item) |
| `DELETE` | `/api/v1/cart/items/:itemId` | Guest / Authenticated | Remove specific item from cart |
| `DELETE` | `/api/v1/cart` | Guest / Authenticated | Empty the entire shopping cart |

---

## 🔑 Header Requirements

| Header | Required For | Description |
| :--- | :--- | :--- |
| `Authorization` | Authenticated Users | `Bearer <accessToken>` |
| `x-session-id` | Guest Shoppers | Unique guest UUID stored in browser `localStorage` |

---

## 1. Get Active Shopping Cart

Retrieves the current cart with calculated subtotals, item discounts, currency, and stock check alerts.

### Request
```http
GET /api/v1/cart HTTP/1.1
Host: api.example.com
Authorization: Bearer <accessToken>
x-session-id: guest_sess_01J8R9XYZ
```

### Response `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "cart_01J8R9QWE5566",
    "userId": "usr_01J8R9XYZ8877",
    "currency": "USD",
    "itemCount": 3,
    "subtotal": 214.97,
    "discountTotal": 30.00,
    "total": 184.97,
    "items": [
      {
        "id": "cart_item_01",
        "variantId": "var_cyan_sz10_01",
        "productId": "prod_01J8R9QWE1001",
        "productTitle": "Ultra-light Performance Running Shoes",
        "variantTitle": "Cyan / Size 10",
        "sku": "RUN-SHOE-CYAN-10",
        "thumbnailUrl": "https://assets.example.com/products/running-shoes-cyan-1.jpg",
        "unitPrice": 99.99,
        "originalPrice": 129.99,
        "quantity": 1,
        "lineTotal": 99.99,
        "isAvailable": true,
        "availableStock": 14,
        "attributes": [
          { "name": "Color", "value": "Cyan" },
          { "name": "Size", "value": "10" }
        ]
      },
      {
        "id": "cart_item_02",
        "variantId": "var_socks_blk_01",
        "productId": "prod_rel_01",
        "productTitle": "Breathable Running Socks (3-Pack)",
        "variantTitle": "Black / L",
        "sku": "SOCK-BLK-L",
        "thumbnailUrl": "https://assets.example.com/products/socks.jpg",
        "unitPrice": 14.99,
        "originalPrice": 14.99,
        "quantity": 2,
        "lineTotal": 29.98,
        "isAvailable": true,
        "availableStock": 50,
        "attributes": [
          { "name": "Size", "value": "Large" }
        ]
      }
    ],
    "expiresAt": "2026-09-19T07:20:00.000Z"
  }
}
```

---

## 2. Add Item to Cart

Adds a chosen product variant. If the variant is already present in the cart, the quantity is automatically incremented up to the maximum available stock.

### Request
```http
POST /api/v1/cart/items HTTP/1.1
Host: api.example.com
Authorization: Bearer <accessToken>
x-session-id: guest_sess_01J8R9XYZ
Content-Type: application/json

{
  "variantId": "var_cyan_sz10_01",
  "quantity": 1
}
```

### Response `200 OK`
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "cartId": "cart_01J8R9QWE5566",
    "itemCount": 3,
    "subtotal": 214.97,
    "addedItem": {
      "id": "cart_item_01",
      "variantId": "var_cyan_sz10_01",
      "quantity": 1,
      "unitPrice": 99.99,
      "lineTotal": 99.99
    }
  }
}
```

### Error Responses
- `400 Bad Request`: Requested quantity exceeds available inventory.
- `404 Not Found`: Variant ID does not exist or product is archived.

---

## 3. Update Item Quantity

Updates the quantity for a specific item in the cart. Passing `quantity: 0` deletes the item.

### Request
```http
PATCH /api/v1/cart/items/cart_item_01 HTTP/1.1
Host: api.example.com
Authorization: Bearer <accessToken>
x-session-id: guest_sess_01J8R9XYZ
Content-Type: application/json

{
  "quantity": 2
}
```

### Response `200 OK`
```json
{
  "success": true,
  "message": "Cart item quantity updated",
  "data": {
    "id": "cart_item_01",
    "quantity": 2,
    "lineTotal": 199.98,
    "cartSubtotal": 229.96
  }
}
```

---

## 4. Remove Item from Cart

### Request
```http
DELETE /api/v1/cart/items/cart_item_01 HTTP/1.1
Host: api.example.com
Authorization: Bearer <accessToken>
x-session-id: guest_sess_01J8R9XYZ
```

### Response `200 OK`
```json
{
  "success": true,
  "message": "Item removed from cart",
  "data": {
    "cartId": "cart_01J8R9QWE5566",
    "itemCount": 2,
    "subtotal": 29.98
  }
}
```

---

## 5. Clear Entire Cart

### Request
```http
DELETE /api/v1/cart HTTP/1.1
Host: api.example.com
Authorization: Bearer <accessToken>
x-session-id: guest_sess_01J8R9XYZ
```

### Response `200 OK`
```json
{
  "success": true,
  "message": "Shopping cart cleared"
}
```
