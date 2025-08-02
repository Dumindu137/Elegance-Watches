package model;

import javax.mail.*;
import javax.mail.internet.*;
import java.util.Properties;

public class SecondMail {

    public static void sendMail(String recipient, String subject, String content) throws MessagingException {
        final String fromEmail = "dumindusankalpa137@gmail.com";
        final String password = "vwapzhnzevenqrtm"; // Use App Password if using Gmail

        Properties properties = new Properties();
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.host", "smtp.gmail.com");
        properties.put("mail.smtp.port", "587");

        Session session = Session.getInstance(properties, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(fromEmail, password);
            }
        });

        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress(fromEmail));
        message.setRecipient(Message.RecipientType.TO, new InternetAddress(recipient));
        message.setSubject(subject);
        message.setText(content);

        Transport.send(message);
    }
}
