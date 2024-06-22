import React from "react";
import Layout from "../components/layout/Layout";
import LoginPage from "../components/login/LoginPage";
import AuthContext from "../context/AuthContext";

export default function PrivateRoute(){

    const { user } = React.useContext(AuthContext);

    const authenticated = user != null;

    return(
        authenticated ? <Layout/> : <LoginPage />
    )
}