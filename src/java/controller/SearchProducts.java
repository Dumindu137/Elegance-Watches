/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Brand;
import hibernate.Color;
import hibernate.Gender;
import hibernate.HibernateUtil;
import hibernate.Model;
import hibernate.Product;
import hibernate.Quality;
import hibernate.Status;
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
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Dumindu
 */
@WebServlet(name = "SearchProducts", urlPatterns = {"/SearchProducts"})
public class SearchProducts extends HttpServlet {

    private static final int MAX_RESULT = 6;
    private static final int ACTIVE_ID = 1;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject resposeObject = new JsonObject();
        resposeObject.addProperty("status", false);

        JsonObject requestJsonObject = gson.fromJson(request.getReader(), JsonObject.class);

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        Criteria c1 = s.createCriteria(Product.class); // get all products for the filtering

        if (requestJsonObject.has("brandName")) {
            String brandName = requestJsonObject.get("brandName").getAsString();

            // get brand details 
            Criteria c2 = s.createCriteria(Brand.class);
            c2.add(Restrictions.eq("name", brandName));
            Brand brand = (Brand) c2.uniqueResult();

            // filter models by using brand details
            Criteria c3 = s.createCriteria(Model.class);
            c3.add(Restrictions.eq("brand", brand));
            List<Model> modelList = c3.list();

            // filter product by using modelList
            c1.add(Restrictions.in("model", modelList));
        }

        if (requestJsonObject.has("conditionName")) {
            String qualityValue = requestJsonObject.get("conditionName").getAsString();

            // get qulity details
            Criteria c4 = s.createCriteria(Quality.class);
            c4.add(Restrictions.eq("value", qualityValue));
            Quality quality = (Quality) c4.uniqueResult();

            // filter product by using quality
            c1.add(Restrictions.eq("quality", quality));
        }

        if (requestJsonObject.has("genderName")) {
            String genderValue = requestJsonObject.get("genderName").getAsString();

            Criteria c6 = s.createCriteria(Gender.class);
            c6.add(Restrictions.eq("value", genderValue));
            Gender gender = (Gender) c6.uniqueResult();

            // filter product by using model.gender
            Criteria modelCriteria = c1.createCriteria("model"); // joins Product.model
            modelCriteria.add(Restrictions.eq("gender", gender));
        }

        if (requestJsonObject.has("colorName")) {
            String colorName = requestJsonObject.get("colorName").getAsString();
            // get color details
            Criteria c5 = s.createCriteria(Color.class);
            c5.add(Restrictions.eq("value", colorName));
            Color color = (Color) c5.uniqueResult();
            // filter product by using color
            c1.add(Restrictions.eq("color", color));
        }
        //price
        if (requestJsonObject.has("priceStart") || requestJsonObject.has("priceEnd")) {
            String priceStartStr = requestJsonObject.has("priceStart") ? requestJsonObject.get("priceStart").getAsString() : "";
            String priceEndStr = requestJsonObject.has("priceEnd") ? requestJsonObject.get("priceEnd").getAsString() : "";

            if (!priceStartStr.isEmpty()) {
                double priceStart = Double.parseDouble(priceStartStr);
                c1.add(Restrictions.ge("price", priceStart));
            }

            if (!priceEndStr.isEmpty()) {
                double priceEnd = Double.parseDouble(priceEndStr);
                c1.add(Restrictions.le("price", priceEnd));
            }
        }
        if (requestJsonObject.has("title")) {
            String title = requestJsonObject.get("title").getAsString();
            if (!title.trim().isEmpty()) {
                c1.add(Restrictions.ilike("title", "%" + title + "%")); // case-insensitive partial match
            }
        }

        if (requestJsonObject.has("sortValue")) {

            String sortValue = requestJsonObject.get("sortValue").getAsString();
            if (sortValue.equals("Sort by Latest")) {
                c1.addOrder(Order.desc("id"));
            } else if (sortValue.equals("Sort by Oldest")) {
                c1.addOrder(Order.asc("id"));
            } else if (sortValue.equals("Sort by Name")) {
                c1.addOrder(Order.asc("title"));
            } else if (sortValue.equals("Sort by Price")) {
                c1.addOrder(Order.asc("price"));
            }
        }

        Status status = (Status) s.get(Status.class, SearchProducts.ACTIVE_ID); // get Active product [2 = Active]
        c1.add(Restrictions.eq("status", status));

        resposeObject.addProperty("allProductCount", c1.list().size());

        if (requestJsonObject.has("firstResult")) {
            int firstResult = requestJsonObject.get("firstResult").getAsInt();
            c1.setFirstResult(firstResult);
            c1.setMaxResults(SearchProducts.MAX_RESULT);
        }

        // get filtered product list
        List<Product> productList = c1.list();
        for (Product product : productList) {
            product.setUser(null);
        }
        // hibernate session close
        s.close();

        resposeObject.add("productList", gson.toJsonTree(productList));
        resposeObject.addProperty("status", true);
        response.setContentType("application/json");
        String toJson = gson.toJson(resposeObject);
        response.getWriter().write(toJson);
    }

}
