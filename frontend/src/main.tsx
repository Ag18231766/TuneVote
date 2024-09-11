import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
const domain = import.meta.env.VITE_AUTH_0_DOMAIN_URL;
const clientId = import.meta.env.VITE_AUTH_0_CLIENT_ID;
const redirectUrl = import.meta.env.VITE_REDIRECT_URI;
const root = createRoot(document.getElementById('root')!);


root.render(

<Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri:redirectUrl,
      audience: 'this is an identifier',
      scope:'openid profile email'
    }}
>
    <App />
</Auth0Provider>,
  
  
);

