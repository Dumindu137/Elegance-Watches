package model;

import javax.mail.*;
import javax.mail.internet.*;
import java.util.Properties;

public class SecondMail {

    public static void sendMail(String recipient, String subject, String content) throws MessagingException {

        final String fromEmail = "0684b26d92fa91";
        final String password = "9af0141e77891a";

        Properties properties = new Properties();
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.host", "smtp.mailtrap.io");
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
        System.out.println("Email sent successfully to " + recipient);
    }
}
