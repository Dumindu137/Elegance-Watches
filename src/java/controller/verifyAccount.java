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
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author user
 */
@WebServlet(name = "verifyAccount", urlPatterns = {"/verifyAccount"})
public class verifyAccount extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        HttpSession ses = req.getSession();

        if (ses.getAttribute("email") == null) {
            responseObject.addProperty("message", "email not found");

        } else {
            String email = ses.getAttribute("email").toString();

            JsonObject verification = gson.fromJson(req.getReader(), JsonObject.class);

            String verificationCode = verification.get("verificationCode").getAsString();

            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();

            Criteria c1 = s.createCriteria(User.class);

            Criterion crt1 = Restrictions.eq("email", email);
            Criterion crt2 = Restrictions.eq("verification", verificationCode);

            c1.add(crt1);
            c1.add(crt2);

            if (c1.list().isEmpty()) {
                responseObject.addProperty("message", "Invalid Verification Code");
            } else {
                User user = (User) c1.list().get(0);
                user.setVerification("Verified");

                s.update(user);
                s.beginTransaction().commit();
                s.close();

                //store user in the session
                ses.setAttribute("user", user);
                //store user in the session

                responseObject.addProperty("status", true);
                responseObject.addProperty("message", "verification successfull");
            }
        }

        String responseText = gson.toJson(responseObject);
        resp.setContentType("application/json");
        resp.getWriter().write(responseText);
    }

}
