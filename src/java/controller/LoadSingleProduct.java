/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.Model;
import hibernate.Product;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.ObjectNotFoundException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Dumindu
 */
@WebServlet(name = "LoadSingleProduct", urlPatterns = {"/LoadSingleProduct"})
public class LoadSingleProduct extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        String productId = request.getParameter("id");
        if (Util.isInteger(productId)) {
            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();
            try {
                Product product = (Product) s.get(Product.class, Integer.valueOf(productId));
                if (product.getStatus().getValue().equals("Available")) {
                    product.getUser().setEmail(null);
                    product.getUser().setPassword(null);
                    product.getUser().setVerification(null);
                    product.getUser().setId(-1);
                    product.getUser().setCreated_at(null);

                    // Filter models by same brand and same gender
                    Criteria c1 = s.createCriteria(Model.class);
                    c1.add(Restrictions.eq("brand", product.getModel().getBrand()));
                    c1.add(Restrictions.eq("gender", product.getModel().getGender()));
                    List<Model> modelList = c1.list();

                    System.out.println("model list" + modelList);
                    
                    // Now fetch products with those models, but exclude current one
                    Criteria c2 = s.createCriteria(Product.class);
                    c2.add(Restrictions.in("model", modelList));
                    c2.add(Restrictions.ne("id", product.getId()));
                    c2.setMaxResults(6);
                    List<Product> productList = c2.list();

                    System.out.println("similar list" + productList);

                    for (Product pr : productList) {
                        pr.getUser().setEmail(null);
                        pr.getUser().setPassword(null);
                        pr.getUser().setVerification(null);
                        pr.getUser().setId(-1);
                        pr.getUser().setCreated_at(null);
                    }

                    // similer-product-data-end
                    responseObject.add("product", gson.toJsonTree(product));
                    responseObject.add("productList", gson.toJsonTree(productList));
                    responseObject.addProperty("status", true);
                } else {
                    responseObject.addProperty("message", "Product Not Found!");
                }
            } catch (Exception e) {
                responseObject.addProperty("message", "Product Not Found!");
            }
        }

        response.setContentType("application/json");
        String toJson = gson.toJson(responseObject);
        response.getWriter().write(toJson);
    }

}
