import React, { useState } from 'react';
import styles from './sidebar.module.scss';

const items = [
  { title: 'Project 1', id: 1, url: ''},
  { title: 'Project 2', id: 2, url: ''},
  { title: 'Project 3', id: 3, url: ''},
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => { 
    setIsOpen(!isOpen);
  };

  return (<>
    <div className={`${(isOpen ? styles.active : '')} ${styles.burger}`} onClick={toggleSidebar}>
      <div className={styles.burgerLine}></div>
    </div>
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <ul className={styles.listContainer}>
        <li>Home</li>
        {items.map( (e, i) => <li key={i}>{e.title}</li>)}
      </ul>
    </div>
    </>
  );
};

export default Sidebar;
