@echo off
cd /d "%~dp0"
python scripts/upload-images.py --source static/images %*
pause
