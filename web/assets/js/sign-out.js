//elegenace js
async function signOut() {
    const response = await fetch("SignOut");
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            window.location = "SigninSignup.html";
        } else {
            window.location.reload();
        }
    } else {
        console.log("Logout Failed");
    }
}

