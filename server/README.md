# Railway Deployment Config

Railway จะ auto-detect Node.js project และ run server.js

## Environment Variables ที่ต้องตั้งค่า:

- `PORT`: Railway จะ set ให้อัตโนมัติ
- `NODE_ENV`: `production`
- `ALLOWED_ORIGINS`: (optional) comma-separated frontend URLs

## Build & Start Commands:

Railway จะใช้:
- Build Command: `cd server && npm install`
- Start Command: `cd server && npm start`

---

## สำหรับ Render:

Render จะใช้ไฟล์ `render.yaml` ที่อยู่ใน root folder

