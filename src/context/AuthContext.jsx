import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api from "../services/api";


const AuthContext = createContext();


export function AuthProvider({ children }) {

    // Cargamos usuario desde localStorage inicialmente
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const loadUser = async () => {

            const token =
                localStorage.getItem("token");


            if (!token) {
                setLoading(false);
                return;
            }


            try {
                // Actualizamos datos del usuario desde la API para tener la info fresca
                const response = await api.get("/user");
                setUser(response.data);
                localStorage.setItem("user", JSON.stringify(response.data));
            } catch (error) {
                console.error(error);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
            }


            setLoading(false);

        };


        loadUser();


    }, []);



    return (

        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}



export function useAuth(){

    return useContext(AuthContext);

}