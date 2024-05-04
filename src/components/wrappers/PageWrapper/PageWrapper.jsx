import React from 'react';
import styles from './PageWrapper.module.scss';
import classNames from 'classnames';

const PageWrapper = ({className, children}) => {
  return (<div className={classNames(className, styles.wrapper)}>
    {children}
  </div>);
};

export default PageWrapper;
