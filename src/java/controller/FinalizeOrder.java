/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
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
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author user
 */
@WebServlet(name = "FinalizeOrder", urlPatterns = {"/FinalizeOrder"})
public class FinalizeOrder extends HttpServlet {

    private static final int ORDER_PENDING = 1;
    private static final int WITHIN_COLOMBO = 1;
    private static final int OUT_OF_COLOMBO = 2;
    private static final int RATING_DEFAULT_VALUE = 0;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject reqJson = gson.fromJson(request.getReader(), JsonObject.class);
        JsonObject resJson = new JsonObject();

        String payhereOrderId = reqJson.get("payhereOrderId").getAsString();
        int orderId = Integer.parseInt(payhereOrderId.replace("#000", ""));

        Session s = HibernateUtil.getSessionFactory().openSession();
        Transaction t = s.beginTransaction();

        try {
            Orders order = (Orders) s.get(Orders.class, orderId);
            if (order == null) {
                resJson.addProperty("status", false);
                resJson.addProperty("message", "Order not found.");
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
                OrderItems item = new OrderItems();
                item.setOrders(order);
                item.setProduct(cart.getProduct());
                item.setQty(cart.getQty());
                item.setOrderStatus(orderStatus);
                item.setRating(RATING_DEFAULT_VALUE);

                if (order.getAddress().getCity().getName().equalsIgnoreCase("Colombo")) {
                    item.setDeliveryTypes(withInColombo);
                } else {
                    item.setDeliveryTypes(outOfColombo);
                }

                s.save(item);

                // Reduce stock
                Product product = cart.getProduct();
                product.setQty(product.getQty() - cart.getQty());
                s.update(product);

                // Remove from cart
                s.delete(cart);
            }

            t.commit();
            resJson.addProperty("status", true);
        } catch (Exception e) {
            t.rollback();
            e.printStackTrace();
            resJson.addProperty("status", false);
            resJson.addProperty("message", "Something went wrong.");
        } finally {
            s.close();
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(resJson));
    }
}
