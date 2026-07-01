import { Routes, Route, useNavigate, Navigate } from "react-router-dom"; // Import the Routes, and Route components from react-router-dom
import { Home } from "./pages/home/Home"; // Import the Home component
import { PageNotFound } from "./pages/404/PageNotFound"; // Import the PageNotFound component
import { SavedVideos } from "./pages/saved-videos/SavedVideos";
import { Watch } from "./pages/watch/Watch";
import { Activity, useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import type { DiscType, SavedVideosDetails } from "./types/types";
import Authentication from "./pages/auth/Authentication";
import { ErrorMessage } from "./components/ErrorMessage";
import { SidePanel } from "./components/SidePanel";
import OneTimePasscode from "./pages/one-time-passcode/OneTimePasscode";
import PasswordReset from "./components/PasswordReset";

// The JSX of the App component and the Routes
export default function App() {
  const modePreferenceStorage = localStorage.getItem('mode-preference');
  const [translate, setTranslate] = useState<boolean>(false); //The translateY value of the SidePanel
  const menuContainer = useRef(null); //The reference of the menu container
  const [discs, setDiscs] = useState<DiscType[]>([]); //The latest disc list from localStorage
  const [errorMessage, setErrorMessage] = useState<string>(''); //The error message state
  const [isErrorMessage, setIsErrorMessage] = useState<boolean>(false); //State to render and disrender the error message
  const [showErrorMessage, setShowErrorMessage] = useState<number | undefined>(undefined); //State to handle the setTimeout for unmounting the error message
  const sysPreferences = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [isDarkMode, setIsDarkMode] = useState(modePreferenceStorage ? JSON.parse(modePreferenceStorage) : sysPreferences);
  const [watchTitle, setWatchTitle] = useState('Channel Search');
  const [poster, setPoster] = useState<string>('');
  const [videos, setVideos] = useState<string[]>([]);
  const [savedVideosDetails, setSavedVideosDetails] = useState<SavedVideosDetails[] | undefined>(undefined);
  const [ isMessageSuccess, setIsMessageSuccess ] = useState<boolean>(false);
  const navigate = useNavigate();

  //Function that handles the rendering and disrendering and the content of the error message
  function handleErrorMessage(message: string, isSuccess: boolean): void {
    clearTimeout(showErrorMessage);
    setErrorMessage(message);
    setShowErrorMessage(setTimeout(() => setIsErrorMessage(false), 1400));
    setIsErrorMessage(true);
    setIsMessageSuccess(isSuccess);
  }

  useEffect(() => {
    const isUser = localStorage.getItem('isUser') ? JSON.parse(localStorage.getItem('isUser') as string) : false;
    const token = localStorage.getItem('token') ? localStorage.getItem('token') as string : false;
    isDarkMode
      ? document.documentElement.classList.add('darkmode')
      : document.documentElement.classList.remove('darkmode');

    if ((token && isUser) || token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp && (decodedToken.exp < currentTime)) {
        navigate('/login');
      }

    } else if (isUser) {
      navigate('/login');
    } else {
      navigate('/register');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const togglePanel = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key).toLowerCase() === 'p') {
        e.preventDefault();
        setTranslate((prev) => !prev);
      }
    }

    document.addEventListener('keydown', togglePanel);

    return () => document.removeEventListener('keydown', togglePanel);
  }, []);

  return (
    <>
      {
        isErrorMessage &&
        <ErrorMessage errorMessage={errorMessage} isSuccess={isMessageSuccess} />
      }
      <Activity mode={translate ? "visible" : "hidden"}>
        <SidePanel
          setTranslate={setTranslate}
          menuContainer={menuContainer}
          discs={discs}
          setDiscs={setDiscs}
          handleErrorMessage={handleErrorMessage}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          setWatchTitle={setWatchTitle}
        />
      </Activity>
      <Routes>
        <Route path="/home" element={
          <Home
            setTranslate={setTranslate}
            translate={translate}
            menuContainer={menuContainer}
            discs={discs}
            setDiscs={setDiscs}
            handleErrorMessage={handleErrorMessage}
            setWatchTitle={setWatchTitle}
            setPoster={setPoster}
          />
        } />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="disc/:id" element={
          <SavedVideos
            setTranslate={setTranslate}
            handleErrorMessage={handleErrorMessage}
            setPoster={setPoster}
            savedVideosDetails={savedVideosDetails}
            setSavedVideosDetails={setSavedVideosDetails}
            videos={videos}
            setVideos={setVideos}
          />
        } />
        <Route path="/watch" element={
          <Watch
            setTranslate={setTranslate}
            menuContainer={menuContainer}
            setDiscs={setDiscs}
            handleErrorMessage={handleErrorMessage}
            watchTitle={watchTitle}
            poster={poster}
            savedVideosDetails={savedVideosDetails}
            setSavedVideosDetails={setSavedVideosDetails}
            setPoster={setPoster}
            layout="watch-panel"
            videos={videos}
            setVideos={setVideos}
          />
        } />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/register" element={
          <Authentication
            handleErrorMessage={handleErrorMessage}
            layout="register"
          />
        } />
        <Route path="/login" element={
          <Authentication
            handleErrorMessage={handleErrorMessage}
            layout="login"
          />
        } />
        <Route path="/oneTimePasscode" element={
          <OneTimePasscode 
            handleErrorMessage={handleErrorMessage}
          />
        } />
        <Route path="/passwordReset" element={
          <PasswordReset
            handleErrorMessage={handleErrorMessage}
          />
        } />
      </Routes>
    </>
  );
}