import { Activity, useEffect, useRef, useState } from 'react';
import './SidePanelFooter.scss';
import { jwtDecode } from 'jwt-decode';
import Settings from './Settings';
import { SidePanelFooterProps } from '../types/types';

export default function SidePanelFooter({ setTranslate }: SidePanelFooterProps) {
  const [ isCopied, setIsCopied ] = useState<boolean>(false);
  const [ username, setUsername ] = useState<string>('');
  const [ isSettings, setIsSettings ] = useState<boolean>(false);
  const settingsBtnRef = useRef<SVGSVGElement>(null);
  const [ copiedId, setCopiedId ] = useState<number>();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token) as { username: string; };
      setUsername(decodedToken.username);
    }
  }, []);

  return (
    <footer className="profile-settings-container">
      <div className="profile-img-container">
        <img src="/user_default.jfif" alt="Profile picture" />
      </div>
      <span onClick={async () => {
        try {
          clearTimeout(copiedId)
          await navigator.clipboard.writeText(username);
          setIsCopied(true);
          setCopiedId(setTimeout(() => setIsCopied(false), 2000));
        } catch (error) {
          console.log('something went wrong');
        }
      }}>
        @{username}
        {
          isCopied
            ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
              <path d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z" />
            </svg>
            : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
              <path d="M288 64C252.7 64 224 92.7 224 128L224 384C224 419.3 252.7 448 288 448L480 448C515.3 448 544 419.3 544 384L544 183.4C544 166 536.9 149.3 524.3 137.2L466.6 81.8C454.7 70.4 438.8 64 422.3 64L288 64zM160 192C124.7 192 96 220.7 96 256L96 512C96 547.3 124.7 576 160 576L352 576C387.3 576 416 547.3 416 512L416 496L352 496L352 512L160 512L160 256L176 256L176 192L160 192z" />
            </svg>
        }
      </span>
      <div className="settings-btn-container">
        <svg ref={settingsBtnRef} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" onClick={() => setIsSettings(!isSettings)}>
          <path d="M320 208C289.1 208 264 182.9 264 152C264 121.1 289.1 96 320 96C350.9 96 376 121.1 376 152C376 182.9 350.9 208 320 208zM320 432C350.9 432 376 457.1 376 488C376 518.9 350.9 544 320 544C289.1 544 264 518.9 264 488C264 457.1 289.1 432 320 432zM376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320z" />
        </svg>

        <Activity mode={isSettings ? "visible" : "hidden"}>
          <Settings 
            setTranslate={setTranslate} 
            setIsSettings={setIsSettings} 
            settingsBtnRef={settingsBtnRef} 
          />
        </Activity>
      </div>
    </footer>
  );
}