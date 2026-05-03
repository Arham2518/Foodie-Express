# 🍕 Foodie Express

A full-stack food delivery platform built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) as a university lab project.

---

## 📌 Case Study Summary

Foodie Express onboards restaurants of all types — pizza joints, burger shops, desi food corners, and bakeries. Each restaurant has a **different menu structure**:

- Some have simple menus (5–10 items, no extras)
- Some have **customizable dishes** (toppings, sizes, sauces, crust types)
- Some sell **combo meals** (multiple items grouped together)
- Data is **irregular** — one restaurant's dish may have fields another doesn't
- Customers leave **dynamic reviews** — text, star ratings, and optional images

MongoDB's flexible document model is the ideal fit for this domain.

---

## 🗂 Project Structure

```
foodie-express/
├── backend/
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── seed.js             # Sample data seeder
│   ├── controllers/
│   │   ├── restaurantController.js
│   │   └── orderController.js
│   ├── models/
│   │   ├── Restaurant.js       # Flexible schema (menu + reviews embedded)
│   │   └── Order.js            # Order with auto-computed totals
│   ├── routes/
│   │   ├── restaurantRoutes.js
│   │   └── orderRoutes.js
│   ├── uploads/                # Review images saved here (auto-created)
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Express entry point
│
└── frontend/
    ├── public/
    │   └── index.html          # Required HTML shell
    ├── src/
    │   ├── components/
    │   │   ├── RestaurantList.jsx
    │   │   ├── RestaurantDetail.jsx
    │   │   └── OrderForm.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   └── index.js
    └── package.json
```

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port `27017`
- npm (comes with Node.js)

---

## 🚀 Setup & Run

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
node config/seed.js    # seed sample restaurants
npm run dev            # starts on http://localhost:5000
```

### 2. Frontend (new terminal)

```bash
cd frontend
npm install
npm start              # starts on http://localhost:3000
```

---

## 🌐 API Endpoints

### Restaurants
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/restaurants` | List all (`?type=pizza&name=abc`) |
| GET | `/api/restaurants/:id` | Full detail with menu & reviews |
| POST | `/api/restaurants` | Create restaurant |
| PUT | `/api/restaurants/:id` | Update restaurant |
| DELETE | `/api/restaurants/:id` | Delete restaurant |

### Menu Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/restaurants/:id/menu` | Add menu item |
| PUT | `/api/restaurants/:id/menu/:itemId` | Update item |
| DELETE | `/api/restaurants/:id/menu/:itemId` | Delete item |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/restaurants/:id/reviews` | Get all reviews |
| POST | `/api/restaurants/:id/reviews` | Add review + optional image |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place order |
| GET | `/api/orders` | List orders (`?status=pending`) |
| GET | `/api/orders/:id` | Single order |
| PATCH | `/api/orders/:id/status` | Update delivery status |

---

## 🗃️ Sample Request Bodies

**Simple menu item:**
```json
{ "name": "Croissant", "price": 180, "category": "Pastries" }
```

**Customizable item:**
```json
{
  "name": "Margherita Pizza", "price": 799, "category": "Pizza",
  "customizations": [
    {
      "groupName": "Size", "required": true, "multiSelect": false,
      "options": [{ "name": "Small", "price": 0 }, { "name": "Large", "price": 400 }]
    }
  ]
}
```

**Combo item:**
```json
{
  "name": "Karahi Combo", "price": 1200, "category": "Combo",
  "comboItems": ["Chicken Karahi 750g", "4x Naan", "2x Soft Drinks"]
}
```

**Place an order:**
```json
{
  "restaurantId": "<id>",
  "customerName": "Ali Hassan",
  "customerPhone": "0300-1234567",
  "deliveryAddress": "House 5, Street 3, DHA Lahore",
  "paymentMethod": "cash_on_delivery",
  "items": [
    {
      "menuItemId": "<itemId>", "name": "Margherita Pizza",
      "basePrice": 799, "quantity": 1,
      "selectedCustomizations": [
        { "groupName": "Size", "chosen": [{ "name": "Large", "price": 400 }] }
      ]
    }
  ]
}
```

---

## 🧠 Key Concepts Demonstrated

| Concept | How It's Used |
|---------|---------------|
| NoSQL flexible schema | Each menu item carries only the fields it needs |
| Embedded subdocuments | Menu & reviews live inside the Restaurant document |
| `Mixed` type | `extras` field stores any irregular per-restaurant data |
| Mongoose pre-save hooks | Auto-recalculates rating; auto-computes order totals |
| File uploads (Multer) | Review images via `multipart/form-data` |
| React Router | Navigation between restaurant list and detail page |
| Axios service layer | All API calls centralized in `services/api.js` |

---

## 🍽 Seeded Sample Data

| Restaurant | Type | Menu Style |
|------------|------|------------|
| Pizza Palace | Pizza | Customizable (size + toppings) |
| Burger Barn | Burger | Simple (no customizations) |
| Desi Dhaba | Desi | Combos + customizable portions |
| Sweet Crumbs Bakery | Bakery | Simple (minimal fields only) |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Database | MongoDB + Mongoose |
| Backend | Node.js + Express.js |
| Frontend | React.js + React Router v6 |
| HTTP Client | Axios |
| File Uploads | Multer |
| Dev Server | Nodemon |

---

## 📝 Notes

- `uploads/` folder is created automatically on first review image upload.
- Order totals are computed **server-side** via Mongoose pre-save hooks.
- The `proxy` in `frontend/package.json` points to `http://localhost:5000` — no hardcoded URLs needed in development.

---

**Lab Project — Web Technologies | 4th Semester | MERN Stack**
