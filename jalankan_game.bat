@echo off
title EcoCoder Quest - Game Server
color 0B

cd /d "%~dp0"

echo =====================================================================
echo                MENJALANKAN ECOCODER QUEST SERVER
echo =====================================================================
echo.
echo Server aktif di : http://localhost:8080/index.html
echo.
echo Membuka game di peramban (browser)...
start http://localhost:8080/index.html

echo.
echo Tekan Ctrl + C untuk mematikan server.
echo =====================================================================
echo.

py -m http.server 8080
pause
