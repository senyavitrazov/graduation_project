import React, { createContext, useState } from "react";
import Header from "./components/header/header";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import SignInSignUp from "./pages/SignInSignUp/SignInSignUp.jsx";
import MainView from "./pages/MainView/MainView.jsx";
import { ConfigProvider, message } from "antd";
import './styles/style.scss';

export const GlobalContext = createContext();

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const serverUrl = 'http://localhost:5555';
  const devMode = true;

  const PrivateWrapper = ({ ...rest }) => {
    return (isLoggedIn || devMode) 
      ? <Outlet /> 
      : <Navigate to="/login" />;
  };

  const theme = {
    token: {
      lineWidthFocus: 2,
      colorPrimary: '#1c1404a1',
      borderRadius: 2,
    },
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
                <Route path="/*" element={<MainView key={'mainview'} />} />
              </Route>
              {/* <Route path="/" element={<PrivateRoute><MainView/><PrivateRoute/>}/> */}
              {/* <PrivateRoute path="/edit-defect" element={<EditDefect />}/>
              <PrivateRoute path="/view-defect" element={<ViewDefect />}/>
              <PrivateRoute path="/view-project" element={<ViewProject />}/> */}
            </Routes>
        </div>
      </ConfigProvider>
    </GlobalContext.Provider>
  );
}

//?? <Navitage to="/login"> и не прокидывать пропс или оставить потому что все равно нужно будет кидать токен и все такое 


export default App; 
