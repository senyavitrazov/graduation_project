import React from 'react';
import style from './errorMessage.module.scss';

const ErrorMessage = ({error, children}) => {
  let message = children;
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else {
    message = 'Error: Unknown error';
  }
  return <div id={style.errorMessage} style={error ? {display: 'block'} : {}}>{message}</div>;
};

export default ErrorMessage;
