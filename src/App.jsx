import React, { createContext, useState } from "react";
import Header from "./components/header/header";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import SignInSignUp from "./pages/SignInSignUp/SignInSignUp.jsx";
import MainView from "./pages/MainView/MainView.jsx";
import { ConfigProvider } from "antd";
import Cookies from 'universal-cookie';
import './styles/style.scss';

export const GlobalContext = createContext();

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const serverUrl = 'http://localhost:5555';
  const cookies = new Cookies();
  const devMode = false;
  const navigate = useNavigate();

  const PrivateWrapper = ({ ...rest }) => {
    return (cookies.get('userId') || isLoggedIn || devMode) 
      ? <Outlet /> 
      : <Navigate to="/login" />;
  };

  const handleLogout = () => {
    cookies.remove('userId');
    cookies.remove('userLogin');
    setLoggedIn(false);
    navigate('/');
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
              <Route path="/login" element={<SignInSignUp onLogin={() => setLoggedIn(true)} />} />
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
