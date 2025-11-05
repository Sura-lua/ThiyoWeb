# Railway Deployment Guide

## วิธี Deploy Backend ไปที่ Railway

### 1. สร้างบัญชี Railway
- ไปที่ [railway.app](https://railway.app)
- Sign up ด้วย GitHub

### 2. สร้าง Project ใหม่
- คลิก "New Project"
- เลือก "Deploy from GitHub repo"
- เลือก repository ของคุณ

### 3. ตั้งค่า Service
- เลือก folder `server`
- Railway จะ auto-detect Node.js
- Build Command: `npm install`
- Start Command: `npm start`

### 4. ตั้งค่า Environment Variables
- `NODE_ENV`: `production`
- `PORT`: Railway จะ set ให้อัตโนมัติ
- `ALLOWED_ORIGINS`: (optional) URL ของ frontend

### 5. Deploy
- Railway จะ deploy อัตโนมัติ
- รอให้เสร็จ
- Copy Public URL

### 6. เชื่อมต่อ Frontend
- ไปที่ Vercel Dashboard
- Settings → Environment Variables
- เพิ่ม `VITE_API_URL` = `https://your-railway-url.railway.app/api`

---

## สำหรับ Render (ทางเลือก)

1. ไปที่ [render.com](https://render.com)
2. สร้าง New Web Service
3. เชื่อมต่อ GitHub
4. เลือก folder `server`
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Deploy!

---

## Troubleshooting

### Database ไม่ทำงาน:
- SQLite อาจมีปัญหาใน production
- แนะนำเปลี่ยนเป็น PostgreSQL หรือ MySQL

### Port Error:
- ตรวจสอบว่าใช้ `process.env.PORT`
- Railway จะ set PORT อัตโนมัติ

### CORS Error:
- ตั้งค่า `ALLOWED_ORIGINS` ใน environment variables
- หรือใช้ `*` เพื่อ allow all (ไม่แนะนำสำหรับ production)

