@echo off
echo Starting Duty Backend...
cd /d "C:\Users\zhish\Desktop\project\backend"

set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.12.7-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%

if not exist ".mvn\wrapper\maven-wrapper.jar" (
    echo Downloading maven-wrapper.jar...
    powershell -Command "(New-Object System.Net.WebClient).DownloadFile('https://repo.maven.apache.org/maven2/io/takari/maven-wrapper/0.5.6/maven-wrapper-0.5.6.jar', '.mvn\wrapper\maven-wrapper.jar')"
)

java -cp ".mvn/wrapper/maven-wrapper.jar" "-Dmaven.multiModuleProjectDirectory=C:\Users\zhish\Desktop\project\backend" org.apache.maven.wrapper.MavenWrapperMain spring-boot:run

pause