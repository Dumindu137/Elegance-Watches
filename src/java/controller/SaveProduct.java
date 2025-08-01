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
import hibernate.User;
import java.io.File;
import java.io.IOException;
import java.nio.file.CopyOption;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.time.Year;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

@MultipartConfig
@WebServlet(name = "SaveProduct", urlPatterns = {"/SaveProduct"})
public class SaveProduct extends HttpServlet {

    private static final int PENDING_STAUTUS_ID = 1;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String brandId = request.getParameter("brandId");
        String modelId = request.getParameter("modelId");
        String genderId = request.getParameter("genderId");
        String title = request.getParameter("title");
        String description = request.getParameter("description");
        String madeYear = request.getParameter("madeYear");
        String colorId = request.getParameter("colorId");
        String conditionId = request.getParameter("conditionId");
        String price = request.getParameter("price");
        String qty = request.getParameter("qty");

        Part part1 = request.getPart("image1");
        Part part2 = request.getPart("image2");
        Part part3 = request.getPart("image3");

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = null;
        Transaction tx = null;
        s = sf.openSession();

        //validation
        if (request.getSession().getAttribute("user") == null) {
            respond(response, "Please sign in!");
            return;
        } else if (!Util.isInteger(brandId)) {
            respond(response, "Invalid brand!");
            return;
        } else if (Integer.parseInt(brandId) == 0) {
            respond(response, "Please select a brand!");
            return;
        } else if (Integer.parseInt(genderId) == 0) {
            respond(response, "Please select a gender");
            return;
        } else if (!Util.isInteger(modelId)) {
            respond(response, "Invalid model!");
            return;
        } else if (Integer.parseInt(modelId) == 0) {
            respond(response, "Please select a model!");
            return;
        } else if (title == null || title.isEmpty()) {
            respond(response, "Product title can not be empty");
            return;
        } else if (madeYear.isEmpty()) {
            respond(response, "Made Year can not be empty");
            return;
        } else if (description.isEmpty()) {
            respond(response, "Product description can not be empty");
            return;
        } else if (description.isEmpty()) {
            respond(response, "Product description can not be empty");
            return;
        } else if (!Util.isInteger(colorId)) {
            respond(response, "Invalid color");
            return;
        } else if (Integer.parseInt(colorId) == 0) {
            respond(response, "Please select a valid color");
            return;
        } else if (!Util.isInteger(conditionId)) {
            respond(response, "Invalid condition");
            return;
        } else if (Integer.parseInt(conditionId) == 0) {
            respond(response, "Please select a valid condition");
            return;
        } else if (!Util.isDouble(price)) {
            respond(response, "Invalid price");
            return;
        } else if (Double.parseDouble(price) <= 0) {
            respond(response, "Price must be greater than 0");
            return;
        } else if (!Util.isInteger(qty)) {
            respond(response, "Invalid quantity");
            return;
        } else if (Integer.parseInt(qty) <= 0) {
            respond(response, "Quantity must be greater than 0");
            return;
        } else if (part1.getSubmittedFileName() == null) {
            respond(response, "Product image one is required");
            return;
        } else if (part2.getSubmittedFileName() == null) {
            respond(response, "Product image two is required");
            return;
        } else if (part3.getSubmittedFileName() == null) {
            respond(response, "Product image three is required");
            return;
        } else {

            Brand brand = (Brand) s.get(Brand.class, Integer.valueOf(brandId));

            if (brand == null) {
                respond(response, "Please select a valid Brand Name!");
                return;
            } else {
                Gender gender = (Gender) s.get(Gender.class, Integer.valueOf(genderId));
                Model model = (Model) s.get(Model.class, Integer.parseInt(modelId));

                if (gender == null) {
                    respond(response, "Please select a gender!");
                    return;
                } else {
                    if (model.getGender().getId() != gender.getId()) {
                        respond(response, "Please select a valid gender!");
                        return;
                    } else {
                        if (model == null) {
                            respond(response, "Please select a valid Model Name!");
                            return;
                        } else {
                            if (model.getBrand().getId() != brand.getId()) {
                                respond(response, "Please select a suitable Model!");
                                return;
                            } else {

                                Color color = (Color) s.get(Color.class, Integer.valueOf(colorId));
                                if (color == null) {
                                    respond(response, "Please select a valid Color!");
                                    return;
                                } else {
                                    Quality quality = (Quality) s.get(Quality.class, Integer.valueOf(conditionId));
                                    if (quality == null) {
                                        respond(response, "Please select a valid Quality!");
                                        return;
                                    } else {

                                        Product p = new Product();
                                        p.setModel(model);
                                        p.setTitle(title);
                                        p.setDescription(description);
                                        p.setColor(color);
                                        p.setQuality(quality);
                                        p.setPrice(Double.parseDouble(price));
                                        p.setQty(Integer.parseInt(qty));
                                        p.setMadeYear(Integer.parseInt(madeYear));

                                        Status status = (Status) s.get(Status.class, SaveProduct.PENDING_STAUTUS_ID);
                                        p.setStatus(status);
                                        User user = (User) request.getSession().getAttribute("user");

                                        Criteria c1 = s.createCriteria(User.class);
                                        c1.add(Restrictions.eq("email", user.getEmail()));
                                        User u1 = (User) c1.uniqueResult();
                                        p.setUser(u1);
                                        p.setCreated_at(new Date());

                                        s.beginTransaction();
                                        int id = (int) s.save(p);
                                        s.getTransaction().commit();

                                        s.close();

                                        //image uploading
                                        String appPath = getServletContext().getRealPath("");

                                        String newPath = appPath.replace("build" + File.separator + "web", "web" + File.separator + "product-images");

                                        File productFolder = new File(newPath, String.valueOf(id));
                                        productFolder.mkdir();

                                        File file1 = new File(productFolder, "image1.png");
                                        Files.copy(part1.getInputStream(), file1.toPath(), StandardCopyOption.REPLACE_EXISTING);

                                        File file2 = new File(productFolder, "image2.png");
                                        Files.copy(part2.getInputStream(), file2.toPath(), StandardCopyOption.REPLACE_EXISTING);

                                        File file3 = new File(productFolder, "image3.png");
                                        Files.copy(part3.getInputStream(), file3.toPath(), StandardCopyOption.REPLACE_EXISTING);
                                        //image uploading
                                        responseObject.addProperty("status", true);
                                        responseObject.addProperty("message", "Product saved successfully!");
                                    }
                                }
                            }
                        }
                    }

                }
            }

            //send response
            Gson gson = new Gson();

            response.setContentType(
                    "application/json");
            response.getWriter()
                    .write(gson.toJson(responseObject));
            //send response
        }
    }

    private void respond(HttpServletResponse response, String message) throws IOException {
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        responseObject.addProperty("message", message);
        response.setContentType("application/json");
        response.getWriter().write(new Gson().toJson(responseObject));
    }

}
