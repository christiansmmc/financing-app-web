import Cookie from "js-cookie";

export const getToken = () => {
    return Cookie.get("access_token");
};

export const setToken = (token: string) => {
    Cookie.set("access_token", token);
};

export const isAuthenticated = () => {
    return Cookie.get("access_token");
};

export const removeToken = () => {
    if (isAuthenticated()) {
        Cookie.remove("access_token");
    }
};
