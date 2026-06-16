import { useState, useEffect } from "react"; // Import these hooks from the react package
import { Header } from "../../components/Header.tsx"; // Import the header component
import LoadingVideos from "../../components/UI/LoadingVideos.tsx";
import { VideosDetails, type HomeProps } from  "../../types/types.ts";
import { VideoGrid } from "../../components/VideoGrid.js";

export function Home({
    setTranslate,
    translate,
    menuContainer,
    discs,
    setDiscs,
    handleErrorMessage,
    setWatchTitle,
    setPoster
  }: HomeProps) {
  //Variables and states that are shared across the app
  const channelVideosStorage = sessionStorage.getItem('channel-videos');
  const videosStorage = sessionStorage.getItem('videos');
  const channelLogoStorage = sessionStorage.getItem('channel-logo');
  const channelsLogosStorage = sessionStorage.getItem('channels-logos');
  const [ channelVideos, setChannelVideos ] = useState(channelVideosStorage ? JSON.parse(channelVideosStorage) : {}); // The videos for a specific channels returned from the channel filter
  const [ videos, setVideos ] = useState<VideosDetails | {}>(videosStorage ? JSON.parse(videosStorage) : {}); // Videos returned from the video filter
  const [ popUpChannelLogo, setPopUpChannelLogo ] = useState({}); // State for the logos of the search popup
  const [ channelLogo, setChannelLogo ] = useState(channelLogoStorage ? JSON.parse(channelLogoStorage) : {}); // Channel logo of the channel filter
  const [ channelsLogos, setChannelsLogos ] = useState(channelsLogosStorage ? JSON.parse(channelsLogosStorage) : {}); //Logo of the picked channel
  const [ isChannel, setIsChannel ] = useState(true); // This is the state used to determine the search criterion (e.g. channel or video)
  const [ isLoading, setIsLoading ] = useState(false);

  
  useEffect(() => {
    window.addEventListener('offline', () => {
      handleErrorMessage("No internet");
    });

    window.addEventListener('online', () => {
      handleErrorMessage("Back online", true);
    });

    window.addEventListener('load', () => {
      setChannelVideos({});
      setVideos({});
      setChannelLogo({});
      setChannelsLogos({});
      sessionStorage.removeItem('videos');
      sessionStorage.removeItem('channels-logos');
      sessionStorage.removeItem('channel-videos');
      sessionStorage.removeItem('channel-logo');
    });
  });

  // The JSX of the Home component
  return (
    <>
      <title>MoorTube | Home</title>
      {/* Render the Header */}
      <Header
        setVideos={setVideos}
        setChannelVideos={setChannelVideos}
        setChannelsLogos={setChannelsLogos}
        setTranslate={setTranslate}
        menuContainer={menuContainer}
        handleErrorMessage={handleErrorMessage}
        setIsChannel={setIsChannel}
        isChannel={isChannel}
        popUpChannelLogo={popUpChannelLogo}
        setPopUpChannelLogo={setPopUpChannelLogo}
        setChannelLogo={setChannelLogo}
        setWatchTitle={setWatchTitle}
        setIsLoading={setIsLoading}
        translate={translate}
      />

      {
        (channelVideos.items && isChannel) &&
        // Render the ChannelVideos conditionally
        <VideoGrid
          channelLogo={channelLogo}
          videos={channelVideos}
          setDiscs={setDiscs}
          setTranslate={setTranslate}
          handleErrorMessage={handleErrorMessage}
          setPoster={setPoster}
          discs={discs}
        />
      }
      {
        (channelsLogos.items && !isChannel) &&
        // Render the SearchVideos conditionally
        <VideoGrid
          channelLogo={channelsLogos}
          videos={videos}
          setDiscs={setDiscs}
          setTranslate={setTranslate}
          handleErrorMessage={handleErrorMessage}
          setPoster={setPoster}
          discs={discs}
        />
      }
      {
        isLoading &&
        <LoadingVideos />
      }
    </>
  );
}