# Environment Variables สำหรับ Production

## Frontend (.env.production)
VITE_API_URL=https://your-backend-url.com/api

## Backend (.env)
PORT=3001
NODE_ENV=production

## ตัวอย่างการใช้งาน:
1. สร้างไฟล์ .env.production ใน root folder
2. สร้างไฟล์ .env ใน folder server
3. ใส่ค่า environment variables ตามที่ต้องการ

## สำหรับ Vercel:
- ตั้งค่าใน Vercel Dashboard → Settings → Environment Variables

## สำหรับ Netlify:
- ตั้งค่าใน Netlify Dashboard → Site settings → Environment variables

## สำหรับ Render:
- ตั้งค่าใน Render Dashboard → Environment → Environment Variables

