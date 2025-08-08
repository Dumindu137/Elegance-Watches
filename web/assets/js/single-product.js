let currentProductId = null;

toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-bottom-right",
    timeOut: "2500"
};

async function loadData() {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("id")) {
        const productId = searchParams.get("id");
        currentProductId = productId; // Store globally
        console.log("Loaded product ID:", currentProductId);

        const response = await fetch("LoadSingleProduct?id=" + productId);
        if (response.ok) {
            const json = await response.json();
            if (json.status) {
                console.log(json);

                // Update images
                document.getElementById("image1").src = `product-images/${json.product.id}/image1.png`;
                document.getElementById("image2").src = `product-images/${json.product.id}/image2.png`;
                document.getElementById("image3").src = `product-images/${json.product.id}/image3.png`;
                document.getElementById("thumb-image1").src = `product-images/${json.product.id}/image1.png`;
                document.getElementById("thumb-image2").src = `product-images/${json.product.id}/image2.png`;
                document.getElementById("thumb-image3").src = `product-images/${json.product.id}/image3.png`;

                // Text content
                document.getElementById("product-title").innerHTML = json.product.title;
                document.getElementById("published-on").innerHTML = json.product.created_at;
                document.getElementById("product-price").innerHTML = new Intl.NumberFormat("en-US", {minimumFractionDigits: 2}).format(json.product.price);
                document.getElementById("brand-name").innerHTML = json.product.model.brand.name;
                document.getElementById("model-name").innerHTML = json.product.model.name;
                document.getElementById("product-quality").innerHTML = json.product.quality.value;
                document.getElementById("product-stock").innerHTML = json.product.qty;

                // Colors
                document.getElementById("color-border").style.borderColor = "black";
                document.getElementById("color-background").style.backgroundColor = json.product.color.value;

                // Description
                document.getElementById("product-description").innerHTML = json.product.description;
                document.getElementById("madeYear").innerHTML = json.product.madeYear;
                document.getElementById("gender").innerHTML = json.product.model.gender.value;

                // Similar Products
                let similer_product_main = document.getElementById("smiler-product-main");
                let productHtml = document.getElementById("similer-product").cloneNode(true);
                productHtml.classList.remove("hidden");
                similer_product_main.innerHTML = "";

                json.productList.forEach(item => {
                    let productCloneHtml = productHtml.cloneNode(true);
                    productCloneHtml.querySelector(".similer-product-a1").href = "single-product.html?id=" + item.id;
                    productCloneHtml.querySelector(".similer-product-image").src = "product-images/" + item.id + "/image1.png";
                    productCloneHtml.querySelector(".simler-product-add-to-cart").addEventListener("click", (e) => {
                        e.preventDefault();
                        addToCart(item.id, 1);
                    });
                    productCloneHtml.querySelector(".similer-product-a2").href = "single-product.html?id=" + item.id;
                    productCloneHtml.querySelector(".similer-product-title").innerHTML = item.title;
                    productCloneHtml.querySelector(".similer-product-price").innerHTML =
                            "Rs. " + new Intl.NumberFormat("en-US", {minimumFractionDigits: 2}).format(item.price);
                    productCloneHtml.querySelector(".similer-product-color-border").style.borderColor = "black";
                    productCloneHtml.querySelector(".similer-product-color-background").style.backgroundColor = item.color.value;

                    similer_product_main.appendChild(productCloneHtml);
                });
            } else {
                window.location = "index.html";
            }
        } else {
            window.location = "index.html";
        }
    }
}

// Global delegated click listener
document.addEventListener("click", function (e) {
    const btn = e.target.closest("#add-to-cart-main"); // handles clicks on children inside the button
    if (btn) {
        e.preventDefault();
        const qty = parseInt(document.getElementById("add-to-cart-qty").value);
        if (isNaN(qty) || qty < 1) {
            toastr.error("Please enter a valid quantity.");
            return;
        }
        console.log("Sending request: AddToCart?prId=" + currentProductId + "&qty=" + qty);
        addToCart(currentProductId, qty);
    }
});


async function addToCart(productId, qty) {
    console.log(`Sending request: AddToCart?prId=${productId}&qty=${qty}`);

    try {
        const response = await fetch(`AddToCart?prId=${productId}&qty=${qty}`, {
            method: "GET"
        });

        if (!response.ok) {
            toastr.error("Server error. Please try again.");
            return;
        }

        const json = await response.json();

        if (json.status) {
            toastr.success("Product added to cart!");
        } else {
            toastr.error(json.message || "Could not add product to cart.");
        }
    } catch (error) {
        console.error(error);
        toastr.error(" Something went wrong. Please check your connection.");
    }
}
