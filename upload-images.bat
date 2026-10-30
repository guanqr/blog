@echo off
cd /d "%~dp0"
python scripts/upload-images.py --source static/images %*
python scripts/generate-image-dimensions.py
pause
