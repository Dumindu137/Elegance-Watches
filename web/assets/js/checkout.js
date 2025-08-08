payhere.onCompleted = function onCompleted(orderId) {
    const popup = new Notification();

    toastr.success("Payment completed. OrderID:" + orderId);

    finalizeOrderAfterPayment(orderId);
};


// Payment window closed
payhere.onDismissed = function onDismissed() {
    // Note: Prompt user to pay again or show an error page
    console.log("Payment dismissed");
};

// Error occurred
payhere.onError = function onError(error) {
    // Note: show an error page
    console.log("Error:" + error);
};

async function loadCheckoutData() {

//    const popup = new Notification();
    const response = await fetch("LoadCheckOutData");
    if (response.ok) { //200
        const json = await response.json();
        if (json.status) {
            console.log(json);
            const userAddress = json.userAddress;
            const cityList = json.cityList;
            const cartItems = json.cartList;
            const deliveryTypes = json.deliveryTypes;

            // load citites
            let city_select = document.getElementById("city-select");

            cityList.forEach(city => {
                let option = document.createElement("option");
                option.value = city.id;
                option.innerHTML = city.name;
                city_select.appendChild(option);
            });

            // load current address
            const current_address_checkbox = document.getElementById("checkbox1");
            current_address_checkbox.addEventListener("change", function () {

                let first_name = document.getElementById("first-name");
                let last_name = document.getElementById("last-name");
                let line_one = document.getElementById("line-one");
                let line_two = document.getElementById("line-two");
                let postal_code = document.getElementById("postal-code");
                let mobile = document.getElementById("mobile");
                if (current_address_checkbox.checked) {
                    first_name.value = userAddress.user.first_name;
                    last_name.value = userAddress.user.last_name;
                    city_select.value = userAddress.city.id;
                    city_select.disabled = true;
                    city_select.dispatchEvent(new Event("change"));
                    line_one.value = userAddress.line1
                    line_two.value = userAddress.line2;
                    postal_code.value = userAddress.postal_code;
                    mobile.value = userAddress.mobile;
                } else {
                    first_name.value = "";
                    last_name.value = "";
                    city_select.value = 0;
                    city_select.disabled = false;
                    city_select.dispatchEvent(new Event("change"));
                    line_one.value = "";
                    line_two.value = "";
                    postal_code.value = "";
                    mobile.value = "";
                }
            });

            // cart-details
            let st_tbody = document.getElementById("st-tbody");
            let st_item_tr = document.getElementById("st-item-tr");
            let st_subtotal_tr = document.getElementById("st-subtotal-tr");
            let st_order_shipping_tr = document.getElementById("st-order-shipping-tr");
            let st_order_total_tr = document.getElementById("st-order-total-tr");

            st_tbody.innerHTML = "";

            let total = 0;
            let item_count = 0;
            cartItems.forEach(cart => {
                let st_item_tr_clone = st_item_tr.cloneNode(true);
                st_item_tr_clone.querySelector("#st-product-title")
                        .innerHTML = cart.product.title;
                st_item_tr_clone.querySelector("#st-product-qty")
                        .innerHTML = cart.qty;
                item_count += cart.qty;
                let item_sub_total = Number(cart.qty) * Number(cart.product.price);

                st_item_tr_clone.querySelector("#st-product-price")
                        .innerHTML = new Intl.NumberFormat(
                                "en-US",
                                {minimumFractionDigits: 2})
                        .format(item_sub_total);
                st_tbody.appendChild(st_item_tr_clone);

                total += item_sub_total;
            });

            st_subtotal_tr.querySelector("#st-product-total-amount")
                    .innerHTML = new Intl.NumberFormat(
                            "en-US",
                            {minimumFractionDigits: 2})
                    .format(total);
            st_tbody.appendChild(st_subtotal_tr);

            let shipping_charges = 0;

            function updateShippingAndTotal() {
                let cityName = city_select.options[city_select.selectedIndex].innerHTML;
                if (cityName === "Colombo") {
                    shipping_charges = deliveryTypes[0].price;
                } else {
                    shipping_charges = deliveryTypes[1].price;
                }

                st_order_shipping_tr.querySelector("#st-product-shipping-charges")
                        .innerHTML = new Intl.NumberFormat("en-US", {minimumFractionDigits: 2})
                        .format(shipping_charges);

                st_tbody.appendChild(st_order_shipping_tr);

                st_order_total_tr.querySelector("#st-order-total-amount")
                        .innerHTML = new Intl.NumberFormat("en-US", {minimumFractionDigits: 2})
                        .format(shipping_charges + total);

                st_tbody.appendChild(st_order_total_tr);
            }

            // Run the calculation immediately after loading the data:
            updateShippingAndTotal();

            // Also update on city select change:
            city_select.addEventListener("change", () => {
                updateShippingAndTotal();
            });
            
        } else {
            if (json.message === "empty-cart") {
                popup.error({
                    message: "Empty cart. Please add some product"
                });
                window.location = "index.html";
            } else {
                popup.error({
                    message: json.message
                });
            }
        }
    } else {
        if (response.status === 401) {
            window.location = "sign-in.html";
        }
    }
}


async function checkout() {
    console.log("Checkout button clicked");

    let checkbox1 = document.getElementById("checkbox1").checked;
    let data = {
        isCurrentAddress: checkbox1,
        firstName: document.getElementById("first-name").value,
        lastName: document.getElementById("last-name").value,
        citySelect: document.getElementById("city-select").value,
        lineOne: document.getElementById("line-one").value,
        lineTwo: document.getElementById("line-two").value,
        postalCode: document.getElementById("postal-code").value,
        mobile: document.getElementById("mobile").value
    };

    // 🔹 Send user data to backend to generate PayHere payment JSON
    const response = await fetch("CheckOut", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        console.error("Error generating PayHere data.");
        return;
    }

    const json = await response.json();

    if (!json.status) {
        console.error(json.message);
        return;
    }

    // 🔹 Start PayHere payment
    payhere.startPayment(json.payhereJson);

    // 🔸 THIS IS THE CRITICAL PART 🔸
    payhere.onCompleted = async function (orderId) {
        const popup = new Notification();
        popup.success({
            message: "Payment completed. OrderID:" + orderId
        });

        // 🔹 This calls FinalizeOrder servlet after payment
        await finalizeOrderAfterPayment(orderId);
    };

    payhere.onDismissed = function () {
        console.log("Payment dismissed by user");
    };

    payhere.onError = function (error) {
        console.error("Payment error: " + error);
    };
}


async function finalizeOrderAfterPayment(orderId) {
    let data = {
        isCurrentAddress: document.getElementById("checkbox1").checked,
        firstName: document.getElementById("first-name").value,
        lastName: document.getElementById("last-name").value,
        citySelect: document.getElementById("city-select").value,
        lineOne: document.getElementById("line-one").value,
        lineTwo: document.getElementById("line-two").value,
        postalCode: document.getElementById("postal-code").value,
        mobile: document.getElementById("mobile").value,
        payhereOrderId: orderId
    };

    const response = await fetch("FinalizeOrder", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });

    const json = await response.json();

    if (json.status) {
    toastr.success("Order successfully placed!");

    // Clear form fields
    document.getElementById("checkbox1").checked = false;
    document.getElementById("first-name").value = "";
    document.getElementById("last-name").value = "";
    document.getElementById("city-select").value = 0;
    document.getElementById("line-one").value = "";
    document.getElementById("line-two").value = "";
    document.getElementById("postal-code").value = "";
    document.getElementById("mobile").value = "";

    // Clear cart display (adjust based on your HTML)
    const stTbody = document.getElementById("st-tbody");
    if (stTbody) stTbody.innerHTML = "";

    // Optionally reset any other UI states or totals here
} else {
    toastr.error({message: json.message});
}

}

