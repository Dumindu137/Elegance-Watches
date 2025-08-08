function indexOnloadFunctions() {
    checkSessionCart();
    loadProductsToHomepage();

}
async function checkSessionCart() {
    const popup = new Notification();
    const response = await fetch("CheckSessionCart");
    if (!response.ok) {
        popup.error({
            message: "Something went wrong! Try again shortly"
        });
    }
}

async function loadProductsToHomepage() {
    console.log("Running loadProductsToHomepage()");

    try {
        const response = await fetch("LoadHomeData");
        if (!response.ok) {
            console.error("Failed to load product data");
            return;
        }

        const data = await response.json();
        console.log("Received data:", data);

        if (!data.status) {
            console.error("Backend returned error status");
            return;
        }

        // DOM must already be loaded at this point
        const section = document.querySelector(".product_section");
        if (!section) {
            console.error("No .product_section found");
            return;
        }

        const container = section.querySelector(".product_container");
        if (!container) {
            console.error("No .product_container found inside .product_section");
            return;
        }

        container.innerHTML = ""; // Clear existing content

        data.productList.forEach(product => {
            const box = document.createElement("div");
            box.className = "box";

            box.innerHTML = `
    <div style="width: 350px; height: 350px; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; background: #fff; padding: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
        <a href="single-product.html?id=${product.id}" style="text-decoration: none; color: inherit; flex-grow: 1;">
            <div style="width: 100%; height: 180px; display: flex; justify-content: center; align-items: center; background-color: #f9f9f9;">
                <img src="product-images/${product.id}/image1.png" alt="${product.title}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
            </div>
            <div class="detail-box" style="margin-top: 10px;">
                <div class="text" style="text-align: center;">
                    <h6 style="font-weight: 600; font-size: 1rem;">${product.title}</h6>
                    <h5 style="font-size: 1rem; color: #e53935;"><span style="font-weight: 500;">Rs.</span> ${parseFloat(product.price).toFixed(2)}</h5>
                </div>
            </div>
        </a>
        <div class="btn-box" style="margin-top: 12px; text-align: center;">
            <a href="#" onclick="addToCart(${product.id}, 1)" style="display: inline-block; padding: 6px 14px; background: #007bff; color: white; border-radius: 4px; text-decoration: none;">Add To Cart</a>
        </div>
    </div>
`;



            container.appendChild(box);
        });
    } catch (e) {
        console.error("Error loading homepage data:", e);
    }
}


async function loadAllToProductPage() {
    console.log("Running loadAllToProductPage()");

    try {
        const response = await fetch("LoadProductPageData");
        if (!response.ok) {
            console.error("Failed to load product data");
            return;
        }

        const data = await response.json();
        console.log("Received data:", data);

        if (!data.status) {
            console.error("Backend returned error status");
            return;
        }

        // DOM must already be loaded at this point
        const section = document.querySelector(".product_section");
        if (!section) {
            console.error("No .product_section found");
            return;
        }

        const container = section.querySelector(".product_container");
        if (!container) {
            console.error("No .product_container found inside .product_section");
            return;
        }

        container.innerHTML = ""; // Clear existing content

        data.productList.forEach(product => {
            const box = document.createElement("div");
            box.className = "box";

            box.innerHTML = `
    <div style="width: 350px; height: 350px; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; background: #fff; padding: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
        <a href="single-product.html?id=${product.id}" style="text-decoration: none; color: inherit; flex-grow: 1;">
            <div style="width: 100%; height: 180px; display: flex; justify-content: center; align-items: center; background-color: #f9f9f9;">
                <img src="product-images/${product.id}/image1.png" alt="${product.title}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
            </div>
            <div class="detail-box" style="margin-top: 5px;">
                <div class="text" style="text-align: center;">
                    <h6 style="font-weight: 600; font-size: 1rem;">${product.title}</h6>
                    <h5 style="font-size: 1rem; color: #e53935;"><span style="font-weight: 500;">Rs.</span> ${parseFloat(product.price).toFixed(2)}</h5>
                </div>
            </div>
        </a>
        <div class="btn-box" style="margin-top: 12px; text-align: center;">
            <a href="#" onclick="addToCart(${product.id}, 1)" style="display: inline-block; padding: 6px 14px; background: #007bff; color: white; border-radius: 4px; text-decoration: none;">Add To Cart</a>
        </div>
    </div>
`;



            container.appendChild(box);
        });
    } catch (e) {
        console.error("Error loading homepage data:", e);
    }
}

//async function addToCart(productId, qty) {
////    const response = await fetch(`AddToCart?prId=${productId}&qty=${qty}`);
////    const json = await response.json();
////    if (json.status) {
////        alert("Product added to cart!");
////    } else {
////        alert("Failed to add product to cart.");
////    }
//    console.log("Sending add-to-cart request:", productId, qty);
//    const popup = new Notification();// link notification js in single-product.html
//    const response = await fetch("AddToCart?prId=" + productId + "&qty=" + qty);
//    if (response.ok) {
//        const json = await response.json(); // await response.text();
//        if (json.status) {
//            popup.success({
//                message: json.message
//            });
//        } else {
//            popup.error({
//                message: "Something went wrong. Try again"
//            });
//
//        }
//    } else {
//        popup.error({
//            message: "Something went wrong. Try again"
//        });
//    }
//}



function loadBrands(json) {
    const product_brand_container = document.getElementById("product-brand-container");
    let product_brand_card = document.getElementById("product-brand-card");
    product_brand_container.innerHTML = "";
    let card_delay = 200;
    json.brandList.forEach(item => {
        let product_brand_card_clone = product_brand_card.cloneNode(true);
        product_brand_card_clone.querySelector("#product-brand-mini-card")
                .setAttribute("data-sal", "zoom-out");
        product_brand_card_clone.querySelector("#product-brand-mini-card")
                .setAttribute("data-sal-delay", String(card_delay));
        product_brand_card_clone.querySelector("#product-brand-a")
                .href = "search.html";
        product_brand_card_clone.querySelector("#product-brand-title")
                .innerHTML = item.name;
        product_brand_container.appendChild(product_brand_card_clone);
        card_delay += 100;
        sal();
    });
}

function loadNewArrivals(products) {
    const productContainers = document.querySelectorAll(".product_section .product_container");

    if (productContainers.length === 0) {
        console.warn("No .product_container elements found.");
        return;
    }

    products.forEach((product, index) => {
        const box = document.createElement("div");
        box.classList.add("box");

        box.innerHTML = `
            <div class="img-box">
                <img src="images/${product.image}" alt="${product.title}" />
            </div>
            <div class="detail-box">
                <h5>${product.title}</h5>
                <h6>$${product.price}</h6>
            </div>
        `;

        // Append to the first container or round-robin multiple
        const container = productContainers[index % productContainers.length];
        container.appendChild(box);
    });
}



async function addToCart(productId, qty) {
    
    const response = await fetch("AddToCart?prId=" + productId + "&qty=" + qty);
    if (response.ok) {
        const json = await response.json(); // await response.text();
        if (json.status) {
//            popup.success({
//                message: json.message
//            });
            toastr.error({message: json.message});
        } else {
//            popup.error({
//                message: "Something went wrong. Try again"
//            });
            toastr.error("Something went wrong. Try again");

        }
    } else {
        toastr.error("Something went wrong. Try again");
    }
}

window.addEventListener("DOMContentLoaded", () => {
    loadProductsToHomepage();
    // any other onload functions like:
    indexOnloadFunctions();
});
