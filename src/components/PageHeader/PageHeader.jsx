import React from 'react';
import styles from './PageHeader.module.scss';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const PageHeader = ({children, className, subtitle, backButton}) => {
  const navigate = useNavigate();
  return (<div className={`${styles.container}${className ? ' ' + className : ''}`}>
    {backButton ? <ArrowLeftOutlined style={{fontSize: 18, marginRight: 16, paddingTop: 4}} onClick={() => {navigate(-1)}}/> : ''}
    <h3>{children}</h3>
    {subtitle ? <h4>{subtitle}</h4> : ''}
  </div>);
};

export default PageHeader;
