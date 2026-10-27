# 🌾 AgriTech - Empowering Farmers Through Digital Technology (MERN)

Smart farming management system: MongoDB, Express, React (Vite), Node.js.

## Modules (as per project instructions)
1. **User Registration & Login** - JWT auth, bcrypt password hashing, roles (farmer / admin)
2. **Farm Profile Setup & Management** - full CRUD, owner-only access
3. **Crop Monitoring & Soil Health Analysis** - crop CRUD + status tracking; soil report (pH, N, P, K advice + suggested crops)
4. **Weather Forecasting & Pest Alerts** - OpenWeatherMap integration (demo data if no key) + rule-based pest/weather alerts
5. **Resource Purchase & Order Tracking** - product store, cart, orders, atomic stock handling, status tracking, cancel
6. **Expert Consultation & Community Forum** - private questions answered by admin (expert), public forum with comments
7. **Admin Dashboard** - stats, users/roles, products, order approval, content moderation

Also: multilingual UI (English + Hindi), responsive Bootstrap UI, Chart.js charts, lazy loading / code splitting,
request logging + central error handling middleware, DB indexes.

## Collections
Users, Farms, Crops, Products, Orders, WeatherData, Posts (forum + consultation)

## Run locally
### Backend
```bash
cd backend
npm install
cp .env.example .env     # fill MONGO_URI, JWT_SECRET (OPENWEATHER_API_KEY optional)
npm run seed             # sample data + accounts
npm run dev              # http://localhost:5000
```
### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev              # http://localhost:5173
```
Demo logins: `admin@agritech.com / admin123`, `farmer@agritech.com / farmer123`

## API (all except register/login need `Authorization: Bearer <token>`)
| Route | Notes |
|---|---|
| POST /api/auth/register, /login; GET /me; PUT /language | |
| /api/farms (CRUD), GET /api/farms/:id/soil | owner only |
| /api/crops (CRUD) | owner only |
| GET /api/weather?city=, /api/weather/history?city= | alerts included |
| GET /api/products; POST/PUT/DELETE | write = admin |
| POST /api/orders, GET /my, PUT /:id/cancel; GET /, PUT /:id/status | last two admin |
| /api/posts (GET ?category=, POST, POST /:id/comments, DELETE) | consultations are private |
| /api/admin/stats, /users, PUT /users/:id/role, DELETE /users/:id | admin |

## Testing with Postman
Import requests for each route above; test with farmer token vs admin token to verify role-based access (403 for farmer on admin routes).

## Deploy
- DB: MongoDB Atlas
- Backend: Render (root `backend`, start `npm start`, add env vars)
- Frontend: Vercel/Netlify (root `frontend`, build `npm run build`, output `dist`, env `VITE_API_URL=https://YOUR-BACKEND.onrender.com/api`)
- Set backend `CLIENT_URL` to the frontend URL.
