function initHeaderDropdowns() {
    const userIcon = document.querySelector(".my-account > a");
    const dropdown = document.querySelector(".my-account-dropdown");

    if (userIcon && dropdown) {
        userIcon.addEventListener("click", function (e) {
            e.preventDefault();
            dropdown.classList.toggle("open");
            userIcon.classList.toggle("close");
        });
        document.addEventListener("click", function (e) {
            if (!userIcon.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove("open");
                userIcon.classList.remove("close");
            }
        });
    }
}

function loadHeader() {
    const data = `
    <div class="container-fluid">
        <nav class="navbar navbar-expand-lg custom_nav-container ">
            <a class="navbar-brand" href="index.html">
                <span>Elegance Watches</span>
            </a>

            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class=""> </span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav" id="navbar-links">
                    <li class="nav-item">
                        <a class="nav-link" href="index.html">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="about.html">About</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="search.html">Products</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="testimonial.html">Testimonial</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="contact.html">Contact Us</a>
                    </li>
                </ul>
                <div class="user_optio_box">
                    <a href="profile-settings.html">
                        <i class="fa fa-user" aria-hidden="true"></i>
                    </a>
                    <a href="cart.html">
                        <i class="fa fa-shopping-cart" aria-hidden="true"></i>
                    </a>
                </div>
            </div>
        </nav>
    </div>
`;

    document.querySelector("header").innerHTML = data;

// Set active nav item
    const currentPath = window.location.pathname.split("/").pop(); // Get current file name
    document.querySelectorAll("#navbar-links .nav-link").forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.parentElement.classList.add("active");
        }
    });

}

function loadFooter() {
    const data = `        <section class="info_section layout_padding2">
            <div class="container">
                <div class="info_logo">
                    <h2>
                        Elegance Watches
                    </h2>
                </div>
                <div class="row">

                    <div class="col-md-3">
                        <div class="info_contact">
                            <h5>
                                About Shop
                            </h5>
                            <div>
                                <div class="img-box">
                                    <img src="assets/images/location-white.png" width="18px" alt="">
                                </div>
                                <p>
                                    Address
                                </p>
                            </div>
                            <div>
                                <div class="img-box">
                                    <img src="assets/images/telephone-white.png" width="12px" alt="">
                                </div>
                                <p>
                                    +01 1234567890
                                </p>
                            </div>
                            <div>
                                <div class="img-box">
                                    <img src="assets/images/envelope-white.png" width="18px" alt="">
                                </div>
                                <p>
                                    demo@gmail.com
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="info_info">
                            <h5>
                                Informations
                            </h5>
                            <p>
                                ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                            </p>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="info_insta">
                            <h5>
                                Instagram
                            </h5>
                            <div class="insta_container">
                                <div class="row m-0">
                                    <div class="col-4 px-0">
                                        <a href="">
                                            <div class="insta-box b-1">
                                                <img src="assets/images/w1.png" alt="">
                                            </div>
                                        </a>
                                    </div>
                                    <div class="col-4 px-0">
                                        <a href="">
                                            <div class="insta-box b-1">
                                                <img src="assets/images/w2.png" alt="">
                                            </div>
                                        </a>
                                    </div>
                                    <div class="col-4 px-0">
                                        <a href="">
                                            <div class="insta-box b-1">
                                                <img src="assets/images/w3.png" alt="">
                                            </div>
                                        </a>
                                    </div>
                                    <div class="col-4 px-0">
                                        <a href="">
                                            <div class="insta-box b-1">
                                                <img src="assets/images/w4.png" alt="">
                                            </div>
                                        </a>
                                    </div>
                                    <div class="col-4 px-0">
                                        <a href="">
                                            <div class="insta-box b-1">
                                                <img src="assets/images/w5.png" alt="">
                                            </div>
                                        </a>
                                    </div>
                                    <div class="col-4 px-0">
                                        <a href="">
                                            <div class="insta-box b-1">
                                                <img src="assets/images/w6.png" alt="">
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="info_form ">
                            <h5>
                                Newsletter
                            </h5>
                            <form action="">
                                <input type="email" placeholder="Enter your email">
                                <button>
                                    Subscribe
                                </button>
                            </form>
                            <div class="social_box">
                                <a href="">
                                    <img src="assets/images/fb.png" alt="">
                                </a>
                                <a href="">
                                    <img src="assets/images/twitter.png" alt="">
                                </a>
                                <a href="">
                                    <img src="assets/images/linkedin.png" alt="">
                                </a>
                                <a href="">
                                    <img src="assets/images/youtube.png" alt="">
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- end info_section -->

        <!-- copyright section -->
        <section class="footer_section">
            <div class="container">
                <p>
                    &copy; <span id="displayYear"></span> All Rights Reserved By
                   Elegance Watches
                </p>
            </div>
        </section>
        <!-- copyright section -->`;

    document.querySelector("footer").innerHTML = data;
}

async function viewCart() {
    const popup = new Notification();
    const response = await fetch("LoadCartItems");
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            const side_panel_cart_item_list = document.getElementById("side-panal-cart-item-list");
            side_panel_cart_item_list.innerHTML = "";

            let total = 0;
            let totalQty = 0;
            json.cartItems.forEach(cart => {
                let productSubTotal = cart.product.price * cart.qty;
                total += productSubTotal;
                totalQty += cart.qty;
                let cartItem = `<li class="cart-item">
                    <div class="item-img">
                        <a href="single-product.html?id=${cart.product.id}">
<img src="product-images\\${cart.product.id}\\image1.png" alt="Product Image-1"></a>
                        <button class="close-btn"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="item-content">
                        <h3 class="item-title"><a href="#">${cart.product.title}</a></h3>
                        <div class="item-price"><span class="currency-symbol">Rs. </span>${new Intl.NumberFormat(
                        "en-US",
                        {minimumFractionDigits: 2})
                        .format(cart.product.price)}</div>
                        <div class="pro-qty item-quantity">
                            <input type="number" class="quantity-input" value="${cart.qty}">
                        </div>
                    </div>
                </li>`;
                side_panel_cart_item_list.innerHTML += cartItem;
            });
            document.getElementById("side-panel-cart-sub-total").innerHTML = new Intl.NumberFormat("en-US",
                    {minimumFractionDigits: 2})
                    .format(total);
        } else {
            popup.error({
                message: json.message
            });
        }
    } else {
        popup.error({
            message: "Cart Items loading failed..."
        });
    }
}

loadHeader();
loadFooter();
initHeaderDropdowns();
