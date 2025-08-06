async function loadCartItems(showSuccessToast = true) {
    try {
        const response = await fetch("/Elegance_Watches/LoadCartItems");

        if (!response.ok) {
            toastr.error("Cart Items loading failed...");
            return;
        }

        const json = await response.json();
        console.log("Cart response:", json);

        if (!json.status) {
            toastr.error(json.message || "Failed to load cart items.");
            return;
        }

        const itemsContainer = document.querySelector(".items");
        if (!itemsContainer) {
            console.error("'.items' container not found in HTML.");
            toastr.error("Cart UI container missing.");
            return;
        }

        itemsContainer.innerHTML = "";

        let total = 0;
        let totalQty = 0;

        json.cartItems.forEach(cart => {
            if (!cart.product || typeof cart.product.price !== "number" || !cart.product.title) {
                console.warn("Invalid cart item skipped:", cart);
                return;
            }

            let productSubTotal = cart.product.price * cart.qty;
            total += productSubTotal;
            totalQty += cart.qty;

            const item = document.createElement("div");
            item.className = "product d-flex align-items-center mb-3 p-3 border rounded justify-content-between";
            item.style.margin = "0 30px";

            item.innerHTML = `
                <div class="d-flex align-items-center" style="flex: 1;">
                    <img src="product-images/${cart.product.id}/image1.png" class="img-fluid rounded mr-3" style="height: 150px; width: 150px; object-fit: cover;" alt="${cart.product.title}">

                    <div class="d-flex flex-column justify-content-between" style="min-width: 200px;">
                        <h5 class="mb-2">${cart.product.title}</h5>
                        <p class="mb-2">Rs. ${cart.product.price.toFixed(2)}</p>
                        <div class="d-flex align-items-center">
                            <label class="mr-2 mb-0">Qty:</label>
                            <input type="number" class="form-control quantity-input" style="width: 80px;" value="${cart.qty}">
                        </div>
                    </div>
                </div>

                <div class="text-middle" style="min-width: 150px;">
                    <p class="mb-2"><strong>Subtotal:</strong></p>
                    <p><strong>Rs. ${productSubTotal.toFixed(2)}</strong></p>
                </div>

                <div class="ml-auto">
                    <button class="btn btn-danger btn-sm" onclick="removeCartItem(${cart.id})">Remove</button>
                </div>
            `;

            itemsContainer.appendChild(item);
        });

        document.getElementById("order-total-quantity").innerHTML = totalQty;
        document.getElementById("order-total-amount").innerHTML = total.toFixed(2);

        // ✅ Only show this if requested
        if (showSuccessToast) {
            toastr.success("Cart items loaded successfully");
        }

    } catch (error) {
        console.error("Error loading cart items:", error);
        toastr.error("Something went wrong while loading cart.");
}
}


async function removeCartItem(cartId) {
    try {
        const response = await fetch('RemoveCartItem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `cartId=${cartId}`,
        });

        const result = await response.json();

        if (result.status === true) {
            toastr.success("Item removed successfully.");
            await loadCartItems(false); // suppress the extra "loaded" toast
        } else {
            toastr.error(result.message || "Failed to remove item.");
        }

    } catch (err) {
        console.error("Error removing item:", err);
        toastr.error("Error occurred while removing item.");
    }
}

