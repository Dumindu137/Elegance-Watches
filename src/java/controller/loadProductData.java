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

/**
 *
 * @author user
 */
@WebServlet(name = "loadProductData", urlPatterns = {"/loadProductData"})
public class loadProductData extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("ok");

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        //grtBrands
        Criteria c1 = s.createCriteria(Brand.class);
        List<Brand> brandList = c1.list();

        //getModel
        Criteria c2 = s.createCriteria(Model.class);
        List<Model> modelList = c2.list();

        //getQuality
        Criteria c3 = s.createCriteria(Quality.class);
        List<Quality> qualityList = c3.list();

        //getColor
        Criteria c4 = s.createCriteria(Color.class);
        List<Color> colorList = c4.list();

        //getStatus
        Criteria c6 = s.createCriteria(Status.class);
        List<Status> statusList = c6.list();
        //getGender
        Criteria c7 = s.createCriteria(Gender.class);
        List<Gender> genderList = c7.list();

        s.close();

        Gson gson = new Gson();

        responseObject.add("brandList", gson.toJsonTree(brandList));
        responseObject.add("modelList", gson.toJsonTree(modelList));
        responseObject.add("qualityList", gson.toJsonTree(qualityList));
        responseObject.add("colorList", gson.toJsonTree(colorList));
        responseObject.add("genderList", gson.toJsonTree(genderList));
        responseObject.add("statusList", gson.toJsonTree(statusList));

        responseObject.addProperty("status", true);

        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(responseObject));

    }

}
