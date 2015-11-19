del "myapp.*.zip"
cd "7-Zip"
For /f "tokens=1-2 delims=/:" %%a in ("%TIME%") do (set mytime=%%a%%b)
7z.exe a -tzip "../myapp.%mytime%.zip" ../www  ../config.xml ../icon.png