import React, { createContext, useState } from "react";
import Header from "./components/header/header";
import './styles/style.scss';
import { Route, Routes, useNavigate} from "react-router-dom";
import SignInSingUp from "./pages/SignInSingUp/SignInSingUp.jsx";
import MainView from "./pages/MainView/MainView.jsx";

export const GlobalContext = createContext();

function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const serverUrl = 'http://localhost:5555';

  return (
    <GlobalContext.Provider value={{serverUrl}}>
      <div className="App">
        <Header></Header>
          <Routes>
            <Route path="/" element={!isLoggedIn ? <MainView /> : <SignInSingUp onLogin={() => setLoggedIn(true)} />}/>
            <Route path="/login" element={<SignInSingUp onLogin={() => {
              setLoggedIn(true)
              navigate('/');
            }}/>}/>
          </Routes>
      </div>
    </GlobalContext.Provider>);
}

//?? <Navitage to="/login"> и не прокидывать пропс или оставить потому что все равно нужно будет кидать токен и все такое 


export default App; 
