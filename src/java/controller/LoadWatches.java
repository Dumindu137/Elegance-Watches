/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.Product;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author user
 */
@WebServlet("/LoadWatches")
public class LoadWatches extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        Session session = null;
        Transaction tx = null;

        try {
            session = HibernateUtil.getSessionFactory().openSession();
            tx = session.beginTransaction();

            String genderIdParam = request.getParameter("genderId");
            Integer genderId = null;
            if (genderIdParam != null) {
                try {
                    genderId = Integer.parseInt(genderIdParam);
                } catch (NumberFormatException e) {
                
                }
            }

            Criteria criteria = session.createCriteria(Product.class, "product");
            criteria.createAlias("product.model", "model");
            criteria.createAlias("model.gender", "gender");

            if (genderId != null) {
                criteria.add(Restrictions.eq("gender.id", genderId));
            }

            criteria.setMaxResults(6);
            List<Product> products = criteria.list();

            tx.commit();

            //array JSON return
            String json = new Gson().toJson(products);

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(json);

        } catch (HibernateException e) {
            if (tx != null) {
                tx.rollback();
            }
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error loading watches");
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
}
