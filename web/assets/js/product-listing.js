var modelList;
async function loadProductData() {
    console.log("ok");

    const response = await fetch("loadProductData");


    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            loadSelect("brand", json.brandList, "name");
            loadSelect("gender", json.genderList, "value");
            modelList = json.modelList;
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
    const genderId = document.getElementById("gender").value;
    const modelSelect = document.getElementById("model");
    modelSelect.length = 1;

    modelList.forEach(item => {
        if (item.brand.id == brandId && item.gender?.id == genderId) {
            const option = document.createElement("option");
            option.value = item.id;
            option.innerHTML = item.name;
            modelSelect.appendChild(option);
        }

    });
}
async function saveProduct() {
    document.getElementById("message").innerHTML = "";

    const brandId = document.getElementById("brand").value;
    const modelId = document.getElementById("model").value;
    const genderId = document.getElementById("gender").value;
    const title = document.getElementById("title").value;
    const madeYear = document.getElementById("made-year").value;
    const description = document.getElementById("description").value;
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
    form.append("madeYear", madeYear);
    form.append("description", description);
    form.append("colorId", colorId);
    form.append("conditionId", conditionId);
    form.append("price", price);
    form.append("qty", qty);
    form.append("image1", image1);
    form.append("image2", image2);
    form.append("image3", image3);

    console.log("Sending title:", title);
    const response = await fetch(
            "SaveProduct",
            {
                method: "POST",
                body: form

            }
    );
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            const message = document.getElementById("message");
            message.innerHTML = "New Product added successfully";
            message.style.color = "green";

            // wipeCSS-based colors
            message.classList.remove("error", "text-danger");
            message.classList.add("text-success");

            document.getElementById("brand").value = 0;
            document.getElementById("model").value = 0;
            document.getElementById("gender").value = 0;
            document.getElementById("title").value = "";
            document.getElementById("made-year").value = "";
            document.getElementById("description").value = "";
            document.getElementById("color").value = 0;
            document.getElementById("condition").value = 0;
            document.getElementById("price").value = "0.00";
            document.getElementById("qty").value = 1;
            document.getElementById("img1").value = "";
            document.getElementById("img2").value = "";
            document.getElementById("img3").value = "";
        } else {
            if (json.message === "Please login") {
                window.location = "SigninSignup.html";
            } else {
                document.getElementById("message").innerHTML = json.message;
                document.getElementById("message").style.color = "red";

            }
        }
    } else {
        const message = document.getElementById("message");
        message.innerHTML = json.message;
        message.style.color = "red";
        message.classList.remove("text-success");
        message.classList.add("text-danger");
    }


}

function updateImageLabel(inputId, textId) {
    const input = document.getElementById(inputId);
    const textSpan = document.getElementById(textId);
    if (input.files && input.files[0]) {
        textSpan.textContent = input.files[0].name;
    } else {
        // Reset to original text if no file is selected (e.g., user cancels file dialog)
        textSpan.textContent = `Upload Image ${inputId.replace('img', '')}`;
    }
}
function triggerImageUpload(inputId) {
//    const fileInput = document.getElementById(inputId);
//    fileInput.click();
//
//    fileInput.onchange = function (event) {
//        const file = event.target.files[0];
//        if (file && file.type.startsWith('image/')) {
//            const reader = new FileReader();
//
//            reader.onload = function (e) {
//                const imgElement = document.getElementById('profile-image');
//                imgElement.src = e.target.result;
//            }
//
//            reader.readAsDataURL(file);
//        }
//    }
    document.getElementById(inputId).click();
}
