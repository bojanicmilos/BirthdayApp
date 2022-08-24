import { useState } from 'react';
import './App.css';
import 'react-notifications/lib/notifications.css';
import { isLoggedIn } from './components/loginFunctions/loginFunctions';
import LoginRoutes from './components/routes/LoginRoutes';
import UserRoutes from './components/routes/UserRoutes';
import LoginProvider from './components/utils/LoginProvider';
import { NotificationContainer } from 'react-notifications';
function App() {
  const [login, setLogin] = useState(false);

  return (
    <LoginProvider loginState={[login, setLogin]}>
      {isLoggedIn() ? <UserRoutes /> : <LoginRoutes />}
      <NotificationContainer />
    </LoginProvider>
  );
}

export default App;
