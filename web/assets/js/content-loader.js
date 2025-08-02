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
    const data = `<div class="axil-header-top">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-sm-6">
                <div class="header-top-dropdown">
                    <div class="dropdown">
                        <button class="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            English
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#">English</a></li>
                        </ul>
                    </div>
                    <div class="dropdown">
                        <button class="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            LKR
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#">LKR</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="header-top-link">
                    <ul class="quick-link">
                        <li><a href="#">Help</a></li>
                        <li><a href="sign-up.html">Join Us</a></li>
                        <li><a href="sign-in.html">Sign In</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Start Mainmenu Area  -->
<div id="axil-sticky-placeholder"></div>
<div class="axil-mainmenu">
    <div class="container">
        <div class="header-navbar">
            <div class="header-brand">
                <a href="index.html" class="logo logo-dark">
                    <img src="assets/images/logo/logo.png" alt="Site Logo">
                </a>
                <a href="index.html" class="logo logo-light">
                    <img src="assets/images/logo/logo-light.png" alt="Site Logo">
                </a>
            </div>
            <div class="header-main-nav">
                <!-- Start Mainmanu Nav -->
                <nav class="mainmenu-nav">
                    <button class="mobile-close-btn mobile-nav-toggler"><i class="fas fa-times"></i></button>
                    <div class="mobile-nav-brand">
                        <a href="index.html" class="logo">
                            <img src="assets/images/logo/logo.png" alt="Site Logo">
                        </a>
                    </div>
                    <ul class="mainmenu">
                        <li class="menu-item-has-children">
                            <a href="#">Menu-1</a>
                            <ul class="axil-submenu">
                                <li><a href="#">Menu-1-Item-1</a></li>
                            </ul>
                        </li>
                        <li class="menu-item-has-children">
                            <a href="#">Menu-2</a>
                            <ul class="axil-submenu">
                                <li><a href="#">Menu-2-Item-1</a></li>
                            </ul>
                        </li>
                        <li class="menu-item-has-children">
                            <a href="#">Menu-3</a>
                            <ul class="axil-submenu">
                                <li><a href="#">Menu-3-Item-1</a></li>
                            </ul>
                        </li>
                        <li><a href="#">Menu-4</a></li>
                        <li class="menu-item-has-children">
                            <a href="#">Menu-5</a>
                            <ul class="axil-submenu">
                                <li><a href="#">Menu-5-Item-1</a></li>
                            </ul>
                        </li>
                        <li><a href="#">Menu-6</a></li>
                    </ul>
                </nav>
                <!-- End Mainmanu Nav -->
            </div>
            <div class="header-action">
                <ul class="action-list">
                    <li class="axil-search">
                        <a href="javascript:void(0)" class="header-search-icon" title="Search">
                            <i class="flaticon-magnifying-glass"></i>
                        </a>
                    </li>
                    <li class="wishlist">
                        <a href="#">
                            <i class="flaticon-heart"></i>
                        </a>
                    </li>
                    <li class="shopping-cart">
                        <a href="#" onclick="viewCart();"; class="cart-dropdown-btn">
                            <span class="cart-count">3</span>
                            <i class="flaticon-shopping-cart"></i>
                        </a>
                    </li>
                    <li class="my-account">
                        <a href="javascript:void(0)">
                            <i class="flaticon-person"></i>
                        </a>
                        <div class="my-account-dropdown">
                            <span class="title">QUICKLINKS</span>
                            <ul>
                                <li>
                                    <a href="my-account.html">My Account</a>
                                </li>
                                <li>
                                    <a href="#">Support</a>
                                </li>
                                <li>
                                    <a href="#">Language</a>
                                </li>
                            </ul>
                            <div class="login-btn">
                                <a href="sign-in.html" class="axil-btn btn-bg-primary">Login</a>
                            </div>
                            <div class="reg-footer text-center">No account yet? <a href="sign-up.html" class="btn-link">REGISTER HERE.</a></div>
                        </div>
                    </li>
                    <li class="axil-mobile-toggle">
                        <button class="menu-btn mobile-nav-toggler">
                            <i class="flaticon-menu-2"></i>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>
<!-- End Mainmenu Area -->`;
    document.querySelector("header").innerHTML = data;
}

function loadFooter() {
    const data = `<!-- Start Footer Top Area  -->
<div class="footer-top separator-top">
    <div class="container">
        <div class="row">
            <!-- Start Single Widget  -->
            <div class="col-lg-3 col-sm-6">
                <div class="axil-footer-widget">
                    <h5 class="widget-title">Support</h5>

                    <div class="inner">
                        <p>
                        </p>
                        <ul class="support-list-item">
                            <li><a href="mailto:support@smarttrade.lk"><i class="fal fa-envelope-open"></i> support@smarttrade.lk</a></li>
                            <li><a href="tel:"><i class="fal fa-phone-alt"></i> Phone Number</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <!-- End Single Widget  -->
            <!-- Start Single Widget  -->
            <div class="col-lg-3 col-sm-6">
                <div class="axil-footer-widget">
                    <h5 class="widget-title">Account</h5>
                    <div class="inner">
                        <ul>
                            <li><a href="my-account.html">My Account</a></li>
                            <li><a href="sign-in.html">Login / Register</a></li>
                            <li><a href="cart.html">Cart</a></li>
                            <li><a href="#">Wishlist</a></li>
                            <li><a href="index.html">Shop</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <!-- End Single Widget  -->
            <!-- Start Single Widget  -->
            <div class="col-lg-3 col-sm-6">
                <div class="axil-footer-widget">
                    <h5 class="widget-title">Quick Link</h5>
                    <div class="inner">
                        <ul>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms Of Use</a></li>
                            <li><a href="#">FAQ</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <!-- End Single Widget  -->
            <!-- Start Single Widget  -->
            <div class="col-lg-3 col-sm-6">
                <div class="axil-footer-widget">
                    <h5 class="widget-title">Download App</h5>
                    <div class="inner">
                        <div class="download-btn-group">

                            <div class="app-link">
                                <a href="#">
                                    <img src="assets/images/others/app-store.png" alt="App Store">
                                </a>
                                <a href="#">
                                    <img src="assets/images/others/play-store.png" alt="Play Store">
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- End Single Widget  -->
        </div>
    </div>
</div>
<!-- End Footer Top Area  -->
<!-- Start Copyright Area  -->
<div class="copyright-area copyright-default separator-top">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-xl-4">
                <div class="social-share">
                    <a href="#"><i class="fab fa-facebook-f"></i></a>
                    <a href="#"><i class="fab fa-instagram"></i></a>
                    <a href="#"><i class="fa-brands fa-x-twitter"></i></a>
                    <a href="#"><i class="fab fa-linkedin-in"></i></a>
                </div>
            </div>
            <div class="col-xl-4 col-lg-12">
                <div class="copyright-left d-flex flex-wrap justify-content-center">
                    <ul class="quick-link">
                        <li>©2025. All rights reserved by <a target="_blank" href="#">SmartTrade</a>.</li>
                    </ul>
                </div>
            </div>
            <div class="col-xl-4 col-lg-12">
                <div class="copyright-right d-flex flex-wrap justify-content-xl-end justify-content-center align-items-center">
                    <span class="card-text">Accept For</span>
                    <ul class="payment-icons-bottom quick-link">
                        <li><img src="assets/images/icons/mastercard.png" alt="paypal cart"></li>
                        <li><img src="assets/images/icons/visa.png" alt="paypal cart"></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- End Copyright Area  -->


<!-- Header Search Modal End -->
<div class="header-search-modal" id="header-search-modal">
    <button class="card-close sidebar-close"><i class="fas fa-times"></i></button>
    <div class="header-search-wrap">
        <div class="card-header">
            <form action="#">
                <div class="input-group">
                    <input type="search" class="form-control" name="prod-search" id="prod-search" placeholder="Search">
                    <button type="submit" class="axil-btn btn-bg-primary"><i class="far fa-search"></i></button>
                </div>
            </form>
        </div>
        <div class="card-body">
            <div class="search-result-header">
                <h6 class="title">1 Result Found</h6>
                <a href="#" class="view-all">View All</a>
            </div>
            <div class="psearch-results">
                <div class="axil-product-list">
                    <div class="thumbnail">
                        <a href="#">
                            <img src="./assets/images/product/product-03.png" alt="Product Image-1">
                        </a>
                    </div>
                    <div class="product-content">

                        <h6 class="product-title"><a href="#">Product Title-1</a></h6>
                        <div class="product-price-variant">
                            <span class="price current-price">Rs. 0.00</span>
                        </div>
                        <div class="product-cart">
                            <a href="#" class="cart-btn"><i class="fal fa-shopping-cart"></i></a>
                            <a href="#" class="cart-btn"><i class="fal fa-heart"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Header Search Modal End -->


<div class="cart-dropdown" id="cart-dropdown">
    <div class="cart-content-wrap">
        <div class="cart-header">
            <h2 class="header-title">Cart Review</h2>
            <button class="cart-close sidebar-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="cart-body">
            <ul class="cart-item-list" id="side-panal-cart-item-list">
                
            </ul>
        </div>
        <div class="cart-footer">
            <h3 class="cart-subtotal">
                <span class="subtotal-title">Subtotal:</span>
                <span class="subtotal-amount" id="side-panel-cart-sub-total">Rs. 0.00</span>
            </h3>
            <div class="group-btn">
                <a href="cart.html" class="axil-btn btn-bg-primary viewcart-btn">View Cart</a>
                <a href="checkout.html" class="axil-btn btn-bg-secondary checkout-btn">Checkout</a>
            </div>
        </div>
    </div>
</div>

<div class="closeMask"></div>`;

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
