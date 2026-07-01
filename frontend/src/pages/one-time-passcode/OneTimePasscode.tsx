import { useRef, useState } from 'react';
import './OneTimePasscode.scss';
import API from '../../api/axios';
import { APIResponse, OneTimePasscodeProps } from '../../types/types';
import isEmail from 'validator/lib/isEmail';
import { useNavigate } from 'react-router-dom';


export default function OneTimePasscode({ handleErrorMessage }: OneTimePasscodeProps) {
  const [ email, setEmail ] = useState<string>('');
  const [ isSent, setIsSent ] = useState<boolean>(false);
  const [ message, setMessage ] = useState<string>('');
  const [ isMessage, setIsMessage ] = useState<boolean>(true);
  const digitInputsRefs = useRef<HTMLInputElement[]>([]);
  const [ clipboardValue, setClipboardValue ] = useState<string>('');
  const userId = localStorage.getItem('userId');
  const navigator = useNavigate();

  const sendOTP = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return handleErrorMessage("Please enter your account email");
    
    if (!isEmail(email)) return handleErrorMessage("Please enter a valid email address");
    
    try {
      const otpResponse = await API.post<APIResponse>('/password/sendOTP', {
        email,
      });
      
      setEmail('');
      setMessage(otpResponse.data.message);
      setIsSent(true);
      if (otpResponse.data.userId) localStorage.setItem('userId', otpResponse.data.userId);
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Something went wrong on the server side";
      handleErrorMessage(errorMessage);
    }
  }

  const confirmOTP = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (clipboardValue.length !== 6 || isNaN(Number(clipboardValue))) return handleErrorMessage('Not a valid OTP code');

    try {
      const otpCheck = await API.post<APIResponse>('/password/checkOTP', {
        userId,
        otp: clipboardValue.trim()
      });

      handleErrorMessage(otpCheck.data.message, otpCheck.data.success);
      
      if (otpCheck.data.success) {
        navigator('/passwordReset');
      }
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Something went wrong on the server side";
      handleErrorMessage(errorMessage);
    }
  }
  
  const handleInputNavigation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key.toLowerCase();
    const value = e.currentTarget.value;
    const nextSibling = e.currentTarget.nextElementSibling as HTMLInputElement;

    if ((key !== 'backspace' && key !== 'delete' && key.length === 1) && value && nextSibling) nextSibling.focus();


    let otpValue: string = '';
    digitInputsRefs.current.forEach((input) => {
      otpValue += input.value;
    });
    setClipboardValue(otpValue);
  }

  const handlePasting = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').trim();

    if (isNaN(Number(pasteData))) return handleErrorMessage('Please enter a valid OTP code');
    
    setClipboardValue(pasteData);

    digitInputsRefs.current.forEach((item, inputIndex) => {
      const inputValue = pasteData.split('')[inputIndex]; 

      if (inputValue) {
        item.value = inputValue;

      } else {
        item.value = '';
      }
    });
  }

  const handleBackspace = (e:React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key.toLowerCase();
    const value = e.currentTarget.value;
    const previousSibling = e.currentTarget.previousElementSibling as HTMLInputElement;

    if (key === 'backspace' && previousSibling && !value) previousSibling.focus();
  } 

  return (
    <section className="one-time-passcode-page">
      {
        !isSent &&
        <div className="otp-sender">
          <h2>Forgot your password?</h2>
          <p>
            Don't worry! It happens to the best of us.
            Just enter the email associated with your account 
            to receive a one time passcode to be able to reset your password. 
          </p>
          <form onSubmit={sendOTP}>
            <input 
              type="email" 
              name="passcode-email" 
              id="passcode-email" 
              value={email}
              onChange={e => setEmail(e.currentTarget.value)}
              placeholder="Enter your email" 
              autoFocus
            />
            <button type="submit">Send code</button>
          </form>
        </div>
      }

      {
        isSent &&
        <div className="otp-digits-container">
          <h2>Enter your one-time passcode</h2>
          {
            isMessage && 
            <p className="otp-message">
              {message}
              <svg onClick={() => setIsMessage(false)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <title>Close</title>
                <path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" />
              </svg>
            </p>
          }
          <form onSubmit={confirmOTP}>
            <div>
              {
                Array.from({length: 6}).map((_item, index) => {
                  return ( 
                    <input 
                      key={index} 
                      ref={elem => {
                        if (elem) digitInputsRefs.current[index] = elem;
                      }}
                      onPaste={handlePasting}
                      onKeyUp={handleInputNavigation} 
                      onKeyDown={handleBackspace}
                      type="text" 
                      autoComplete="off"
                      inputMode="numeric" 
                      name="otp-digit" 
                      id={`otp-digit-field-${index}`} 
                      maxLength={1} pattern="\d{1}" 
                    />
                  );
                })
              }
            </div>

            <button type="submit">Confirm</button>
          </form>
        </div>
      }
      
    </section>
  );
}