import React from 'react';
import classNames from 'classnames';
import styles from './HorizontalMenu.module.scss';

const HorizontalMenu = ({ onClick, selectedKeys, items }) => {
  const handleClick = (key) => {
    onClick({ key });
  };

  const renderMenuItem = (item) => {
    if (item.children) {
      return (
        <li key={item.key}>
          <span>{item.label}</span>
          <ul>
            {item.children.map((child) => (
              <li key={child.key} onClick={() => handleClick(child.key)}>
                {child.label}
              </li>
            ))}
          </ul>
        </li>
      );
    } else {
      return (
        <li key={item.key} onClick={() => handleClick(item.key)} 
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
