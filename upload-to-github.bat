@echo off
echo ====================================
echo อัพโค้ดขึ้น GitHub
echo ====================================
echo.

echo กำลังตรวจสอบ Git...
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git ยังไม่ได้ติดตั้ง!
    echo กรุณาติดตั้ง Git จาก: https://git-scm.com/download/win
    echo หรือใช้ GitHub Desktop: https://desktop.github.com/
    pause
    exit /b 1
)

echo [OK] Git พร้อมใช้งาน
echo.

echo กำลังตรวจสอบ Git repository...
if not exist ".git" (
    echo กำลัง initialize Git repository...
    git init
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] ไม่สามารถ initialize Git repository ได้
        pause
        exit /b 1
    )
)

echo กำลังตรวจสอบ remote...
git remote get-url origin >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo กำลังเพิ่ม remote repository...
    git remote add origin https://github.com/Sura-lua/ThiyoWeb.git
)

echo กำลังเพิ่มไฟล์ทั้งหมด...
git add .
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] ไม่สามารถเพิ่มไฟล์ได้
    pause
    exit /b 1
)

echo กำลัง commit...
git commit -m "Initial commit: ร้านโปรด นั่งชิว บาร์เบียร์"
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] ไม่มีไฟล์เปลี่ยนแปลง หรือ commit แล้ว
)

echo กำลัง set branch เป็น main...
git branch -M main

echo.
echo ====================================
echo พร้อม Push ขึ้น GitHub!
echo ====================================
echo.
echo คำสั่งต่อไปนี้:
echo   git push -u origin main
echo.
echo หรือถ้า push แล้วไม่สำเร็จ ให้ลอง:
echo   git push -u origin main --force
echo.
pause

