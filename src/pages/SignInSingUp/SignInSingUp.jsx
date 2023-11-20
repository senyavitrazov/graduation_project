import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PasswordInfoPopup } from "./PasswordInfoPopup/PasswordInfoPopup";
import './SignInSingUp.scss';
import RoundedButton from "../../components/RoundedButton/RoundedButton";

const SignInSingUp = props => {
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isInputDirty, setIsInputDirty] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const isInputValid = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/g.test(inputValue);
  const isConfirmPasswordValid = isSignUpMode
    ? confirmPassword === inputValue
    : true;
  
  const loginButtonHandler = () => {
    if (!isSignUpMode) {
      //вход
      //props.onLogin();
      //navigate('/');
      console.log('login:', login, '\n pass:', inputValue);
    } else {
      setIsSignUpMode(!isSignUpMode);
    }
  };

  const signUpButtonHandler = () => {
    if (isSignUpMode) {
      // Регистрация
    } else {
      setIsSignUpMode(!isSignUpMode);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setIsInputDirty(!0);
  };
  
  return (
  <div className="SignInForm">
    <h2 className="SignInForm__header">
      {isSignUpMode ? "Sign Up" : "Sign In"}
    </h2>
    <form className="SignInForm__form">
      <input type="text" 
        onChange={(e) => setLogin(e.target.value)}
        className="form__input" name="login" placeholder="Login"/>
      <div className="SignInForm__passwordContainer">
        <input type="password"
          onChange={handleInputChange}
          onBlur={isSignUpMode ? () => {
            inputValue ? setIsInputDirty(true) : setIsInputDirty(false);
          } : null}
          className={`form__input ${
            isSignUpMode && (isInputDirty ? (isInputValid ? '' : 'wrong') : '')
          }`}
          name="password"
          placeholder={isSignUpMode ? 'Enter new password' : 'Password'}/>
          {isSignUpMode && (<>
            <div className="passwordInfoContainer">
              <span className="SignInForm__passwordComment"
                onMouseEnter={() => {setPopupVisible(true)}}
                onMouseLeave={() => {setPopupVisible(false)}}>
                <span>?</span>
              </span>
              <PasswordInfoPopup style={isPopupVisible ? {display: 'flex'} : {} }/>
            </div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {setConfirmPassword(e.target.value);}}
              className={`form__input ${
                isConfirmPasswordValid ? "" : "wrong"
              }`}
              name="confirmPassword"
              placeholder="Confirm new password"
            />
          </>
        )}
      </div>
      <div className="SignInForm__buttonsContainer">
        <RoundedButton type="button" className={isSignUpMode ? '' : 'SignInForm__activeButton'} onClick={loginButtonHandler}>Sing In</RoundedButton>
        <RoundedButton type="button" className={isSignUpMode ? 'SignInForm__activeButton' : ''} onClick={signUpButtonHandler}>Sign Up</RoundedButton>
      </div>
    </form>
  </div>
  );
}

export default SignInSingUp;
