import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PasswordInfoPopup } from "./PasswordInfoPopup/PasswordInfoPopup";
import RoundedButton from "../../components/RoundedButton/RoundedButton";
import './SignInSingUp.scss';


const SignInSingUp = props => {
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isInputDirty, setIsInputDirty] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isSignUpFieldsValid, setSignUpFieldsValid] = useState(false);

  const isInputValid = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/g.test(inputValue);
  const isConfirmPasswordValid = isSignUpMode
    ? confirmPassword === inputValue
    : true;

  useEffect(() =>  {
    isSignUpFieldsValid && setSignUpFieldsValid(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [login, inputValue, confirmPassword, isSignUpMode]);
  
  const loginButtonHandler = async () => {
    if (!isSignUpMode) {
      //WARNING! нельзя прокидывать весь obj, нужно в handler выбирать и отдавать
      let profiles = await window.contextBridgeApi?.invoke('duplex-profiles-channel');
      console.log(profiles);
    } else {
      setIsSignUpMode(!isSignUpMode);
    }
  };

  const signUpButtonHandler = () => {
    if (isSignUpMode) {
      if (isInputValid && isConfirmPasswordValid && login.length > 8) {
        window.contextBridgeApi?.send('export-profiles-channel', { 
          action: 'export-profiles-append-array',
          profilesData: [{[login]: inputValue}]
        });
        props.onLogin();
        navigate('/');
      } else { 
        setSignUpFieldsValid(p => !p);
      }
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
        className={`form__input ${(login.length > 8 || !isSignUpMode) || (isSignUpMode  && login.length < 1) ? '' : 'wrong'}`} name="login"
        placeholder={isSignUpMode ? 'Login (at least 8 characters)' : 'Login'}/>
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
       <div id="errorMessage" style={isSignUpFieldsValid ? {display: 'block'} : {}}>Invalid fields: please check your inputs</div>
  </div>
  );
}

export default SignInSingUp;
