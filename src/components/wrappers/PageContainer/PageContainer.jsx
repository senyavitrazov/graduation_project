import React from 'react';
import styles from './PageContainer.module.scss';
import classNames from 'classnames';

const PageContainer = ({className, children}) => {
  return (<div className={classNames(className, styles.container)}>
    {children}
  </div>);
};

export default PageContainer;
