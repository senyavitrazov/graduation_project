import React, { useState } from 'react';
import classnames from 'classnames';
import { usePagination, DOTS } from './usePagination';
import styles from './Pagination.module.scss';

const Pagination = props => {
  const {
    totalCount,
    siblingCount = 1,
    pageSize,
    className,
    fetchData,
  } = props;

  const [currentPage, setCurrentPage] = useState(1); // Состояние текущей страницы

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    setCurrentPage(currentPage + 1);
    fetchData(currentPage + 1, pageSize);
  };

  const onPrevious = () => {
    setCurrentPage(currentPage - 1);
    fetchData(currentPage - 1, pageSize);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <ul
      className={classnames(styles['pagination-container'], { [className]: className })}
    >
      <li
        className={classnames(styles['pagination-item'], {
          [styles.disabled]: currentPage === 1
        })}
        onClick={onPrevious}
      >
        <div className={classnames(styles.arrow, styles.left)} />
      </li>
      {paginationRange.map(pageNumber => {
        if (pageNumber === DOTS) {
          return <li className={classnames(styles["pagination-item"], styles['dots'])}>&#8230;</li>;
        }

        return (
          <li
            className={classnames(styles['pagination-item'], {
              [styles.selected]: pageNumber === currentPage
            })}
            onClick={() => {
              setCurrentPage(pageNumber);
              fetchData(pageNumber, pageSize);
            }}
          >
            {pageNumber}
          </li>
        );
      })}
      <li
        className={classnames(styles['pagination-item'], {
          [styles.disabled]: currentPage === lastPage
        })}
        onClick={onNext}
      >
        <div className={classnames(styles.arrow, styles.right)}/>
      </li>
    </ul>
  );
};

export default Pagination;
