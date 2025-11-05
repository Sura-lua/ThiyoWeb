# คู่มืออัพโค้ดขึ้น GitHub

## วิธีที่ 1: ใช้ GitHub Desktop (แนะนำ - ง่ายที่สุด)

### 1. ติดตั้ง GitHub Desktop
- ดาวน์โหลดที่: https://desktop.github.com/
- ติดตั้งและ login ด้วย GitHub account

### 2. Clone Repository
1. เปิด GitHub Desktop
2. File → Clone Repository
3. URL: `https://github.com/Sura-lua/ThiyoWeb.git`
4. เลือก folder ที่ต้องการ
5. Clone

### 3. Copy ไฟล์เข้าไป
- Copy ไฟล์ทั้งหมดใน folder `thiyoNew` ไปใส่ใน folder ที่ clone ไว้

### 4. Commit และ Push
1. ใน GitHub Desktop จะเห็นไฟล์ที่เปลี่ยนแปลง
2. ใส่ commit message: "Initial commit: ร้านโปรด นั่งชิว บาร์เบียร์"
3. คลิก "Commit to main"
4. คลิก "Push origin"

---

## วิธีที่ 2: ใช้ Git Command Line

### 1. ติดตั้ง Git
- ดาวน์โหลดที่: https://git-scm.com/download/win
- ติดตั้ง (เลือก "Add Git to PATH" ตอนติดตั้ง)

### 2. เปิด Command Prompt หรือ PowerShell
```bash
cd D:\ThiyoCamping\thiyoNew
```

### 3. Initialize Git Repository
```bash
git init
```

### 4. เพิ่ม Remote
```bash
git remote add origin https://github.com/Sura-lua/ThiyoWeb.git
```

### 5. เพิ่มไฟล์ทั้งหมด
```bash
git add .
```

### 6. Commit
```bash
git commit -m "Initial commit: ร้านโปรด นั่งชิว บาร์เบียร์"
```

### 7. Push ขึ้น GitHub
```bash
git branch -M main
git push -u origin main
```

**หมายเหตุ:** ถ้ายังไม่ได้ login GitHub จะต้องใส่ username และ password (หรือใช้ Personal Access Token)

---

## วิธีที่ 3: ใช้ VS Code (ถ้าใช้ VS Code)

### 1. เปิด VS Code ใน folder thiyoNew

### 2. Source Control
- คลิกที่ Source Control icon (ทางซ้าย)
- คลิก "Initialize Repository"
- ใส่ commit message
- คลิก ✓ เพื่อ commit

### 3. Push
- คลิก "..." → Push → "Push to..."
- ใส่ URL: `https://github.com/Sura-lua/ThiyoWeb.git`

---

## ⚠️ สิ่งที่ต้องทำก่อน Push

1. **ตรวจสอบ .gitignore** - ต้องมีไฟล์นี้เพื่อไม่ให้ push:
   - `node_modules/`
   - `dist/`
   - `.env`
   - `server/database.db`

2. **ตรวจสอบว่ามีไฟล์สำคัญ:**
   - ✅ `package.json`
   - ✅ `src/` folder
   - ✅ `server/` folder
   - ✅ `README.md`
   - ✅ `.gitignore`

---

## 🔐 Authentication

ถ้า Push แล้วขอ username/password:
1. ใช้ **Personal Access Token** แทน password
2. สร้าง token ที่: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
3. ตั้งค่า permissions: `repo` (full control)
4. Copy token และใช้แทน password เมื่อ push

---

## ✅ หลัง Push สำเร็จ

1. ไปตรวจสอบที่: https://github.com/Sura-lua/ThiyoWeb
2. ควรเห็นไฟล์ทั้งหมดอัพโหลดแล้ว
3. พร้อม deploy ไปที่ Vercel และ Railway แล้ว!

---

## 📝 Checklist

- [ ] ติดตั้ง Git หรือ GitHub Desktop
- [ ] Clone repository
- [ ] Copy ไฟล์ทั้งหมด
- [ ] Commit files
- [ ] Push ขึ้น GitHub
- [ ] ตรวจสอบบน GitHub ว่าไฟล์ครบ

