import React from 'react';
import style from './header.module.scss';
import winMax from '../../assets/window_maximize.png';

const Header = () => {
  function sendToMain(message) {
    window.contextBridgeApi?.send('toMain', { action: message });
  };

  return <header className={style.header}>
    <div className={style.title}></div>
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
