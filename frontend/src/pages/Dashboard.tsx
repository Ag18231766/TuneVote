import { useAuth0 } from "@auth0/auth0-react"
import axios from "axios";
import { useEffect, useState } from "react";
import StreamView from "./StreamView";
const apiUrl = import.meta.env.VITE_BACKEND_URL;


export default function Dashboard(){
    const {user,logout} = useAuth0();
    const [isAuthorized,SetisAuthorized] = useState<boolean>(false); 
   
    useEffect(() => {
        console.log(user);
        axios.post<{message:string}>(`${apiUrl}/api/v1/user/${user?.email}`,{},{
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
            <div className="flex items-center justify-between h-12 bg-gray-700 text-white">
                <div className="ml-5">TuneVote</div>
                <div className="mr-5 cursor-pointer" onClick={handleLogout}>Logout</div>
            </div>
            {isAuthorized ? <StreamView userId={user?.sub?.split('|')[1] ?? ''} creatorId={user?.sub?.split('|')[1] ?? ''}  token={localStorage.getItem('token') ?? " "}  ></StreamView> : null}
        </div>
    )
}