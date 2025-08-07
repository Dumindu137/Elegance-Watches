/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import hibernate.Cart;
import hibernate.DeliveryTypes;
import hibernate.HibernateUtil;
import hibernate.OrderItems;
import hibernate.OrderStatus;
import hibernate.Orders;
import hibernate.Product;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.PayHere;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Dumindu
 */
@WebServlet(name = "VerifyPayments", urlPatterns = {"/VerifyPayments"})
public class VerifyPayments extends HttpServlet {

    private static final int PAYHERE_SUCCESS = 2;
    private static final int ORDER_PENDING = 1;
    private static final int WITHIN_COLOMBO = 1;
    private static final int OUT_OF_COLOMBO = 2;
    private static final int RATING_DEFAULT_VALUE = 0;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        System.out.println("✅ PayHere Notify Triggered");
        String merchant_id = request.getParameter("merchant_id");
        String order_id = request.getParameter("order_id");
        String payhere_amount = request.getParameter("payhere_amount");
        String payhere_currency = request.getParameter("payhere_currency");
        String status_code = request.getParameter("status_code");
        String md5sig = request.getParameter("md5sig");

        String merchantSecret = "NzE2MDQ0NTk4MzcyMzQxNDQwOTM5NTA5NzQxNzM5MTc0ODM4MjA=";
        String merchantSecretMD5 = PayHere.generateMD5(merchantSecret);
        String hash = PayHere.generateMD5(merchant_id + order_id + payhere_amount + payhere_currency + merchantSecretMD5);

        if (!md5sig.equals(hash) || Integer.parseInt(status_code) != PAYHERE_SUCCESS) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        int orderIdFromPayHere = Integer.parseInt(order_id.replace("#000", ""));

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();
        Transaction tr = s.beginTransaction();

        try {
            Orders order = (Orders) s.get(Orders.class, orderIdFromPayHere);
            if (order == null) {
                response.getWriter().write("Order not found");
                return;
            }

            User user = order.getUser();

            Criteria cartCriteria = s.createCriteria(Cart.class);
            cartCriteria.add(Restrictions.eq("user", user));
            List<Cart> cartList = cartCriteria.list();

            OrderStatus orderStatus = (OrderStatus) s.get(OrderStatus.class, ORDER_PENDING);
            DeliveryTypes withInColombo = (DeliveryTypes) s.get(DeliveryTypes.class, WITHIN_COLOMBO);
            DeliveryTypes outOfColombo = (DeliveryTypes) s.get(DeliveryTypes.class, OUT_OF_COLOMBO);

            for (Cart cart : cartList) {
                Product product = cart.getProduct();

                OrderItems orderItem = new OrderItems();
                orderItem.setOrders(order);
                orderItem.setOrderStatus(orderStatus);
                orderItem.setProduct(product);
                orderItem.setQty(cart.getQty());
                orderItem.setRating(RATING_DEFAULT_VALUE);

                if (order.getAddress().getCity().getName().equalsIgnoreCase("Colombo")) {
                    orderItem.setDeliveryTypes(withInColombo);
                } else {
                    orderItem.setDeliveryTypes(outOfColombo);
                }

                s.save(orderItem);

                // Reduce stock
                product.setQty(product.getQty() - cart.getQty());
                s.update(product);

                // Delete cart item
                s.delete(cart);
            }

            tr.commit();
            response.getWriter().write("Order confirmed and cart cleared.");
        } catch (Exception e) {
            tr.rollback();
            e.printStackTrace();
            response.getWriter().write("Error processing order");
        } finally {
            s.close();
        }
    }
}

