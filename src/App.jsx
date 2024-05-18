import React, { createContext, useEffect } from "react";
import Header from "./components/header/header";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import SignInSignUp from "./pages/SignInSignUp/SignInSignUp.jsx";
import MainView from "./pages/MainView/MainView.jsx";
import { ConfigProvider } from "antd";
import Cookies from 'universal-cookie';
import './styles/style.scss';
import AuthService from "./services/AuthService.js";
import { API_URL } from "./http/index.js";

export const GlobalContext = createContext();

function App() {
  const serverUrl = API_URL;
  const cookies = new Cookies();
  const devMode = false;
  const navigate = useNavigate();

  const PrivateWrapper = ({ ...rest }) => {
    return (cookies.get('isAuth') || devMode) 
      ? <Outlet /> 
      : <Navigate to="/login" />;
  };

  
  
  async function checkAuth() {
    try {
      const response = await fetch(`${API_URL}/refresh`, {
          method: 'GET',
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json'
          },
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1);

      localStorage.setItem('token', data.accessToken);
      cookies.set('isAuth', true, { path: '/', expires: expirationDate });
      cookies.set('user', JSON.stringify(data.user), { path: '/', expires: expirationDate });
    } catch (e) {
      console.log(e.message);
    }
  }


  useEffect(()=> {
    if (localStorage.getItem('token')) {
      checkAuth();
    }
  }, [])

  const handleLogout = () => {
    AuthService.logout();
    cookies.remove('user', { path: '/' });
    cookies.remove('isAuth', { path: '/' });
    cookies.remove('token', { path: '/' });
    sessionStorage.setItem('current_page_of_nav', 'projects');
    navigate('/login');
  };

  const theme = {
    token: {
      lineWidthFocus: 2,
      colorPrimary: '#1c1404a1',
      borderRadius: 2,
    },
    components: {
      Button: {
        defaultShadow: 'none',
        primaryShadow: 'none',   
      },
      message: {
        top: '10vh',
      }
    }
  };

  return (
    <GlobalContext.Provider value={{serverUrl}}>
      <ConfigProvider
        wave={{disabled: true}}
        theme={theme}>
        <div className="App">
          <Header/>
            <Routes>
              <Route path="/login" element={<SignInSignUp />} />
              <Route element={<PrivateWrapper />}>
                <Route path="/*" element={<MainView key={'mainview'} onLogOut={handleLogout}/>} />
              </Route>
            </Routes>
        </div>
      </ConfigProvider>
    </GlobalContext.Provider>
  );
}

export default App; 
