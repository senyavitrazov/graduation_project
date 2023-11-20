import './PasswordInfoPopus.scss'

export const PasswordInfoPopup = ({style}) => {
  return (
    <div id="passwordInfoPopup" style={style}>
      <ul>
        <li>At least one uppercase letter (A-Z)</li>
        <li>At least one lowercase letter (a-z)</li>
        <li>At least one digit (0-9)</li>
        <li>At least eight characters long</li>
      </ul>
    </div>
  );
};
