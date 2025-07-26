var modelList;
async function loadProductData() {
    console.log("ok");

    const response = await fetch("loadProductData");


    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            loadSelect("brand", json.brandList, "name");
            modelList = json.modelList;
            loadSelect("gender", json.genderList, "gender");
            loadSelect("color", json.colorList, "value");
            loadSelect("condition", json.qualityList, "value");

        } else {
            document.getElementById("message").innerHTML = "unable to load data! try again later";
        }
    } else {
        document.getElementById("message").innerHTML = "unable to load data! try again later";
    }
}

function loadSelect(selectId, list, property) {
    const select = document.getElementById(selectId);


    list.forEach(item => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = item[property];
        select.appendChild(option);
    });
}


function loadModels() {
    const brandId = document.getElementById("brand").value;
    const modelSelect = document.getElementById("model");
    modelSelect.length = 1;

    modelList.forEach(item => {
        if (item.brand.id == brandId) {
            const option = document.createElement("option");
            option.value = item.id;
            option.innerHTML = item.name;
            modelSelect.appendChild(option);
        }

    });
}
async function saveProduct() {
    const brandId = document.getElementById("brand").value;
    const modelId = document.getElementById("model").value;
    const genderId = document.getElementById("gender").value;
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const madeYearId = document.getElementById("made-year").value;
    const colorId = document.getElementById("color").value;
    const conditionId = document.getElementById("condition").value;
    const price = document.getElementById("price").value;
    const qty = document.getElementById("qty").value;

    const image1 = document.getElementById("img1").files[0];
    const image2 = document.getElementById("img2").files[0];
    const image3 = document.getElementById("img3").files[0];

    const form = new FormData();
    form.append("brandId", brandId);
    form.append("modelId", modelId);
    form.append("genderId", genderId);
    form.append("title", title);
    form.append("description", description);
    form.append("madeYearId", madeYearId);
    form.append("colorId", colorId);
    form.append("conditionId", conditionId);
    form.append("price", price);
    form.append("qty", qty);
    form.append("image1", image1);
    form.append("image2", image2);
    form.append("image3", image3);

    const response = await fetch(
            "SaveProduct",
            {
                method: "POST",
                body: form
            }
    );
}