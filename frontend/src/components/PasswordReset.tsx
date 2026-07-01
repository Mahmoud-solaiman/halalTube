import { useState } from 'react';
import './PasswordReset.scss';
import { APIResponse, PasswordResetProps } from '../types/types';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function PasswordReset({ handleErrorMessage }: PasswordResetProps) {
  const [ password, setPassword ] = useState<string>('');
  const [ confirmationPassword, setConfirmationPassword ] = useState<string>('');
  const userId = localStorage.getItem('userId');
  const navigator = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password) return handleErrorMessage("Please enter your new password");
    if (!confirmationPassword) return handleErrorMessage("Please confirm your new password");
    if (password !== confirmationPassword) return handleErrorMessage("New password and confirm password must match");

    try {
      const resetPassword = await API.post<APIResponse>('/password/resetPassword', {
        userId,
        password
      });

      if (resetPassword.data.token) localStorage.setItem('token', resetPassword.data.token);
      
      navigator('/home');
      handleErrorMessage(resetPassword.data.message, resetPassword.data.success);
    } catch (error: any) {
      const message = error.response?.data?.message;
      console.log(message);
    }
  }
  return (
    <section className="password-reset-container">
      <h2>Reset password</h2>
      <p>Please set your new password</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="new-password">New password</label>
          <input 
            type="password" 
            name="new-password" 
            id="new-password"
            value={password} 
            placeholder="Enter new password"
            onChange={e => setPassword(e.currentTarget.value)}
          />
        </div>
        <div>
          <label htmlFor="password-confirmation">Confirm password</label>
          <input 
            type="password" 
            name="new-password" 
            id="password-confirmation" 
            value={confirmationPassword}
            placeholder="Confirm password"
            onChange={e => setConfirmationPassword(e.currentTarget.value)}
          />
        </div>
        <button type="submit">Reset password</button>
      </form>
    </section>
  );
}