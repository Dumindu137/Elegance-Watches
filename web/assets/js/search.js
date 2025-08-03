async function loadData() {
    try {
        const response = await fetch("LoadData");

        if (!response.ok) {
            console.error("Something went wrong");
            return;
        }

        const json = await response.json();

        if (!json.status) {
            console.error("Something went wrong");
            return;
        }

        loadOptions("brand", json.brandList, "name");
        loadOptions("condition", json.qualityList, "value");
        console.log("Color list from backend:", json.colorList);
        loadOptions("color", json.colorList, "value");
        loadOptions("gender", json.genderList, "value");

        document.getElementById("st-sort").addEventListener("change", () => {
            searchProduct(0);  // reset to first page when sorting changes
        });

        console.log("Product list from backend:", json.productList);

        updateProductView(json);

        // Init price slider
        const minPrice = 0;
        const maxPrice = 1000000;

        $("#slider-range").slider({
            range: true,
            min: minPrice,
            max: maxPrice,
            values: [minPrice, maxPrice],
            slide: function (event, ui) {
                $("#price-min").val(ui.values[0]);
                $("#price-max").val(ui.values[1]);
            }
        });

        // Set initial input values
        $("#price-min").val(minPrice);
        $("#price-max").val(maxPrice);

        // Sync input changes with slider
        $("#price-min, #price-max").on("change", function () {
            let valMin = parseInt($("#price-min").val()) || minPrice;
            let valMax = parseInt($("#price-max").val()) || maxPrice;

            if (valMin < minPrice)
                valMin = minPrice;
            if (valMax > maxPrice)
                valMax = maxPrice;
            if (valMin > valMax)
                valMin = valMax;

            $("#slider-range").slider("values", [valMin, valMax]);
            $("#price-min").val(valMin);
            $("#price-max").val(valMax);
        });

    } catch (error) {
        console.error("Fetch failed:", error);
    }
}


function loadOptions(prefix, dataList, property) {
    const options = document.getElementById(prefix + "-options");
    const templateLi = options.querySelector(".option-template");
    options.innerHTML = ""; // clear existing options

    dataList.forEach(item => {
        const liClone = templateLi.cloneNode(true);
        liClone.classList.remove("option-template", "d-none");

        const anchor = liClone.querySelector(".option-link");

        if (prefix === "color") {
            const colorValue = item[property]; // e.g., "Red", "Black"
            liClone.style.border = `2px solid ${colorValue}`; // visible border
            anchor.style.backgroundColor = colorValue;
            anchor.textContent = ""; // no text for colors
            // Make sure li and anchor have some size
            liClone.style.width = "30px";
            liClone.style.height = "30px";
            anchor.style.display = "block";
            anchor.style.width = "100%";
            anchor.style.height = "100%";
            anchor.style.borderRadius = "50%";
        } else {
            anchor.textContent = item[property];
        }

        options.appendChild(liClone);
    });

    // Click event
    const allLi = options.querySelectorAll("li");
    allLi.forEach(li => {
        li.addEventListener("click", () => {
            allLi.forEach(el => el.classList.remove("chosen"));
            li.classList.add("chosen");
        });
    });
}

async function searchProduct(firstResult) {
    const popup = new Notification();

    const brand_name = document.getElementById("brand-options")
            .querySelector(".chosen")?.querySelector("a").innerHTML;

    const condition_name = document.getElementById("condition-options")
            .querySelector(".chosen")?.querySelector("a").innerHTML;

    const color_name = document.getElementById("color-options")
            .querySelector(".chosen")?.querySelector("a").style.backgroundColor;

    const gender_name = document.getElementById("gender-options")
            .querySelector(".chosen")?.querySelector("a").innerHTML;

    const price_range_start = document.getElementById("price-min").value;
    const price_range_end = document.getElementById("price-max").value;

    const sort_value = document.getElementById("st-sort").value;
    const name_search = document.getElementById("search-by-name")?.value || "";

    console.log("Sort value from frontend:", sort_value);


    const data = {
        firstResult: firstResult,
        brandName: brand_name,
        conditionName: condition_name,
        colorName: color_name,
        genderName: gender_name,
        priceStart: price_range_start,
        priceEnd: price_range_end,
        sortValue: sort_value,
        title: name_search
    };

    const dataJSON = JSON.stringify(data);

    try {
        const response = await fetch("SearchProducts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: dataJSON
        });

        if (response.ok) {
            const json = await response.json();
            if (json.status) {
                console.log(json);
                updateProductView(json);
                popup.success({message: "Product Loading Complete..."});
            } else {
                popup.error({message: "Something went wrong. Please try again later"});
            }
        } else {
            popup.error({message: "Something went wrong. Please try again later"});
        }
    } catch (error) {
        console.error("Fetch error:", error);
        popup.error({message: "Unexpected error occurred"});
    }
}


const st_product = document.getElementById("st-product"); // product card parent node
let st_pagination_button = document.getElementById("st-pagination-button");
let current_page = 0;

function updateProductView(json) {
    const product_container = document.getElementById("st-product-container");
    product_container.innerHTML = "";
    json.productList.forEach(product => {
        let st_product_clone = st_product.cloneNode(true);// enable child nodes cloning / allow child nodes
        st_product_clone.querySelector("#st-product-a-1").href = "single-product.html?id=" + product.id;
        st_product_clone.querySelector("#st-product-img-1").src = "product-images//" + product.id + "//image1.png";
        st_product_clone.querySelector("#st-product-add-to-cart").addEventListener(
                "click", (e) => {
            addToCart(product.id, 1);
            e.preventDefault();
        });
        st_product_clone.querySelector("#st-product-a-2").href = "single-product.html?id=" + product.id;
        st_product_clone.querySelector("#st-product-title-1").innerHTML = product.title;
        st_product_clone.querySelector("#st-product-price-1").innerHTML = new Intl.NumberFormat(
                "en-US",
                {minimumFractionDigits: 2})
                .format(product.price);
        ;
        //append child
        product_container.appendChild(st_product_clone);
    });

    let st_pagination_container = document.getElementById("st-pagination-container");
    st_pagination_container.innerHTML = "";
    let all_product_count = json.allProductCount;
    document.getElementById("all-item-count").innerHTML = all_product_count;
    let product_per_page = 6;
    let pages = Math.ceil(all_product_count / product_per_page); // round upper integer 

    //previous-button
    if (current_page !== 0) {
        let st_pagination_button_prev_clone = st_pagination_button.cloneNode(true);
        st_pagination_button_prev_clone.innerHTML = "Prev";
        st_pagination_button_prev_clone.addEventListener(
                "click", (e) => {
            current_page--;
            searchProduct(current_page * product_per_page);
            e.preventDefault();
        });
        st_pagination_container.appendChild(st_pagination_button_prev_clone);
    }


    // pagination-buttons
    for (let i = 0; i < pages; i++) {
        let st_pagination_button_clone = st_pagination_button.cloneNode(true);
        st_pagination_button_clone.innerHTML = i + 1;
        st_pagination_button_clone.addEventListener(
                "click", (e) => {
            current_page = i;
            searchProduct(i * product_per_page);
            e.preventDefault();
        });

        if (i === Number(current_page)) {
            st_pagination_button_clone.className = "axil-btn btn btn-primary btn-lg fw-bold ml--10";
        } else {
            st_pagination_button_clone.className = "axil-btn btn btn-outline-secondary btn-lg ml--10";
        }
        st_pagination_container.appendChild(st_pagination_button_clone);
    }

    // next-button
    if (current_page !== (pages - 1)) {
        let st_pagination_button_next_clone = st_pagination_button.cloneNode(true);
        st_pagination_button_next_clone.innerHTML = "Next";
        st_pagination_button_next_clone.addEventListener(
                "click", (e) => {
            current_page++;
            searchProduct(current_page * product_per_page);
            e.preventDefault();
        });
        st_pagination_container.appendChild(st_pagination_button_next_clone);
    }
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
function resetSearch() {
    // Clear selected "chosen" classes in each filter list
    const optionIds = [
        "brand-options",
        "condition-options",
        "color-options",
        "gender-options"
    ];

    optionIds.forEach(id => {
        const chosen = document.querySelector(`#${id} .chosen`);
        if (chosen)
            chosen.classList.remove("chosen");
    });

    // Clear price range inputs
    document.getElementById("price-min").value = "";
    document.getElementById("price-max").value = "";

    // Reset sorting dropdown
    const sortDropdown = document.getElementById("st-sort");
    if (sortDropdown)
        sortDropdown.selectedIndex = 0;

    // Trigger product reload
    searchProduct(0);
}
