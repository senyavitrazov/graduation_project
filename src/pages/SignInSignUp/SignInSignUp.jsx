import { useContext, useEffect, useState } from "react";
import { PasswordInfoPopup } from "./PasswordInfoPopup/PasswordInfoPopup";
import { useNavigate } from "react-router-dom";
import RoundedButton from "../../components/RoundedButton/RoundedButton";
import ErrorMessage from "../../components/errorMessage/errorMessage";
import { GlobalContext } from '../../App';
import Cookies from 'universal-cookie';
import './SignInSignUp.scss';


const expirationDate = new Date();
expirationDate.setMonth(expirationDate.getMonth() + 1);


const SignInSingUp = props => {
  const [login, setLogin] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isInputDirty, setIsInputDirty] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isSignUpFieldsValid, setSignUpFieldsValid] = useState(false);
  const [error, setError] = useState(null);
  const { serverUrl } = useContext(GlobalContext);
  const navigate = useNavigate();
  const cookies = new Cookies();

  const isInputValid = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/g.test(inputValue);
  const isConfirmPasswordValid = isSignUpMode
    ? confirmPassword === inputValue
    : true;

  useEffect(() => {
    const userId = cookies.get('userId');
    if (userId) {
      handleLogin();
    }
  }, []);

  useEffect(() =>  {
    isSignUpFieldsValid && setSignUpFieldsValid(false);
    error && setError(null); 
  }, [login, inputValue, confirmPassword, isSignUpMode]);

  const handleLogin = () => {
    props.onLogin();
    navigate('/');
  };
  
  const loginButtonHandler = async () => {
    if (!isSignUpMode) {
      setError(null);
      let profile = await window.contextBridgeApi?.invoke('duplex-profiles-channel', {
        url: serverUrl,
        action: 'search',
        credentials: {
          login,
          password: inputValue,
        },
      });
      if (profile instanceof Error) {
        setError(profile)
      } else {
        console.log(profile);
        cookies.set('userId', profile._id, { path: '/', expires: expirationDate });
        handleLogin();
      }
    } else {
      setIsSignUpMode(!isSignUpMode);
    }
  };

  const signUpButtonHandler = async () => {
    if (isSignUpMode) {
      if (isInputValid && isConfirmPasswordValid && login.length > 8) {
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
        window.contextBridgeApi?.invoke('duplex-profiles-channel', {
          url: serverUrl, 
          action: 'export-profiles-append-array',
          profilesData: [{
            local_id: id,
            credentials: {
              login,
              password: inputValue
            },
          }]
        }).then((response) => {
            console.log(response);
            cookies.set('userId', response[0]._id, { path: '/', expires: expirationDate });
            handleLogin()
          })
          .catch((err) => {
            err && setError('Error: User with such login is already registered');
          });
      } else { 
        setError(null);
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
      <ErrorMessage id='error-invalid-fielf' error={isSignUpFieldsValid}>Invalid fields: please check your inputs</ErrorMessage>
      <ErrorMessage id='error-other-error' error={error}></ErrorMessage>
  </div>
  );
}

export default SignInSingUp;
