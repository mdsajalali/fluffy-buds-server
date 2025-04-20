# 🐾 Fluffy Buds - E-commerce Backend

**Fluffy Buds** is a scalable, production-ready **e-commerce backend** developed with the **MERN** stack. It includes full user authentication, product and cart management, secure **Stripe-based payments**, and admin controls for managing orders and users.

This project demonstrates real-world e-commerce functionality with a clear separation of concerns and RESTful API design.

---

## 🚀 Features

- 👤 **User Authentication** (Register/Login with JWT)
- 🛍️ **Product Management** (Create, Read, Update, Delete)
- 🧺 **Cart System** for logged-in users
- 💳 **Stripe Payment Integration**
- 📦 **Order Management** and tracking
- 🛡️ **Admin Controls** (Manage users, products, orders)

---

## 🛠️ Tech Stack

- **Node.js** – Runtime environment
- **Express.js** – RESTful API framework
- **MongoDB + Mongoose** – NoSQL database & ODM
- **JWT** – Secure authentication
- **Stripe API** – Seamless payment gateway
- **Cloudinary** – Media (image) hosting
- *(Frontend is built separately with React and Tailwind CSS)*

---

## 📌 API Route Overview

RESTful endpoints are categorized into **Users**, **Products**, **Cart**, and **Orders**, with role-based access where applicable.

> ✅ = Requires Auth | 🛡️ = Admin Only

### 👤 User Routes

| Method | Endpoint         | Description               | Auth Required |
|--------|------------------|---------------------------|----------------|
| POST   | `/user/register` | Register a new user       | ❌             |
| POST   | `/user/login`    | Login and receive token   | ❌             |

---

### 🛍️ Product Routes

| Method | Endpoint                          | Description                           | Auth |
|--------|-----------------------------------|---------------------------------------|------|
| GET    | `/products`                       | Get filtered product list             | ❌   |
| GET    | `/all-products`                   | Fetch all products                    | ❌   |
| GET    | `/product/:id`                    | Get product details by ID             | ❌   |
| GET    | `/new-arrivals`                   | Get latest added products             | ❌   |
| POST   | `/create-product`                 | Add a new product                     | ✅🛡️ |
| PUT    | `/update-product/:id`             | Update product by ID                  | ✅🛡️ |
| DELETE | `/delete-product/:id`             | Delete product by ID                  | ✅🛡️ |
| GET    | `/get-total-product-quantity`     | Get total product count               | ✅🛡️ |

---

### 🛒 Cart Routes

| Method | Endpoint       | Description              | Auth |
|--------|----------------|--------------------------|------|
| POST   | `/cart/add`    | Add item to cart         | ✅   |
| POST   | `/cart/remove` | Remove item from cart    | ✅   |
| POST   | `/cart/get`    | Fetch user cart          | ✅   |

---

### 📦 Order Routes

| Method | Endpoint                                 | Description                             | Auth |
|--------|------------------------------------------|-----------------------------------------|------|
| POST   | `/order/place`                           | Place a new order                       | ✅   |
| POST   | `/order/verify`                          | Verify Stripe payment/order             | ❌   |
| POST   | `/order/my-orders`                       | Get logged-in user's orders             | ✅   |
| GET    | `/order/list`                            | Get all orders (Admin)                  | ✅🛡️ |
| GET    | `/order/recent-orders`                   | Fetch recent orders                     | ✅🛡️ |
| POST   | `/order/status`                          | Update order status                     | ✅🛡️ |
| GET    | `/order/get-total-user-order-sales`      | Get user-wise sales data                | ✅🛡️ |
| GET    | `/order/get-last12-months-sales`         | Get 12-month sales analytics            | ✅🛡️ |

---
  

## 💻 Getting Started

1. Clone the repository:

```bash
git clone https://github.com/mdsajalali/fluffy-buds-server.git
```

2. Install dependencies:

```bash
cd fluffy-buds-server
npm install
```

3. Set up environment variables:

Create a **.env** file in the backend and add the following:

```env
DB_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your _stripe_key
FRONTEND_URL=your_frontend_url
cloud_name=your_cloudinary_cloud_name
api_key=your_cloudinary_api_key
api_secret=your_cloudinary_api_secret
```

4. Run the development server:

```bash
npm run dev
```

The app will be available at **http://localhost:5000** 🚀

Check out the [Frontend Repository](https://github.com/mdsajalali/fluffy-buds-client).

Connect with me on [LinkedIn](https://www.linkedin.com/in/mdsajalali/).

Happy coding! 🚀
