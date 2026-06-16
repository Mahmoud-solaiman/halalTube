import { useRef, useState } from "react"; // Import the useState hook from the React Package
import { Search } from "../pages/home/Search"; // Import the Search component
import { Suggestions } from "../pages/home/Suggestions"; // Import the Suggestions component
import { ToggleSearch } from "./ToggleSearch"; // Import the ToggleSearch component
import './Header.scss'; // Import the style sheet of this component
import { generateID } from "../utils/formatting";
import { HeaderProps, PopUpChannelLogoResponse, SearchHistory, VideosResponse } from "../types/types";
import API from "../api/axios";

export function Header({
  setVideos,
  setChannelVideos,
  setChannelsLogos,
  setTranslate,
  menuContainer,
  handleErrorMessage,
  setIsChannel,
  isChannel,
  popUpChannelLogo,
  setPopUpChannelLogo,
  setChannelLogo,
  setWatchTitle,
  setIsLoading,
  translate
}: HeaderProps) {
  const [isSuggestions, setIsSuggestions] = useState(false); // This state controls whether to show the channels search suggestions or not
  const searchHistoryStorage = localStorage.getItem('search-history');
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>(searchHistoryStorage ? JSON.parse(searchHistoryStorage) : []);
  const [searchText, setSearchText] = useState(''); // The state of the search field to control its value
  const [ isLoadingChannels, setIsLoadingChannels ] = useState(false);
  const searchField = useRef(null);

  // This function handles adding the searches to the search history making sure none repeats twice.
  function AddToSearchHistory(search: string) {
    const isSuggestion = searchHistory.find(item => item.searchName.toLowerCase() === search.trim().toLowerCase());
    if (!isSuggestion) {
      searchHistory.push(
        {
          searchName: search.trim(),
          key: generateID()
        }
      );

      localStorage.setItem('search-history', JSON.stringify(searchHistory));
    }
  }

  async function fetchChannelsData(search: string) {
    try {
      // If the search filter is set to channel, then search for channels using the following
      if (isChannel && search.trim()) {
        setIsLoadingChannels(true);
        setPopUpChannelLogo({});
        setIsSuggestions(true); // Then finally show those channels of the desired user search visually in the search suggestion popup
        
        const channelInfo = await API.get<PopUpChannelLogoResponse>('/youtube/channels', {
          params: {
            q: search
          }
        });
  
        setIsLoadingChannels(false);
        // Then we set the response to that final result to be used to render the channels visually in the suggestions popup
        setPopUpChannelLogo(channelInfo.data.data);
        setSearchText(''); // Then set the search field value back to empty for better UX
  
        AddToSearchHistory(search);
  
      } else if (!isChannel && search.trim()) { // If search filter is set to video, then search for videos instead
  
        setIsSuggestions(false);
        setChannelsLogos({});
        setIsLoading(true);
              
        const videos = await API.get<VideosResponse>('/youtube/videos', {
          params: {
            q: search
          }
        })
  
        setChannelsLogos(videos.data.channelsLogos);
        sessionStorage.setItem('channels-logos', JSON.stringify(videos.data.channelsLogos));
        setVideos(videos.data.videosDetails);
        sessionStorage.setItem('videos', JSON.stringify(videos.data.videosDetails));
        setSearchText('');
  
        AddToSearchHistory(search);
  
        setIsLoading(false);
      } else if (!search.trim()) { // If the search field is empty
        handleErrorMessage("Search input can't be an empty value.");
      }
      
    } catch (error: any) {
      handleErrorMessage(error.response?.data?.message);
      setIsLoadingChannels(false);
      setIsSuggestions(false);
      setIsLoading(false);
    }
  }

  // The JSX of the Header component
  return (
    <>
      <header className="header">
        <div className="logo-menu-container">
          <div title="Menu" className="menu-container" ref={menuContainer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              onClick={() => setTranslate(true)}
            >
              <path
                d="M96 160C96 142.3 110.3 128 128 128L512 128C529.7 128 544 142.3 544 160C544 177.7 529.7 192 512 192L128 192C110.3 192 96 177.7 96 160zM96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320zM544 480C544 497.7 529.7 512 512 512L128 512C110.3 512 96 497.7 96 480C96 462.3 110.3 448 128 448L512 448C529.7 448 544 462.3 544 480z"
              />
            </svg>
          </div>
          <div className="logo-container" title="MoorTube">
            <img src="/logo.svg" alt="website logo" />
            <h2>MoorTube</h2>
          </div>
        </div>

        <div className="search-area">
          {/* The Search component */}
          <Search
            isChannel={isChannel}
            setIsSuggestions={setIsSuggestions}
            setPopUpChannelLogo={setPopUpChannelLogo}
            setSearchHistory={setSearchHistory}
            searchText={searchText}
            setSearchText={setSearchText}
            fetchChannelsData={fetchChannelsData}
            searchField={searchField}
            translate={translate}
          />
          {/* The ToggleSearch component */}
          <ToggleSearch
            toggleSearch={setIsChannel}
            setWatchTitle={setWatchTitle}
          />
          {/* This renders the Suggestions component condictionally */}
          {
            isSuggestions &&
            // The Suggestions component
            <Suggestions
              popUpChannelLogo={popUpChannelLogo}
              setIsSuggestions={setIsSuggestions}
              setChannelVideos={setChannelVideos}
              setChannelLogo={setChannelLogo}
              searchHistory={searchHistory}
              setSearchHistory={setSearchHistory}
              searchText={searchText}
              fetchChannelsData={fetchChannelsData}
              searchField={searchField}
              setSearchText={setSearchText}
              setIsLoading={setIsLoading}
              isLoadingChannels={isLoadingChannels}
            />
          }
        </div>
      </header>
    </>
  );
}