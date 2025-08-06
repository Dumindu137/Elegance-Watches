/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import hibernate.Cart;
import hibernate.HibernateUtil;
import hibernate.Product;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Dumindu
 */
@WebServlet(name = "CheckSessionCart", urlPatterns = {"/CheckSessionCart"})
public class CheckSessionCart extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        User user = (User) request.getSession().getAttribute("user");
        if (user != null) {
            ArrayList<Cart> sessionCarts = (ArrayList<Cart>) request.getSession().getAttribute("sessionCart");
            if (sessionCarts != null) {
                SessionFactory sf = HibernateUtil.getSessionFactory();
                Session s = sf.openSession();
                Transaction tr = s.beginTransaction();

                Criteria c1 = s.createCriteria(Cart.class);
                c1.add(Restrictions.eq("user", user));
                for (Cart sessionCart : sessionCarts) {
                    Product product = (Product) s.get(Product.class, sessionCart.getProduct().getId());

                    c1.add(Restrictions.eq("product", sessionCart.getProduct()));
                    if (c1.list().isEmpty()) { // product not available in same product id
                        sessionCart.setUser(user); // HttpSession User
                        s.save(sessionCart);
                        tr.commit();
                    } else {
                        Cart dbCart = (Cart) c1.uniqueResult();
                        int newQty = sessionCart.getQty() + dbCart.getQty();
                        if (newQty <= product.getQty()) {
                            dbCart.setQty(newQty);
                            dbCart.setUser(user);
                            s.update(dbCart);
                            tr.commit();
                        }
//                        responseObject.addProperty("message", "OOPS... Insufficient Prodcut quantity!!!");
                    }
                }
                request.getSession().setAttribute("sessionCart", null);
            }
        }
    }

}
