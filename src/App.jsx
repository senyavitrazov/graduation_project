import React, { useState } from "react";
import Header from "./components/header/header";
import './styles/style.scss';
import { Route, Routes, useNavigate} from "react-router-dom";
import SignInSingUp from "./pages/SignInSingUp/SignInSingUp.jsx";
import Home from "./pages/home";

function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setLoggedIn] = useState(false);

  return (
    <div className="App">
      <Header></Header>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Home /> : <SignInSingUp onLogin={() => setLoggedIn(true)} />}/>
          <Route path="/login" element={<SignInSingUp onLogin={() => {
            setLoggedIn(true)
            navigate('/');
          }}/>}/>
        </Routes>
    </div>);  
}

//?? <Navitage to="/login"> и не прокидывать пропс или оставить потому что все равно нужно будет кидать токен и все такое 


export default App; 
