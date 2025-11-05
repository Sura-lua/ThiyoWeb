#!/bin/bash
# Script สำหรับอัพโค้ดขึ้น GitHub (Linux/Mac)

echo "===================================="
echo "อัพโค้ดขึ้น GitHub"
echo "===================================="
echo ""

# ตรวจสอบ Git
if ! command -v git &> /dev/null; then
    echo "[ERROR] Git ยังไม่ได้ติดตั้ง!"
    echo "กรุณาติดตั้ง Git ก่อน"
    exit 1
fi

echo "[OK] Git พร้อมใช้งาน"
echo ""

# Initialize repository
if [ ! -d ".git" ]; then
    echo "กำลัง initialize Git repository..."
    git init
fi

# เพิ่ม remote
if ! git remote get-url origin &> /dev/null; then
    echo "กำลังเพิ่ม remote repository..."
    git remote add origin https://github.com/Sura-lua/ThiyoWeb.git
fi

# Add files
echo "กำลังเพิ่มไฟล์ทั้งหมด..."
git add .

# Commit
echo "กำลัง commit..."
git commit -m "Initial commit: ร้านโปรด นั่งชิว บาร์เบียร์" || echo "[WARNING] ไม่มีไฟล์เปลี่ยนแปลง"

# Set branch
git branch -M main

echo ""
echo "===================================="
echo "พร้อม Push ขึ้น GitHub!"
echo "===================================="
echo ""
echo "คำสั่งต่อไปนี้:"
echo "  git push -u origin main"
echo ""

