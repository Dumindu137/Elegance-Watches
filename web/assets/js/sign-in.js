async function signIn(event) {
    event.preventDefault();
    const email = document.getElementById("SignEmail").value;
    const password = document.getElementById("SignPassword").value;

    const signIn = {
        email: email,
        password: password
    }

    const signInJson = JSON.stringify(signIn);

    const response = await fetch("Signin", {
        method: "POST",
        body: signInJson,
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (response.ok) {

        const json = await response.json();
        console.log("DEBUG RESPONSE:", json);  // 👈 ADD THIS LINE
        if (json.status) {
            if (json.message == "1") {
                window.location = "verify-account.html";
            } else {
                window.location = "index.html";
            }
        } else {
            document.getElementById("message").innerHTML = json.message;
        }
    } else {
        document.getElementById("message").innerHTML = "Sign in failed";
    }
}
async function authenticateUser() {
    const response = await fetch("SignIn");

    if (response.ok) {
        const json = await response.json();
        if (json.message == "1") {
            window.location = "index.html";
        } else {
            window.location = "SigninSignup.html";
        }
    } else {
    }
}