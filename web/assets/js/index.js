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
                <div class="box-content">
                    <div class="img-box">
                        <img src="product-images/${product.id}/image1.png" alt="${product.title}">
                    </div>
                    <div class="detail-box">
                        <div class="text">
                            <h6>${product.title}</h6>
                            <h5><span>Rs.</span> ${parseFloat(product.price).toFixed(2)}</h5>
                        </div>
                        <div class="like">
                            <h6>Like</h6>
                            <div class="star_container">
                                <i class="fa fa-star" aria-hidden="true"></i>
                                <i class="fa fa-star" aria-hidden="true"></i>
                                <i class="fa fa-star" aria-hidden="true"></i>
                                <i class="fa fa-star" aria-hidden="true"></i>
                                <i class="fa fa-star" aria-hidden="true"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btn-box">
                    <a href="#" onclick="addToCart(${product.id}, 1)">Add To Cart</a>
                </div>
            `;

            container.appendChild(box);
        });
    } catch (e) {
        console.error("Error loading homepage data:", e);
    }
}




async function addToCart(productId, qty) {
    const response = await fetch(`AddToCart?prId=${productId}&qty=${qty}`);
    const json = await response.json();
    if (json.status) {
        alert("Product added to cart!");
    } else {
        alert("Failed to add product to cart.");
    }
}



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
    const popup = new Notification();// link notification js in single-product.html
    const response = await fetch("AddToCart?prId=" + productId + "&qty=" + qty);
    if (response.ok) {
        const json = await response.json(); // await response.text();
        if (json.status) {
            popup.success({
                message: json.message
            });
        } else {
            popup.error({
                message: "Something went wrong. Try again"
            });

        }
    } else {
        popup.error({
            message: "Something went wrong. Try again"
        });
    }
}

window.addEventListener("DOMContentLoaded", () => {
    loadProductsToHomepage();
    // any other onload functions like:
    indexOnloadFunctions();
});
