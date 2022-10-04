const ROOT_URL = "http://localhost:8080/api/auth";

export async function loginUser(dispatch, loginPayload) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginPayload),
    };

    try {
        dispatch({ type: "REQUEST_LOGIN" });
        let response = await fetch(`${ROOT_URL}/login`, requestOptions);
        let user = await response.json();

        if (user) {
            dispatch({ type: "LOGIN_SUCCESS", payload: user });
            localStorage.setItem("currentUser", JSON.stringify(user));
            return user;
        }

        dispatch({ type: "LOGIN_ERROR", error: user.errors[0] });
        return;
    } catch (error) {
        dispatch({ type: "LOGIN_ERROR", error: error });
    }
}

export async function logout(dispatch) {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
}

export async function importAuth(dispatch, payload) {
    dispatch({ type: "IMPORT_AUTH", payload });
}
