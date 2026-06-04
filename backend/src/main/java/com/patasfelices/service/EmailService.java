package com.patasfelices.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:PatitasFelices <noreply@patasfelices.com>}")
    private String from;

    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarBienvenida(String destinatario, String nombre) {
        enviar(destinatario,
                "Bienvenido a PatasFelices",
                "Hola " + nombre + ",\n\nGracias por registrarte en PatasFelices. " +
                "Ahora puedes explorar mascotas disponibles para adopcion.\n\nEl equipo de PatasFelices");
    }

    public void enviarCambioEstadoSolicitud(String destinatario, String nombre, String mascotaNombre, String estado) {
        String mensaje = "APROBADA".equals(estado)
                ? "Tu solicitud para adoptar a " + mascotaNombre + " ha sido APROBADA. El refugio se pondra en contacto contigo pronto."
                : "Tu solicitud para adoptar a " + mascotaNombre + " no fue aceptada en esta ocasion.";
        enviar(destinatario,
                "Actualizacion de tu solicitud - " + mascotaNombre,
                "Hola " + nombre + ",\n\n" + mensaje + "\n\nEl equipo de PatasFelices");
    }

    public void enviarRecuperacionPassword(String destinatario, String nombre, String enlace) {
        enviar(destinatario,
                "Recuperacion de contrasena - PatasFelices",
                "Hola " + nombre + ",\n\nEnlace para restablecer tu contrasena (valido 30 min):\n\n" +
                enlace + "\n\nEl equipo de PatasFelices");
    }

    private void enviar(String destinatario, String asunto, String cuerpo) {
        if (!mailEnabled) {
            log.info("[CORREO DESACTIVADO] Para: {} | Asunto: {}", destinatario, asunto);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(from);
            message.setTo(destinatario);
            message.setSubject(asunto);
            message.setText(cuerpo);
            mailSender.send(message);
            log.info("[CORREO ENVIADO] Para: {} | Asunto: {}", destinatario, asunto);
        } catch (Exception e) {
            log.error("Error al enviar correo a {}: {}", destinatario, e.getMessage());
        }
    }
}
