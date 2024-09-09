import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StreamView from "./StreamView";
import axios from "axios";

export function CreatorAfterLogin(){
    const {user,logout} = useAuth0();
    const [IsAuthorized,SetisAuthorized] = useState<boolean>(false);
    const {creatorId} = useParams<string>();
    useEffect(() => {
        console.log(user);
        axios.post<{message:string}>(`http://localhost:3000/api/v1/user/${user?.email}`,{},{
            headers:{
                authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(() => {
            SetisAuthorized(() => true);
        })
        
    },[user]);
  

    if(!user && localStorage.getItem('token')){
        
        return (<div>
            no user
        </div>)
    }
    
    function handleLogout(){
        logout();
    }
   
    
    return (
        <div>
            <button onClick={handleLogout}>logout</button>
            Dashboard
            
            {user?.sub}
            {IsAuthorized ? <StreamView creatorId={creatorId ?? ""} playVideo={true} token={localStorage.getItem('token') ?? " "} userId={user?.sub?.split('|')[1] as string}  ></StreamView> : null}
        </div>
    )
}