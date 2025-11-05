# คู่มือการ Deploy ร้านโปรด นั่งชิว บาร์เบียร์

## 🎯 วิธี Deploy แบบง่ายที่สุด (แนะนำ)

### ขั้นตอนที่ 1: เตรียม Code
1. อัพโหลด code ขึ้น GitHub
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

### ขั้นตอนที่ 2: Deploy Frontend (Vercel)

**วิธีที่ 1: ผ่านเว็บ**
1. ไปที่ [vercel.com](https://vercel.com)
2. Sign up/Login ด้วย GitHub
3. คลิก "Add New Project"
4. เลือก repository ที่ต้องการ
5. Configure Project:
   - Framework Preset: Vite
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Environment Variables:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.com/api` (ใส่หลังจาก deploy backend)
7. Deploy!

**วิธีที่ 2: ผ่าน CLI**
```bash
npm install -g vercel
vercel
```

### ขั้นตอนที่ 3: Deploy Backend (Railway)

**วิธีที่ 1: ผ่านเว็บ**
1. ไปที่ [railway.app](https://railway.app)
2. Sign up/Login ด้วย GitHub
3. คลิก "New Project"
4. เลือก "Deploy from GitHub repo"
5. เลือก repository ของคุณ
6. เลือก folder `server`
7. Railway จะ auto-detect และ deploy
8. คลิกที่ service → Settings → Generate Domain
9. Copy domain URL (เช่น: `https://your-app.railway.app`)
10. ตั้งค่า Environment Variables (ถ้าต้องการ)

**วิธีที่ 2: ผ่าน CLI**
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### ขั้นตอนที่ 4: เชื่อมต่อ Frontend กับ Backend

1. กลับไปที่ Vercel Dashboard
2. ไปที่ Settings → Environment Variables
3. แก้ไข `VITE_API_URL` เป็น URL ของ backend (เช่น: `https://your-app.railway.app/api`)
4. Redeploy frontend

---

## 📋 Checklist

### ก่อน Deploy:
- [ ] อัพ code ขึ้น GitHub
- [ ] ทดสอบ local ว่า frontend และ backend ทำงานได้
- [ ] สร้างไฟล์ `.env.production` สำหรับ frontend

### Deploy Frontend:
- [ ] สร้างบัญชี Vercel
- [ ] Deploy frontend
- [ ] ตั้งค่า environment variable `VITE_API_URL`

### Deploy Backend:
- [ ] สร้างบัญชี Railway/Render
- [ ] Deploy backend
- [ ] Copy backend URL
- [ ] อัพเดท `VITE_API_URL` ใน Vercel

### หลัง Deploy:
- [ ] ทดสอบว่า frontend เชื่อมต่อ backend ได้
- [ ] ทดสอบการทำงานทั้งหมด
- [ ] ตั้งค่า Custom Domain (ถ้าต้องการ)

---

## 🔧 ไฟล์ที่ต้องสร้าง

### .env.production (ใน root folder)
```
VITE_API_URL=https://your-backend-url.railway.app/api
```

### .gitignore (ตรวจสอบว่ามี)
```
node_modules
dist
.env
.env.local
.env.production
server/database.db
server/database.db-journal
```

---

## 🌐 ตัวอย่าง URLs หลัง Deploy

- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.railway.app`
- API Endpoint: `https://your-app.railway.app/api`

---

## 🆘 Troubleshooting

### Frontend ไม่แสดงผล:
- ตรวจสอบว่า build สำเร็จ
- ตรวจสอบ console errors
- ตรวจสอบ Network tab

### Backend ไม่ทำงาน:
- ตรวจสอบ logs ใน Railway/Render
- ตรวจสอบ PORT ถูกต้อง
- ตรวจสอบ CORS settings

### API ไม่เชื่อมต่อ:
- ตรวจสอบ `VITE_API_URL` ถูกต้อง
- ตรวจสอบ CORS ใน backend
- ตรวจสอบ Network tab ใน browser

---

## 💰 ค่าใช้จ่าย

### Vercel (Frontend):
- **ฟรี**: สำหรับ personal projects
- มี bandwidth limit แต่เพียงพอสำหรับใช้งาน

### Railway (Backend):
- **ฟรี**: $5 credit/เดือน (พอใช้งาน)
- $5/เดือน: สำหรับ production จริง

### Render (Backend - ทางเลือก):
- **ฟรี**: แต่จะ sleep ถ้าไม่ใช้งาน
- $7/เดือน: สำหรับ always-on

---

## 📱 ใช้ Domain ของตัวเอง

### ซื้อ Domain:
- Namecheap, GoDaddy, หรือ Cloudflare

### เชื่อม Domain:
1. **Vercel**: Settings → Domains → Add Domain
2. **Railway**: Settings → Networking → Custom Domain
3. ตั้งค่า DNS records ตามที่บอก

---

## 🔒 Security Tips

1. เปลี่ยน password admin ใน backend
2. ใช้ HTTPS เสมอ
3. ตั้งค่า CORS ให้เฉพาะ domain ที่ต้องการ
4. Backup database เป็นประจำ

---

## 📞 Support

ถ้ามีปัญหา:
1. ตรวจสอบ logs ใน hosting service
2. ตรวจสอบ console errors
3. ทดสอบ API ด้วย Postman หรือ curl

