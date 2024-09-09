import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

const root = createRoot(document.getElementById('root')!);


root.render(

<Auth0Provider
    domain="dev-deslwdyelw63ku4q.us.auth0.com"
    clientId="HorCByRzeHJ6csLsCnnUUffqCVZT7w89"
    authorizationParams={{
      redirect_uri: 'http://localhost:5173/dashboard',
      audience: 'this is an identifier',
      scope:'openid profile email'
    }}
>
    <App />
</Auth0Provider>,
  
  
);

