async function verifyAccount() {
    const verificationCode = document.getElementById("verificationCode").value;
    const verification = {
        verificationCode: verificationCode
    };
    const verificationJson = JSON.stringify(verification);
    const response = await fetch("verifyAccount", {
        method: "POST",
        credentials: "include", // 
        body: verificationJson,
        headers: {
            "Content-Type": "application/json"
        }
    });


    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            window.location = "index.html";
        } else {
            if (json.message == "1") {
                window.location = "SigninSignup.html";
            } else {
                document.getElementById("message").innerHTML = json.message;
            }
        }
    } else {
        document.getElementById("message").innerHTML = "verification failed";
    }

}
