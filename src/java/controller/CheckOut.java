/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Address;
import hibernate.Cart;
import hibernate.City;
import hibernate.DeliveryTypes;
import hibernate.HibernateUtil;
import hibernate.OrderItems;
import hibernate.OrderStatus;
import hibernate.Orders;
import hibernate.Product;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.DecimalFormat;
import java.util.Date;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.PayHere;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Dumindu
 */
@WebServlet(name = "CheckOut", urlPatterns = {"/CheckOut"})
public class CheckOut extends HttpServlet {

    private static final int ORDER_PENDING = 1;
    private static final int WITHIN_COLOMBO = 1;
    private static final int OUT_OF_COLOMBO = 2;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject reqJson = gson.fromJson(request.getReader(), JsonObject.class);

        String citySelect = reqJson.get("citySelect").getAsString();
        String lineOne = reqJson.get("lineOne").getAsString();
        String lineTwo = reqJson.get("lineTwo").getAsString();
        String postalCode = reqJson.get("postalCode").getAsString();
        String mobile = reqJson.get("mobile").getAsString();

        User user = (User) request.getSession().getAttribute("user");
        JsonObject resJson = new JsonObject();
        resJson.addProperty("status", false);

        if (user == null) {
            resJson.addProperty("message", "Session expired");
        } else {
            Session s = HibernateUtil.getSessionFactory().openSession();
            Transaction tr = s.beginTransaction();

            try {
                City city = (City) s.get(City.class, Integer.parseInt(citySelect));
// 🔍 Check if address already exists
                Criteria addressCriteria = s.createCriteria(Address.class);
                addressCriteria.add(Restrictions.eq("user", user));
                addressCriteria.add(Restrictions.eq("line1", lineOne));
                addressCriteria.add(Restrictions.eq("line2", lineTwo));
                addressCriteria.add(Restrictions.eq("city", city));
                addressCriteria.add(Restrictions.eq("postal_code", postalCode));
                addressCriteria.add(Restrictions.eq("mobile", mobile));

                Address address = (Address) addressCriteria.uniqueResult();

                if (address == null) {
                    // ➕ Insert new address
                    address = new Address();
                    address.setUser(user);
                    address.setLine1(lineOne);
                    address.setLine2(lineTwo);
                    address.setCity(city);
                    address.setPostal_code(postalCode);
                    address.setMobile(mobile);
                    s.save(address);
                }

                // Insert Order (but not order_items yet)
                Orders order = new Orders();
                order.setUser(user);
                order.setAddress(address);
                order.setCreatedAt(new Date());
                int orderId = (int) s.save(order);

                // Get cart & calculate amount
                Criteria c = s.createCriteria(Cart.class);
                c.add(Restrictions.eq("user", user));
                List<Cart> cartList = c.list();

                double amount = 0;
                String items = "";

                DeliveryTypes withinColombo = (DeliveryTypes) s.get(DeliveryTypes.class, WITHIN_COLOMBO);
                DeliveryTypes outColombo = (DeliveryTypes) s.get(DeliveryTypes.class, OUT_OF_COLOMBO);

                for (Cart cart : cartList) {
                    amount += cart.getQty() * cart.getProduct().getPrice();

                    if (city.getName().equalsIgnoreCase("Colombo")) {
                        amount += cart.getQty() * withinColombo.getPrice();
                    } else {
                        amount += cart.getQty() * outColombo.getPrice();
                    }

                    items += cart.getProduct().getTitle() + " x " + cart.getQty() + ", ";
                }

                tr.commit();
                s.close();

                // PayHere Setup
                String merchantId = "1223987";
                String merchantSecret = "NzE2MDQ0NTk4MzcyMzQxNDQwOTM5NTA5NzQxNzM5MTc0ODM4MjA=";
                String orderCode = "#000" + orderId; // ✅ Now real ID
                String currency = "LKR";
                String formattedAmount = new DecimalFormat("0.00").format(amount);
                String hash = PayHere.generateMD5(merchantId + orderCode + formattedAmount + currency + PayHere.generateMD5(merchantSecret));

                JsonObject payHereJson = new JsonObject();
                payHereJson.addProperty("sandbox", true);
                payHereJson.addProperty("merchant_id", merchantId);
                payHereJson.addProperty("return_url", "");
                payHereJson.addProperty("cancel_url", "");
                payHereJson.addProperty("notify_url", "https://c7783bb71d24.ngrok-free.app/Elegance_Watches/VerifyPayments");
                payHereJson.addProperty("order_id", orderCode);
                payHereJson.addProperty("items", items);
                payHereJson.addProperty("amount", formattedAmount);
                payHereJson.addProperty("currency", currency);
                payHereJson.addProperty("hash", hash);
                payHereJson.addProperty("first_name", user.getFirst_name());
                payHereJson.addProperty("last_name", user.getLast_name());
                payHereJson.addProperty("email", user.getEmail());
                payHereJson.addProperty("phone", mobile);
                payHereJson.addProperty("address", lineOne + ", " + lineTwo);
                payHereJson.addProperty("city", city.getName());
                payHereJson.addProperty("country", "Sri Lanka");

                resJson.addProperty("status", true);
                resJson.add("payhereJson", payHereJson);

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        response.setContentType("application/json");
        response.getWriter().write(new Gson().toJson(resJson));
    }
}
