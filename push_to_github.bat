@echo off
chcp 65001 >nul
title EcoCoder Quest - GitHub Push Tool
color 0A

:: Tambahkan direktori Git ke PATH untuk sesi ini
set "GIT_PATH=C:\Users\MyBook Pro L\AppData\Local\Programs\Git\cmd"
if exist "%GIT_PATH%\git.exe" (
    set "PATH=%GIT_PATH%;%PATH%"
)

cd /d "%~dp0"

:MENU
cls
echo =====================================================================
echo           🌿 ECOCODER QUEST - GITHUB PUSH & SYNC TOOL 🌿
echo =====================================================================
echo.
echo Repositori Target : https://github.com/amaliania89-cmd/gamesampah.git
echo Branch            : main
echo Status Git        :
git status --short
echo.
echo ---------------------------------------------------------------------
echo PILIH TINDAKAN:
echo [1] Push ke GitHub menggunakan Personal Access Token (PAT) [Direkomendasikan]
echo [2] Push Standar (Buka jendela login GitHub biasa)
echo [3] Buka Halaman Buat Token GitHub di Browser
echo [4] Buka Repositori gamesampah di Browser
echo [5] Cek Status Commit & Log Git
echo [0] Keluar
echo ---------------------------------------------------------------------
set /p pilihan="Masukkan pilihan (0-5): "

if "%pilihan%"=="1" goto PUSH_TOKEN
if "%pilihan%"=="2" goto PUSH_STANDARD
if "%pilihan%"=="3" goto OPEN_TOKEN_PAGE
if "%pilihan%"=="4" goto OPEN_REPO
if "%pilihan%"=="5" goto CHECK_LOG
if "%pilihan%"=="0" exit
goto MENU

:PUSH_TOKEN
cls
echo =====================================================================
echo       PUSH KE GITHUB MENGGUNAKAN PERSONAL ACCESS TOKEN (PAT)
echo =====================================================================
echo.
echo Catatan: Sejak 2021, GitHub mewajibkan Personal Access Token (bukan password biasa).
echo Jika belum punya token:
echo 1. Pilih opsi [3] di menu utama untuk membuat token baru (centang izin "repo").
echo 2. Copy token tersebut (contoh: ghp_xxxxxxxxxxxx) lalu paste di bawah.
echo.
set /p TOKEN="Masukkan Personal Access Token GitHub kamu: "

if "%TOKEN%"=="" (
    echo.
    echo [ERROR] Token tidak boleh kosong!
    pause
    goto MENU
)

echo.
echo [1/3] Menyiapkan perubahan terbaru...
git add .
git commit -m "update: sinkronisasi berkas EcoCoder Quest" >nul 2>&1

echo [2/3] Mengirim (Push) berkas ke https://github.com/amaliania89-cmd/gamesampah.git ...
git push https://amaliania89-cmd:%TOKEN%@github.com/amaliania89-cmd/gamesampah.git main

if %ERRORLEVEL% equ 0 (
    echo.
    echo =====================================================================
    echo    🎉 BERHASIL! Website EcoCoder Quest telah ter-push ke GitHub!
    echo =====================================================================
    echo Silakan cek repositori di: https://github.com/amaliania89-cmd/gamesampah
    echo.
) else (
    echo.
    echo =====================================================================
    echo    ❌ GAGAL PUSH KE GITHUB
    echo =====================================================================
    echo Kemungkinan penyebab:
    echo 1. Token salah atau sudah kadaluarsa (expired).
    echo 2. Token belum memiliki izin centang 'repo' (Full control of private repositories).
    echo 3. Koneksi internet terganggu.
    echo.
)

:: Pastikan remote origin tetap bersih tanpa menyimpan token di teks konfigurasi
git remote set-url origin https://github.com/amaliania89-cmd/gamesampah.git
pause
goto MENU

:PUSH_STANDARD
cls
echo =====================================================================
echo                      PUSH DENGAN METODE STANDAR
echo =====================================================================
echo.
echo Menyiapkan commit terbaru...
git add .
git commit -m "update: update EcoCoder Quest" >nul 2>&1

echo Mengirim ke branch main...
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo 🎉 Berhasil ter-push ke GitHub!
) else (
    echo.
    echo ❌ Gagal melakukan push standar. Silakan coba opsi [1] menggunakan Token.
)
echo.
pause
goto MENU

:OPEN_TOKEN_PAGE
cls
echo Membuka halaman pembuatan Personal Access Token di browser...
start https://github.com/settings/tokens/new?scopes=repo^&description=gamesampah-token
echo.
echo Pastikan:
echo 1. Berikan nama Note: gamesampah-token
echo 2. Centang kotak 'repo' (Full control of repositories)
echo 3. Klik tombol hijau 'Generate token' di bagian bawah
echo 4. Salin kode token yang muncul, lalu gunakan pada Opsi [1]
echo.
pause
goto MENU

:OPEN_REPO
cls
echo Membuka repositori di browser...
start https://github.com/amaliania89-cmd/gamesampah
pause
goto MENU

:CHECK_LOG
cls
echo =====================================================================
echo                         LOG COMMIT GIT
echo =====================================================================
echo.
git log -n 5 --oneline --graph --decorate
echo.
pause
goto MENU
