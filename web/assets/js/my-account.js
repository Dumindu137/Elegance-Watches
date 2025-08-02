function loadData() {
    getUserData();
    getCityData();
}
//const userId = json.userId; // global
//window.userId = userId;

async function getUserData() {
    const response = await fetch("MyAccount");

    if (response.ok) {
        const json = await response.json();

        document.getElementById("username").value = `${json.firstName} ${json.lastName}`;
        document.getElementById("since").value = ` ${json.since}`;
        document.getElementById("firstName").value = json.firstName;
        document.getElementById("lastName").value = json.lastName;
        document.getElementById("email").value = json.email;

        document.getElementById("profile-image").src = `profile-images/${json.userId}/profile.png?${Date.now()}`;
        window.userId = json.userId;


        if (json.addressList?.length > 0) {
            const address = json.addressList[0];
            const password = address.user?.password ?? '';
            const input = document.getElementById("currentPassword");
            if (input)
                input.value = password;
        }

        if (json.hasOwnProperty("addressList") && json.addressList !== undefined) {
            let email;
            let lineOne;
            let lineTwo;
            let city;
            let postalCode;
            let cityId;
            const addressUL = document.getElementById("addressUL");

            addressUL.innerHTML = ''; // remove old list items

            json.addressList.forEach(address => {
                const lineOne = address.line1;
                const lineTwo = address.line2;
                const city = address.city.name;
                const postalCode = address.postal_code;
                const cityId = address.city.id;

                //Update the form inputs
                document.getElementById("lineOne").value = lineOne;
                document.getElementById("lineTwo").value = lineTwo;
                document.getElementById("postalCode").value = postalCode;
                document.getElementById("citySelect").value = cityId;


//                const nameItem = document.createElement("li");
//                nameItem.textContent = `Name: ${json.firstName} ${json.lastName}`;
//
//                const emailItem = document.createElement("li");
//                emailItem.textContent = `Email: ${address.user.email}`;
//
//                const phoneItem = document.createElement("li");
//                phoneItem.textContent = `Phone: 011-2215453`;

                const addrItem = document.createElement("li");
                addrItem.classList.add("mt--30");
                addrItem.innerHTML = `${lineOne},<br/>${lineTwo},<br/>${city}<br/>${postalCode}`;

//                addressUL.appendChild(nameItem);
//                addressUL.appendChild(emailItem);
//                addressUL.appendChild(phoneItem);
                addressUL.appendChild(addrItem);
            });

            document.getElementById("addName").innerHTML = `Name: ${json.firstName} ${json.lastName}`;
            document.getElementById("addEmail").innerHTML = `Email: ${email}`;
            document.getElementById("contact").innerHTML = `Phone: 011-2215453`;
            document.getElementById("currentPassword").value = json.password;


//            document.getElementById("lineOne").value = lineOne;
//            document.getElementById("lineTwo").value = lineTwo;
//            document.getElementById("postalCode").value = postalCode;
//            document.getElementById("citySelect").value = parseInt(cityId);
        }
    }

}

async function getCityData() {

    const response = await fetch("CityData");
    if (response.ok) {
        const json = await response.json();
        const citySelect = document.getElementById("citySelect");
        json.forEach(city => {
            let option = document.createElement("option");
            option.innerHTML = city.name;
            option.value = city.id;
            citySelect.appendChild(option);
        });

    }
}

async function saveChanges() {

    console.log("saveChanges function called!");
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const lineOne = document.getElementById("lineOne").value;
    const lineTwo = document.getElementById("lineTwo").value;
    const postalCode = document.getElementById("postalCode").value;
    const cityId = document.getElementById("citySelect").value;
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const saveBtn = document.getElementById("saveChangesBtn");
    const messageDiv = document.getElementById("saveMessage");


    // Show loading message & disable button
    saveBtn.disabled = true;
    messageDiv.style.color = "black";
    messageDiv.textContent = "Saving changes...";

    const userDataObject = {
        firstName,
        lastName,
        lineOne,
        lineTwo,
        postalCode,
        cityId,
        currentPassword,
        newPassword,
        confirmPassword
    };

    try {
        console.log("newPassword:", newPassword);
        console.log("confirmPassword:", confirmPassword);
        console.log("userDataObject:", userDataObject);

        const response = await fetch("MyAccount", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userDataObject)
        });

        const json = await response.json();
        console.log("Server response:", json);

        if (json.status) {
            messageDiv.style.color = "green";
            messageDiv.textContent = "Profile data updated successfully!";
            getUserData();
        } else {
            messageDiv.style.color = "red";
            messageDiv.textContent = json.message || "Failed to update profile.";
        }
    } catch (error) {
        console.error("Save failed:", error);
        messageDiv.style.color = "red";
        messageDiv.textContent = "Profile update failed!";
    } finally {
        //hide message after 3 seconds
        saveBtn.disabled = false;
        setTimeout(() => {
            messageDiv.textContent = "";
        }, 3000);
    }
}

async function uploadProfileImage() {
    const fileInput = document.getElementById("imageUpload");
    const file = fileInput.files[0];
    if (!file)
        return;

    // Preview the selected image immediately
    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById("profile-image").src = e.target.result;
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("image5", file);

    try {
        const response = await fetch("MyAccount", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (result.status) {
            const img = document.getElementById("profile-image");
            img.src = '';
            setTimeout(() => {
                img.src = `profile-images/${window.userId}/profile.png?` + new Date().getTime();
            }, 50);

            showMessage("Profile image uploaded successfully!", "success");
        } else {
            showMessage(result.message || "Upload failed.", "error");
        }
    } catch (err) {
        console.error("Upload error:", err);
        showMessage("Upload failed.", "error");
    }
}


function showMessage(text, type) {
    const msgDiv = document.getElementById("uploadMessage");
    msgDiv.textContent = text;
    if (type === "success") {
        msgDiv.style.color = "green";
    } else if (type === "error") {
        msgDiv.style.color = "red";
    } else {
        msgDiv.style.color = "black";
    }

    // Optional: hide message after 3 seconds
    setTimeout(() => {
        msgDiv.textContent = "";
    }, 3000);
}
