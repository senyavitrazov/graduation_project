import React from 'react';
import classNames from 'classnames';
import styles from './HorizontalMenu.module.scss';
import { useNavigate } from 'react-router-dom';
import { LogoutOutlined } from '@ant-design/icons';

const HorizontalMenu = ({ onClick, selectedKeys, onLogOut, items }) => {
  const navigate = useNavigate();

  const handleClick = (key, url, event) => {
    sessionStorage.setItem('current_page_of_nav', key)
    event.preventDefault(); 
    navigate(`/${url}`);
    onClick({ key });
  };

  const renderMenuItem = (item) => {
    // submenu
    if (item.children) {
      return (
        <li key={item.key}>
          <span>{item.label}</span>
          <ul>
            {item.children.map((child) => (
              <li key={child.key} onClick={(e) => handleClick(child.key, child.url, e)}>
                {child.label}
              </li>
            ))}
          </ul>
        </li>
      );
    } else {
      return (
        <li key={item.key} onClick={(e) => handleClick(item.key, item.url, e)} 
        className={classNames(styles['menu-item'], selectedKeys.includes(item.key) ? styles['selected'] : '')}>
          {item.label}
        </li> 
      );
    }
  };

  return (
    <div className={styles['navigation']}>
      <ul className={styles['menu-root']}>
        {items.map((item) => (
          renderMenuItem(item)
        ))}
      </ul>
      <div className={styles['logout']}><LogoutOutlined onClick={onLogOut} style={{fontSize: 20}}/></div>
    </div>
  );
};



export default HorizontalMenu;
