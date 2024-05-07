import React, { useState } from "react";
import styles from './CardTitle.module.scss';

const CardTitle = ({ title }) => {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 43;

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const shortenText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <h4 className={styles['project-title']}>
      {expanded ? title : shortenText(title, maxLength)}
      {title.length > maxLength && (
        <span className={styles['project-title-span']} onClick={toggleExpand}>
          {expanded ? ' [Collapse]' : ' [Expand]'}
        </span>
      )}
    </h4>
  );
};

export default CardTitle;
