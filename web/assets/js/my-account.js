function loadData() {
    getUserData();
    getCityData();
}

async function getUserData() {
    const response = await fetch("MyAccount");

    if (response.ok) {
        const json = await response.json();

        document.getElementById("username").value = `${json.firstName} ${json.lastName}`;
        document.getElementById("since").innerHTML = ` ${json.since}`;
        document.getElementById("firstName").value = json.firstName;
        document.getElementById("lastName").value = json.lastName;
        document.getElementById("email").value = json.email;

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
    //newcode
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const lineOne = document.getElementById("lineOne").value;
    const lineTwo = document.getElementById("lineTwo").value;
    const postalCode = document.getElementById("postalCode").value;
    const cityId = document.getElementById("citySelect").value;
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
//const currentPassword = "";
//const newPassword = "";
//const confirmPassword = "";

//*********** html eke password feilds tikakk dala me profile finish krnna
//product adding ek krnna,email not  sending blnn,signout blnn,navbar ekk danna ************

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
            getUserData();
        } else {
            document.getElementById("message").innerHTML = json.message;
        }
    } catch (error) {
        console.error("Save failed:", error);
        const messageDiv = document.getElementById("message");
        if (messageDiv) {
            messageDiv.innerHTML = "Profile details update failed!";
        }
    }
}
