import React from 'react';
import style from './header.module.scss';
import winMax from '../../assets/window_maximize.png';
import logo from '../../assets/svg/logo.svg';

const Header = () => {
  function sendToMain(message) {
    window.contextBridgeApi?.send('trafficlight-channel', { action: message });
  };

  return <header className={style.header}>
    <div className={style.title}><img src={logo} alt='logo'className={style.logo}/>
      <p>Tracking Software Defects System_v2.1</p>
    </div>
    <div className={style.buttons}>
      <div className={style.min} onClick={sendToMain.bind(null, 'minimize')}>&#8722;</div>
      <div className={style.max} onClick={sendToMain.bind(null, 'maximize')}>
        <img src={winMax} alt="window_maximize"/>
      </div>
      <div className={style.close} onClick={sendToMain.bind(null,'close')}>&times;</div>
    </div>
  </header>
};

export default Header;
