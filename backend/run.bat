@echo off
echo Starting Car Evaluation Backend Server...
cd /d %~dp0
call ..\venv\Scripts\activate.bat
python app.py
pause

