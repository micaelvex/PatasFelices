@echo off
REM Copia este archivo como: start-backend.bat
REM Reemplaza los valores con tus credenciales reales

"C:\Program Files\Eclipse Adoptium\jdk-25.0.3.9-hotspot\bin\java.exe" -jar backend\target\backend-0.0.1-SNAPSHOT.jar --app.mail.enabled=true --app.mail.from="TuNombre <tu@email.com>" --spring.mail.host=smtp-relay.brevo.com --spring.mail.port=587 --spring.mail.username=TU_LOGIN_BREVO@smtp-brevo.com --spring.mail.password=TU_CLAVE_SMTP_BREVO --spring.mail.properties.mail.smtp.auth=true --spring.mail.properties.mail.smtp.starttls.enable=true
