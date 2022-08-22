import { useState } from 'react';
import './App.css';
import { isLoggedIn } from './components/loginFunctions/loginFunctions';
import LoginRoutes from './components/routes/LoginRoutes';
import UserRoutes from './components/routes/UserRoutes';
import LoginProvider from './components/utils/LoginProvider';

function App() {
  const [login, setLogin] = useState(false);

  return (
    <LoginProvider loginState={[login, setLogin]}>
      {isLoggedIn() ? <UserRoutes /> : <LoginRoutes />}
    </LoginProvider>
  );
}

export default App;
