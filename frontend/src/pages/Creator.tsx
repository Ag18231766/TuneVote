import { useAuth0 } from "@auth0/auth0-react";

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


export default function Creator() {
    const {getAccessTokenSilently,user,isAuthenticated,loginWithPopup} = useAuth0();
    const {creatorId} = useParams<string>();
    const navigate = useNavigate();
    const toLanding = useCallback(function toLanding(){
        navigate('/');
    },[navigate]);
    useEffect(() => {
        if(!isAuthenticated){
            loginWithPopup().then(() => {
                console.log(isAuthenticated);
                getAccessTokenSilently().then((token) => {
                    localStorage.setItem('token',token);
                    
                })
                
            });
        }else{
            getAccessTokenSilently().then((token) => {
                localStorage.setItem('token',token);
                navigate(`/creatorLogedin/${creatorId}`);
            })
        }
        
    },[isAuthenticated,toLanding,getAccessTokenSilently,loginWithPopup,user,navigate,creatorId]);

    return (
        <div>
            Spinner
        </div>
    )
}