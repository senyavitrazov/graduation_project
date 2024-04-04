import React from 'react';
import styles from './PageHeader.module.scss';

const PageHeader = ({children, className, subtitle}) => {
  return (<div className={`${styles.container}${className ? ' ' + className : ''}`}>
    <h3>{children}</h3>
    {subtitle ? <h4>{subtitle}</h4> : ''}
  </div>);
};

export default PageHeader;
