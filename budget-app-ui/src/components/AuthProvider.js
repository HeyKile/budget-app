import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem("sessionToken");
        if (token) {
            setCurrentUser({ token });
        }
    }, []);

    const login = (username, password) => {
        return loginUser(username, password).then(success => {
            if (success) {
                const token = localStorage.getItem("sessionToken");
                setCurrentUser({ token });
            }
        });
    };

    const logout = () => {
        localStorage.removeItem("sessionToken");
        setCurrentUser(null)
    }

    const value = { currentUser, login, logout}

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}