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
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;
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
@MultipartConfig
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
            responseObject.addProperty("userId", user.getId());

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
        System.out.println("MyAccount doPut method hit!");
        Gson gson = new Gson();
        JsonObject userData = gson.fromJson(request.getReader(), JsonObject.class);

        System.out.println("newPassword (JSON): " + userData.get("newPassword"));
        System.out.println("confirmPassword (JSON): " + userData.get("confirmPassword"));

        String firstName = userData.get("firstName").getAsString();
        String lastName = userData.get("lastName").getAsString();
        String lineOne = userData.get("lineOne").getAsString();
        String lineTwo = userData.get("lineTwo").getAsString();
        String postalCode = userData.get("postalCode").getAsString();
        int cityId = userData.get("cityId").getAsInt();
        String currentPassword = userData.get("currentPassword").getAsString();

        // Read password fields safely
        String newPassword = userData.has("newPassword") ? userData.get("newPassword").getAsString() : "";
        String confirmPassword = userData.has("confirmPassword") ? userData.get("confirmPassword").getAsString() : "";

        System.out.println("New Password: " + newPassword);
        System.out.println("Confirm Password: " + confirmPassword);

//        String newPassword = userData.get("newPassword").getAsString();
//        String confirmPassword = userData.get("confirmPassword").getAsString();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        // Validation checks (unchanged)...
        HttpSession ses = request.getSession();
        if (ses.getAttribute("user") != null) {
            User u = (User) ses.getAttribute("user");

            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();
            Transaction tx = s.beginTransaction();

            try {
                Criteria c = s.createCriteria(User.class);
                c.add(Restrictions.eq("email", u.getEmail()));
                User u1 = (User) c.uniqueResult();

                if (u1 != null) {
                    u1.setFirst_name(firstName);
                    u1.setLast_name(lastName);

                    //passwword validation
                    String finalPassword = u.getPassword(); // Default is current DB password

                    if (!newPassword.isEmpty() || !confirmPassword.isEmpty()) {
                        if (!newPassword.equals(confirmPassword)) {
                            responseObject.addProperty("message", "Passwords do not match.");
                            writeJsonResponse(response, responseObject);
                            return;
                        }

                        if (!Util.isPasswordValid(newPassword)) {
                            responseObject.addProperty("message", "Password doesn't meet security requirements.");
                            writeJsonResponse(response, responseObject);
                            return;
                        }

                        finalPassword = newPassword; // ✅ Passed all checks
                    }

                    u1.setPassword(finalPassword); // finally set the new password if valid

                    u1.setPassword(finalPassword);
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
                    s.saveOrUpdate(address);

                    ses.setAttribute("user", u1); // update session
                    tx.commit(); //  Commit changes
               
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

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        try {
            HttpSession session = request.getSession(false);
            if (session == null || session.getAttribute("user") == null) {
                responseObject.addProperty("message", "User not signed in");
                response.getWriter().write(new Gson().toJson(responseObject));
                return;
            }

            User user = (User) session.getAttribute("user");
            Part part = request.getPart("image5");
            if (part == null || part.getSize() == 0) {
                responseObject.addProperty("message", "No image uploaded");
            } else {
                String baseDir = getServletContext().getRealPath("/profile-images");

                File userFolder = new File(baseDir, String.valueOf(user.getId()));
                if (!userFolder.exists()) {
                    userFolder.mkdirs();
                }

                File profileImageFile = new File(userFolder, "profile.png");
                Files.copy(part.getInputStream(), profileImageFile.toPath(), StandardCopyOption.REPLACE_EXISTING);

                responseObject.addProperty("status", true);
                responseObject.addProperty("message", "Profile picture uploaded successfully");

            }
        } catch (Exception e) {
            e.printStackTrace();
            responseObject.addProperty("message", "Error: " + e.getMessage());
        }
        response.getWriter().write(new Gson().toJson(responseObject));
    }

    private void writeJsonResponse(HttpServletResponse response, JsonObject json) throws IOException {
        response.setContentType("application/json");
        response.getWriter().write(new Gson().toJson(json));
    }

}
