// Function to check if the user is logged in (example)
async function checkAuthenticationStatus(cookies) {
    console.log("cookies", cookies);
    return false;
}

function loggedIn(key) {
    const isLoggedIn = localStorage.getItem(key);
    console.log(isLoggedIn);
    return isLoggedIn;
}

export {
    checkAuthenticationStatus,
    loggedIn,
}