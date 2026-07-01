import { Link, useNavigate } from 'react-router-dom';
import './Authentication.scss';
import API from '../../api/axios';
import { useState } from 'react';
import { AuthenticationProps, AuthenticationRes } from '../../types/types';
import isEmail from 'validator/es/lib/isEmail';
import { jwtDecode } from 'jwt-decode';


export default function Authentication({
  handleErrorMessage,
  layout
}: AuthenticationProps) {
  const [ username, setUsername ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');
  const [ email, setEmail ] = useState<string>('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      if (!username || !password || !email) return handleErrorMessage('All fields are required.');

      if (!isEmail(email)) return handleErrorMessage('Not a valid email address.');

      if (password.length < 6) return handleErrorMessage("Password must be at least 6 characters long.");

      const res: AuthenticationRes = await API.post('/auth/register', {
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password
      });
      
      if (res.data.isRegistered) {
        localStorage.setItem('isUser', JSON.stringify(true));
        localStorage.setItem('token', res.data.token);
        const decodedToken: { id: string } = jwtDecode(res.data.token);
        localStorage.setItem('userId', decodedToken.id);
        navigate('/home');
      }
      
    } catch (error: any) {
      handleErrorMessage(error.response?.data?.message);
    }
  }

  const handleLogin = async () => {
    try {
      if (!username || !password) return handleErrorMessage('Both fields are required.');

      const res: AuthenticationRes = await API.post('/auth/login', {
        username,
        password
      });

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('isUser', JSON.stringify(true));
        const decodedToken: { id: string } = jwtDecode(res.data.token);
        localStorage.setItem('userId', decodedToken.id);
        navigate('/home');
      }
    } catch (error: any) {
      handleErrorMessage(error.response?.data?.message);
    }
  }

  return (
    <main className="register-page">
      <h1>
        {
          layout === 'register'
            ? 'Welcome to MoorTube!'
            : 'Welcome back!'
        }
      </h1>
      <h2>
        {
          layout === 'register'
            ? 'Your new destination for watching YouTube videos with more deliberation.'
            : 'Log in to continue enjoying MoorTube.'
        }
      </h2>
      <form className="register-form" onSubmit={e => {
        e.preventDefault();
        layout === 'register' ? handleRegister() : handleLogin();
        
      }}>
        <fieldset>
          <legend>
            { layout === 'register' ? "Register a new account" : "LOGIN"}
          </legend>

          <div>
            <label htmlFor="username">Username:</label>
            <input autoFocus value={username} onChange={e => setUsername(e.currentTarget.value)} type="text" name="username" id="username" placeholder="Enter a unique MoorTube username" />
          </div>

          {
            layout === 'register' &&
            <div>
              <label htmlFor="email">Email:</label>
              <input value={email} onChange={e => setEmail(e.currentTarget.value)} type="email" name="email" id="email" placeholder="Enter your email" />
            </div>
          }

          <div>
            <label htmlFor="password">Password:</label>
            <input value={password} onChange={e => setPassword(e.currentTarget.value)} type="password" name="password" id="password" placeholder="Enter a strong MoorTube password" />
          </div>

          {
            layout === 'login' &&
            <div>
              <Link className="password-reset-link" to="/oneTimePasscode">Forgot password?</Link>
            </div>
          }

          <div>
            <button type="submit" className="register-btn">
              {
                layout === 'register' ? 'Become a MoorTuber' : 'LOGIN'
              }
            </button>
            <span>Or</span>
            <Link to={layout === 'register' ? "/login" : "/register"} className="login-navigator-btn">
              {
                layout === 'register' ? 'Already have an account?' : 'Become a MoorTuber'
              }
            </Link>
          </div>
        </fieldset>

      </form>
      
    </main>
  );
}