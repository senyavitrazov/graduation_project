import React from "react";
import Sidebar from "./components/sidebar/sidebar";
import Header from "./components/header/header";
import './styles/style.scss';

function App() {
  
  return (
    <div className="App">
      <Header></Header>
      <Sidebar />
      <main className="content">
      </main>
    </div>);  
}

export default App; 
