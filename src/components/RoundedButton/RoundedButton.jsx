import React from 'react';
import styles from './RoundedButton.module.scss';

const RoundedButton = ({ onClick, children, className, type }) => {
  return (<button type={type} className={`${styles.RoundedButton} ${className}`} onClick={onClick}>
    {children}
  </button>);
};

export default RoundedButton;
