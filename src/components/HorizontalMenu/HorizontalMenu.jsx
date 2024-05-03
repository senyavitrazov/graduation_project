import React from 'react';
import classNames from 'classnames';
import styles from './HorizontalMenu.module.scss';
import { useNavigate } from 'react-router-dom';

const HorizontalMenu = ({ onClick, selectedKeys, items }) => {
  const navigate = useNavigate();
  const handleClick = (key, event) => {
    event.preventDefault(); 
    navigate(`/${key}`);
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
              <li key={child.key} onClick={(e) => handleClick(child.key, e)}>
                {child.label}
              </li>
            ))}
          </ul>
        </li>
      );
    } else {
      return (
        <li key={item.key} onClick={(e) => handleClick(item.key, e)} 
        className={classNames(styles['menu-item'], selectedKeys.includes(item.key) ? styles['selected'] : '')}>
          {item.label}
        </li>
      );
    }
  };

  return (
    <ul className={styles['menu-root']}>
      {items.map((item) => (
        renderMenuItem(item)
      ))}
    </ul>
  );
};



export default HorizontalMenu;
