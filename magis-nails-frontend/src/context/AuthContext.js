import { createContext, useState, useEffect, useRef } from "react";
import { jwtDecode } from 'jwt-decode';

import { useNavigate } from "react-router-dom";

import { apiUrl } from "../util/apiUrl";

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({ children }) => {

    const prevAuthTokens = () => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null;
    const prevUser = () => localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null;

    const [authTokens, setAuthTokens] = useState(() => prevAuthTokens())
    const [user, setuser] = useState(() => prevUser())
    const [userData, setUserData] = useState(() => prevUser())
    const [loading, setLoading] = useState(true)

    const tokenRefreshed = useRef(false);


    const navigate = useNavigate();


    const loginUser = async (e) => {
        e.preventDefault();
        const response = await fetch(`${apiUrl}/api/token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'email': e.target.email.value,
                'password': e.target.password.value
            })
        }).catch(error => {
            alert("Error al conectar con el servidor.")
        })

        const data = await response.json();

        if (response.status === 200) {

            // Get user id with the email
            const userResponse = await fetch(`${apiUrl}/users/email/?email=${e.target.email.value}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).catch(error => {
                alert("Error al conectar con el servidor.")
            })

            const userData = await userResponse.json();

            if (userResponse.status === 200) {
                if (!userData.isActive){
                    alert("El usuario se encuentra inactivo, porfavor contacte al administrador de la página.");
                    return;
                }else if(userData.isLocked){
                    alert("El usuario se encuentra bloqueado, porfavor contacte al administrador de la página.");
                    return;
                }
                setUserData(userData);
                
            } else {
                alert("Error al conectar con el servidor.")
            }

            setAuthTokens(data);
            setuser(jwtDecode(data.access));
            localStorage.setItem('authTokens', JSON.stringify(data));

            navigate('/');

        } else if (response.status === 401) {
            alert("Credenciales incorrectas, intentelo de nuevo...");
            navigate('login');
        } else if (response.status === 403) {
            alert("El usuario ha sido bloqueado.");
            navigate('login');
        } else {
            alert("El usuario no se encuentra registrado.");
            navigate('login');
        }
        setLoading(false)
    }

    const logoutUser = () => {
        setAuthTokens(null);
        setuser(null);
        setUserData(null);
        localStorage.removeItem('authTokens');
        navigate('login');
    }

    const updateToken = async () => {

        // console.log("Loading", loading)
        const response = await fetch(`${apiUrl}/api/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'refresh': authTokens?.refresh,
            })
        }).catch(error => {
            alert("Error al conectar con el servidor.")
        })

        const data = await response.json();

        if (response.status === 200) {
            setAuthTokens(data);
            setuser(jwtDecode(data.access));
            localStorage.setItem('authTokens', JSON.stringify(data));

            // Get user id with the email
            const userResponse = await fetch(`${apiUrl}/user/${userData.user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).catch(error => {
                alert("Error al conectar con el servidor.")
            })

            const newUserData = await userResponse.json();

            if (userResponse.status === 200) {
                setUserData(newUserData);
            } else {
                alert("Error al conectar con el servidor.")
            }
        } else {
            logoutUser();
        }

        setLoading(false)
    }

    useEffect(() => {

        if (tokenRefreshed.current) return;
        tokenRefreshed.current = true

        // console.log(loading)
        if (loading) {
            updateToken();
        }

        const minutes = 1000 * 60 * 14
        const interval = setInterval(() => {
            if (authTokens) {
                updateToken();
            }
        }, minutes);

        return () => clearInterval(interval);
    }, [authTokens, loading])

    const contextData = {
        user: user,
        userData: userData,
        authTokens: authTokens,
        setUserData: setUserData,
        loginUser: loginUser,
        logoutUser: logoutUser,
    }

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}
