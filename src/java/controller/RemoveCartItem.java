/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.JsonObject;
import hibernate.Cart;
import hibernate.HibernateUtil;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Session;
import org.hibernate.Transaction;

/**
 *
 * @author user
 */
@WebServlet("/RemoveCartItem")
public class RemoveCartItem extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int cartId = Integer.parseInt(request.getParameter("cartId"));

        Session s = HibernateUtil.getSessionFactory().openSession();
        Transaction t = null;
        JsonObject json = new JsonObject();

        try {
            t = s.beginTransaction();

            Cart c = (Cart) s.get(Cart.class, cartId);
            if (c != null) {
                s.delete(c);
                t.commit();
                json.addProperty("status", true);
            } else {
                json.addProperty("status", false);
                json.addProperty("message", "Cart item not found");
            }
        } catch (Exception e) {
            if (t != null) {
                t.rollback();
            }
            json.addProperty("status", false);
            json.addProperty("message", "Server error");
            e.printStackTrace();
        } finally {
            s.close();
        }

        response.setContentType("application/json");
        response.getWriter().write(json.toString());
    }
}
