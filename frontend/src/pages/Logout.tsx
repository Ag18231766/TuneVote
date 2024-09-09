import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const LogoutButton = () => {
  const { logout , isAuthenticated } = useAuth0();

  return (
    <button onClick={() => logout({ logoutParams: { returnTo: 'http://localhost:5173/' } })}>
      Log Out
    </button>
  );
};

export default LogoutButton;