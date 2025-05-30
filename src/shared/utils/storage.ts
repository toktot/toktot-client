import {User} from "../../features/auth/types/auth";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export const setEncryptedToken = (token : string) => {
    const encoded = btoa(token);
    localStorage.setItem(TOKEN_KEY, encoded);
};

export const getDecryptedToken = () : string | null => {
    const encoded = localStorage.getItem(TOKEN_KEY);
    return encoded ? atob(encoded) : null;
};

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
}

export const setUser = (user : User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}
export const getUser = () : User | null => {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
}
export const removeUser = () => {
    localStorage.removeItem(USER_KEY);
}