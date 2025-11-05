# ร้านโปรด นั่งชิว บาร์เบียร์

ระบบจัดการร้านเครื่องดื่มออนไลน์ สำหรับพนักงานหลายคนใช้งานพร้อมกัน

## Features

- 🍺 จัดการโต๊ะ 20 โต๊ะ
- 📝 รับออเดอร์และจัดการออเดอร์
- 📊 รายงานรายได้และสถิติ (พร้อมกราฟ)
- 📦 จัดการสต๊อกสินค้า
- 🎯 Real-time sync ระหว่างพนักงานหลายคน

## การติดตั้ง

### 1. ติดตั้ง Dependencies

```bash
# ติดตั้ง dependencies สำหรับ frontend
npm install

# ติดตั้ง dependencies สำหรับ backend
cd server
npm install
```

### 2. เริ่มต้น Backend Server

```bash
# Development mode (auto-reload)
npm run server:dev

# Production mode
npm run server
```

Backend จะรันที่ `http://localhost:3001`

### 3. เริ่มต้น Frontend

```bash
npm run dev
```

Frontend จะรันที่ `http://localhost:5173`

## การใช้งาน

1. เปิดเบราว์เซอร์ไปที่ `http://localhost:5173`
2. เลือกโต๊ะเพื่อเริ่มออเดอร์
3. ข้อมูลจะ sync อัตโนมัติระหว่างพนักงานทุกคน

## Admin Login

- Username: `admin`
- Password: `admin123`

## Tech Stack

- **Frontend**: React, Vite, React Router, Recharts
- **Backend**: Express.js, SQLite
- **API**: RESTful API with polling for real-time updates

## 🚀 Deploy เป็นออนไลน์

### Frontend (Vercel)

1. ไปที่ [vercel.com](https://vercel.com)
2. Sign up/Login ด้วย GitHub
3. คลิก "Add New Project"
4. เลือก repository `ThiyoWeb`
5. ตั้งค่า Environment Variables:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.railway.app/api` (ใส่ URL ของ backend)
6. Deploy!

### Backend (Railway)

1. ไปที่ [railway.app](https://railway.app)
2. Sign up/Login ด้วย GitHub
3. คลิก "New Project" → "Deploy from GitHub repo"
4. เลือก repository และ folder `server`
5. Railway จะ deploy อัตโนมัติ
6. คลิก service → Settings → Networking → Copy Public Domain
7. นำ URL ไปใส่ใน `VITE_API_URL` ของ Vercel (เพิ่ม `/api` ต่อท้าย)

### หลัง Deploy

- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.railway.app`
- API: `https://your-app.railway.app/api`

## Database

ข้อมูลจะถูกเก็บใน SQLite database (`server/database.db`)
