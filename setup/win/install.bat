
@echo off

:: check for admin
echo Administrative permissions required. Detecting permissions...

net session >nul 2>&1
if %errorLevel% == 0 (
    echo SUCCESS: Administrative permissions confirmed.
) else (
    echo FAILURE: Current permissions inadequate.
    pause
    exit /b 1
)

:: change to current dir; needed for admin batch files
cd /d %~dp0

:: defaults
set DefaultInstallDirectory=C:\Program Files\PostgreSQL\9.6
set DefaultBackupDirectory=C:\PosysBackup

:: prompts to override defaults
set /p InstallDirectory="Install Directory (%DefaultInstallDirectory%): "
set /p BackupDirectory="Backup Directory (%DefaultBackupDirectory%): "

if "%InstallDirectory%"=="" (set InstallDirectory=%DefaultInstallDirectory%)
if "%BackupDirectory%"=="" (set BackupDirectory=%DefaultBackupDirectory%)

:: install postgres
echo Installing Postgres in %InstallDirectory%...
start /wait .\postgresql-9.6.1-1-windows-x64.exe --unattendedmodeui minimal --mode unattended --superpassword "postgres" --servicename "postgreSQL" --servicepassword "postgres" --serverport 5432 --prefix "%InstallDirectory%"

:: create postgres db
echo Creating database "posys"...
set PGPASSWORD=postgres
"%InstallDirectory%\bin\createdb.exe" -h localhost -p 5432 -U postgres -w posys

:: create daily backup script
echo Creating backup script (backups to %BackupDirectory%)...
(
echo "%InstallDirectory%\bin\pg_dump.exe" posys ^> "%BackupDirectory%\posys_%%date%%_%%time%%.bak"
echo forfiles -p "%InstallDirectory%" -s -m *.* -d 30 -c "cmd /c del @path"
) > "%InstallDirectory%\backup.bat"

:: create scheduled task for every day at 3 AM
SchTasks /Create /F /SC DAILY /TN "Posys Backup" /TR "%InstallDirectory%\backup.bat" /ST 03:00

echo Done!
pause
