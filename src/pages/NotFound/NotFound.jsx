import styles from './NotFound.module.scss'; 

const NotFound = () => {
  return (
    <div className={styles["page-container"]}>
      <div className={styles["not-found-container"]}>
        <h1>404</h1>
        <p>Page not found</p>
        <a href='/'>Back to the real world</a>
      </div>
    </div>
  );
}

export default NotFound;
