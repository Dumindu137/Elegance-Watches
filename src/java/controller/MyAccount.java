/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Address;
import hibernate.City;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Dumindu
 */
@WebServlet(name = "MyAccount", urlPatterns = {"/MyAccount"})
public class MyAccount extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession ses = request.getSession(false);
        if (ses != null && ses.getAttribute("user") != null) {
            User user = (User) ses.getAttribute("user");
            JsonObject responseObject = new JsonObject();
            responseObject.addProperty("firstName", user.getFirst_name());
            responseObject.addProperty("lastName", user.getLast_name());
            responseObject.addProperty("password", user.getPassword());
            responseObject.addProperty("email", user.getEmail());
            

            //responseObject.addProperty("username", user.getFirst_name());
            String since = new SimpleDateFormat("MMM yyyy").format(user.getCreated_at());
            responseObject.addProperty("since", since);

            Gson gson = new Gson();
            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();
            Criteria c = s.createCriteria(Address.class);
            c.add(Restrictions.eq("user", user));
            if (!c.list().isEmpty()) {
                List<Address> addressList = c.list();
                responseObject.add("addressList", gson.toJsonTree(addressList));
            }

            String toJson = gson.toJson(responseObject);
            response.setContentType("application/json");
            response.getWriter().write(toJson);
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject userData = gson.fromJson(request.getReader(), JsonObject.class);

        String firstName = userData.get("firstName").getAsString();
        String lastName = userData.get("lastName").getAsString();
        String lineOne = userData.get("lineOne").getAsString();
        String lineTwo = userData.get("lineTwo").getAsString();
        String postalCode = userData.get("postalCode").getAsString();
        int cityId = userData.get("cityId").getAsInt();
        String currentPassword = userData.get("currentPassword").getAsString();
        String newPassword = userData.get("newPassword").getAsString();
        String confirmPassword = userData.get("confirmPassword").getAsString();

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        // Validation checks (unchanged)...
        HttpSession ses = request.getSession();
        if (ses.getAttribute("user") != null) {
            User u = (User) ses.getAttribute("user");

            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();
            Transaction tx = s.beginTransaction(); // ✅ START TRANSACTION FIRST

            try {
                Criteria c = s.createCriteria(User.class);
                c.add(Restrictions.eq("email", u.getEmail()));
                User u1 = (User) c.uniqueResult();

                if (u1 != null) {
                    u1.setFirst_name(firstName);
                    u1.setLast_name(lastName);
                    u1.setPassword(!confirmPassword.isEmpty() ? confirmPassword : currentPassword);

                    City city = (City) s.load(City.class, cityId);

                    // ✅ Check for existing address
                    Criteria ac = s.createCriteria(Address.class);
                    ac.add(Restrictions.eq("user", u1));
                    Address address = (Address) ac.uniqueResult();

                    if (address == null) {
                        address = new Address();
                        address.setUser(u1);
                    }

                    address.setLine1(lineOne);
                    address.setLine2(lineTwo);
                    address.setPostal_code(postalCode);
                    address.setCity(city);

                    s.merge(u1);
                    s.saveOrUpdate(address); // ✅ Better than save()

                    ses.setAttribute("user", u1); // update session
                    tx.commit(); // ✅ Commit changes
                    responseObject.addProperty("status", true);
                    responseObject.addProperty("message", "User profile details updated successfully!");
                }

            } catch (Exception e) {
                if (tx != null) {
                    tx.rollback();
                }
                e.printStackTrace();
                responseObject.addProperty("message", "An error occurred: " + e.getMessage());
            } finally {
                s.close();
            }
        }

        String toJson = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(toJson);
    }

}
