## Controllers & Endpoints

### 1. Auth Controller
- `POST /auth/register` — Register a new user  
- `POST /auth/login` — Login  
- `POST /auth/logout` — Logout  
- `POST /auth/refresh-token` — Refresh authentication token  

### 2. Users Controller
- `GET /users/profile` — Get current user profile  
- `PUT /users/profile` — Update current user profile  
- `GET /users/vendors` — List vendors (for customers)  
- `GET /users/:id` — Get a specific user by ID  

### 3. Vendors Controller
- `GET /vendors` — List all vendors with filtering options  
- `GET /vendors/:id` — Get vendor details by ID  
- `POST /vendors` — Create a new vendor (admin only)  
- `PUT /vendors/:id` — Update vendor details  
- `DELETE /vendors/:id` — Delete a vendor  
- `GET /vendors/:id/products` — Get products of a vendor  

### 4. Products Controller
- `GET /products` — List all products with search and filtering  
- `GET /products/:id` — Get product details by ID  
- `POST /products` — Create a new product (vendor only)  
- `PUT /products/:id` — Update product details  
- `DELETE /products/:id` — Delete a product  
- `PATCH /products/:id/stock` — Update product stock quantity  

### 5. Orders Controller
- `POST /orders` — Create a new order (customer only)  
- `GET /orders` — List current user’s orders  
- `GET /orders/:id` — Get details of a specific order  
- `PUT /orders/:id/status` — Update order status (vendor or admin)  
- `GET /vendors/orders` — List orders for a vendor  

### 6. Donations Controller
- `POST /donations` — Create a new donation (vendor only)  
- `GET /donations` — List all donations  
- `PUT /donations/:id/status` — Update donation status  
- `GET /vendors/donations` — List donations for a vendor  

### 7. Reports Controller
- `POST /reports` — Submit a report  
- `GET /reports` — List all reports (admin only)  
- `PUT /reports/:id/status` — Update report status (admin only)  
