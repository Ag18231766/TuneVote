import { useAuth0 } from "@auth0/auth0-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";


const LoginButton = () => {
  const {loginWithPopup,
    loginWithRedirect,
    logout,
    user,
    isAuthenticated
  } = useAuth0();
  

  const navigate = useNavigate();
  async function accesssToken(){
    await axios.post(`http://localhost:3000/api/v1/user/${user?.email}`,{},{
      headers:{
          authorization : 'Bearer ' + token
      }
    })
    navigate(`/dashboard`);
  }
  

  return (
    <div>
      {user?.given_name}
      {user?.email}
      <button onClick={accesssToken}>token</button>
      
      <div>hi there</div>
      <button onClick={() => logout()}>logout</button>
      <img src={user?.picture}></img>
      {isAuthenticated}
    </div>
  );
};

export default LoginButton;