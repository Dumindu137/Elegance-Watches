/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.mail.MessagingException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.Mail;
import model.SecondMail;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author user
 */
@WebServlet(name = "SignUp", urlPatterns = {"/SignUp"})
public class SignUp extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject user = gson.fromJson(request.getReader(), JsonObject.class);

        String firstName = user.get("firstName").getAsString();
        String lastName = user.get("lastName").getAsString();
        final String email = user.get("email").getAsString();
        String password = user.get("password").getAsString();

        JsonObject ResponseObject = new JsonObject();
        ResponseObject.addProperty("status", false);

        if (firstName.isEmpty()) {
            ResponseObject.addProperty("message", "First Name can not be empty");
        } else if (lastName.isEmpty()) {
            ResponseObject.addProperty("message", "Last Name can not be empty");
        } else if (email.isEmpty()) {
            ResponseObject.addProperty("message", "Email can not be empty");
        } else if (!Util.isEmailValid(email)) {
            ResponseObject.addProperty("message", "Please Enter Valid Email");
        } else if (password.isEmpty()) {
            ResponseObject.addProperty("message", "Password can not be empty");
        } else if (!Util.isPasswordValid(password)) {
            ResponseObject.addProperty("message", "The Password must contain at least "
                    + "uppercase, lowercase, numbers, special character and to be 8 characters long !");
        } else {
            Session session = HibernateUtil.getSessionFactory().openSession();

            Criteria criteria = session.createCriteria(User.class);
            criteria.add(Restrictions.eq("email", email));

            if (!criteria.list().isEmpty()) {
                ResponseObject.addProperty("message", "User with this email already exists !");
            } else {
                // insert
                final String verificationCode = Util.generateCode();

                User u = new User();
                u.setFirst_name(firstName);
                u.setLast_name(lastName);
                u.setEmail(email);
                u.setPassword(password);
                u.setVerification(verificationCode);
                u.setCreated_at(new Date());

                session.beginTransaction();
                session.save(u);
                session.getTransaction().commit();

                //gpt      
                HttpSession ses = request.getSession();
                ses.setAttribute("email", email);
                //

                //send mail
                new Thread(new Runnable() {
                    @Override
                    public void run() {

                        Mail.sendMail(email, "Elegance Watches - Verification", "<h1>" + verificationCode + "</h1>");
                        System.out.println("📬 Trying to send verification email to " + email);

                        try {

                            SecondMail.sendMail(
                                    email,
                                    "Elegance Watches - Email Verification",
                                    "<div style='font-family:sans-serif'><h2>Your Verification Code</h2><p>Enter the following code to verify your email:</p><h1 style='color:#3366cc'>" + verificationCode + "</h1></div>"
                            );
                        } catch (MessagingException ex) {
                            Logger.getLogger(SignUp.class.getName()).log(Level.SEVERE, null, ex);
                        }

                    }
                }).start();

                ResponseObject.addProperty("status", true);
                ResponseObject.addProperty("message", "Registration Success ! Please Check Your Email For The Verification");
            }
            session.close();
        }

        String responseText = gson.toJson(ResponseObject);
        response.setContentType("application/json");

        response.getWriter().write(responseText);
    }
}
