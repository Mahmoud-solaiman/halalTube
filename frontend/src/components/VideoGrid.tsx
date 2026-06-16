import { useEffect, useRef, useState } from 'react';
import { handleDuration, handleViewCount, youtubeTimeAgo } from '../utils/formatting';
import { Actions } from './Actions';
import './VideoGrid.scss';
import { DiscsActions } from './DiscsActions';
import { AddNewDisc } from './AddNewDisc';
import { useNavigate } from 'react-router-dom';
import { VideoGridProps } from '../types/types';

export function VideoGrid({
  channelLogo,
  videos,
  setDiscs,
  setTranslate,
  handleErrorMessage,
  setPoster,
  discs
}: VideoGridProps) {
  // This is the section for setting up all the variables and states and other hooks
  const [openIndex, setOpenIndex] = useState<number | undefined>(undefined); // The state that toggles the disc actions on and off
  const [openDisc, setOpenDisc] = useState<number | null>(null); // The state that toggles the discs on and off
  const [openNewAdder, setOpenNewAdder] = useState<number | null>(null); // The state the toggles the new disc adder on and off
  const actionsContainerRef = useRef<HTMLElement>(null); // The reference to the actions container
  const discsContainerRef = useRef<HTMLElement>(null); // The reference to the discs container
  const dotsContainer = useRef<SVGSVGElement>(null); // The reference to the video dots
  const newAdderContainerRef = useRef<HTMLElement>(null); //The reference to the new disc adder container
  const videoBackgroundList = [ // The list of colors picked for the video hover effect
    '#d2042d33',
    '#5d145133',
    '#01796f33',
    '#00a86a33',
    '#b5672733',
    '#a52a2a33',
    '#80808033',
    '#0e4c9233',
    '#1134a633',
    '#f4ba1c33'
  ];
  const [isOpenTop, setIsOpenTop] = useState(false);
  const navigate = useNavigate();

  //The function that handles hidding the actions, discs, and new disc adder when clicking on the screen
  useEffect(() => {
    /* 
      If the clicked element isn't the actions container, nor the discs container, nor the dots 
      , nor the new disc adder container, then hide all of these elements listed formerly
    */
    function hideActions(e: PointerEvent) {
      const target = e.target as Node;
      if (
        !actionsContainerRef.current?.contains(target) &&
        !discsContainerRef.current?.contains(target) &&
        !dotsContainer.current?.contains(target) &&
        !newAdderContainerRef.current?.contains(target)
      ) {
        setOpenIndex(undefined);
        setOpenDisc(null);
        setOpenNewAdder(null);
      }
    }

    document.addEventListener('pointerup', hideActions);

    return () => document.removeEventListener('pointerup', hideActions);
  });

  //The JSX of the videos grid when searching for a channel
  return (
    <section className='video-section'>
      {
        // If the videos from the YouTube data API returns the videos for that channel, then  render those videos onto the page
        Object.hasOwn(videos, 'items') &&
        videos.items.map((item, index) => { // Loop through the video list and return each video and render it on the page
          const videoThumbnail = item.snippet.thumbnails.maxres?.url ||
            item.snippet.thumbnails.standard?.url ||
            item.snippet.thumbnails.high?.url ||
            item.snippet.thumbnails.medium?.url ||
            item.snippet.thumbnails.default?.url;
          return (
            <div
              key={item.id}
              // style={hoveredVideo === index ? { backgroundColor: videoBackgroundColor } : {backgroundColor: 'initial'}} // Set the background-color to a random color from the array above to mimic the YouTube video hover effect
              className='video-container'
              onPointerEnter={(e) => { //The event that handles the functionality of the hover effect of the video
                if (e.pointerType === 'touch' || e.pointerType === 'pen') return;
                const randomNum = Math.floor(Math.random() * videoBackgroundList.length);
                e.currentTarget.style.setProperty('--bg-video-hover', videoBackgroundList[randomNum]);
              }}
              onMouseLeave={e => e.currentTarget.style.setProperty('--bg-video-hover', 'initial')} // Reset color when the hover is over
              onPointerUp={() => {
                navigate(`/watch?v=${item.id}`);
                setPoster(videoThumbnail);
              }}
            >
              <div className="video">
                <img
                  className='video-thumbnail'
                  loading="lazy"
                  src={videoThumbnail || 'default-thumbnail.png'}
                  alt="video thumbnail"
                />
                <div className="video-duration">
                  {handleDuration(videos.items[index].contentDetails.duration)} {/* Convert the duration from the ISO format into a human readable format like that of YouTube */}
                </div>
              </div>
              <div className="video-info">
                <div className="video-channel-logo-container">
                  <img src={channelLogo.items.find(channel => channel.id === item.snippet.channelId)?.snippet.thumbnails.default.url || 'default-thumbnail.png'} alt="" />
                </div>
                <div className="video-details">
                  <span className="video-title">{item.snippet.title}</span>
                  <span className="video-channel-name">{item.snippet.channelTitle}</span>
                  <span className="views-videoLife">{handleViewCount(videos.items[index].statistics.viewCount)} views &#8226; {youtubeTimeAgo(item.snippet.publishedAt)}</span> {/* handle the view count and the upload time of the video */}
                </div>
                <div className="dots-container">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 640"
                    className='three-dots-video'
                    onPointerUp={(e) => {
                      e.stopPropagation();
                      openIndex === index ? setOpenIndex(undefined) : setOpenIndex(index); // Toggle the actions when clicking the three dots
                      setOpenDisc(null); // Hide the discs whenever user clicks the three dots
                      setOpenNewAdder(null); // Hide new disc adder whenever user clicks the three dots
                      dotsContainer.current = e.currentTarget; // Set the dots reference

                      // Render the actions elements and it's subsequent element optimully with the view 
                      if (window.innerHeight - e.clientY < 200) {
                        setIsOpenTop(true);
                      } else {
                        setIsOpenTop(false);
                      }
                    }}
                  >
                    <path d="M320 208C289.1 208 264 182.9 264 152C264 121.1 289.1 96 320 96C350.9 96 376 121.1 376 152C376 182.9 350.9 208 320 208zM320 432C350.9 432 376 457.1 376 488C376 518.9 350.9 544 320 544C289.1 544 264 518.9 264 488C264 457.1 289.1 432 320 432zM376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320z" />
                  </svg>
                </div>
                {
                  openIndex === index &&
                  // The Actions component
                  <Actions
                    setOpenDisc={setOpenDisc}
                    index={index}
                    actionsContainerRef={actionsContainerRef}
                    setOpenNewAdder={setOpenNewAdder}
                    isOpenTop={isOpenTop}
                    handleErrorMessage={handleErrorMessage}
                    setOpenIndex={setOpenIndex}
                    url={`${import.meta.env.VITE_FRONTEND_URL}/watch?v=${item.id}`}
                  />
                }
                {
                  (openDisc === index) &&
                  // The DiscsActions component
                  <DiscsActions
                    discsContainerRef={discsContainerRef}
                    videoId={item.id}
                    handleErrorMessage={handleErrorMessage}
                    setOpenDisc={setOpenDisc}
                    setOpenIndex={setOpenIndex}
                    setOpenNewAdder={setOpenNewAdder}
                    index={index}
                    isOpenTop={isOpenTop}
                    setDiscs={setDiscs}
                    discs={discs}
                  />
                }
                {
                  openNewAdder === index &&
                  // The new disc adder component
                  <AddNewDisc
                    newAdderContainerRef={newAdderContainerRef}
                    setOpenIndex={setOpenIndex}
                    setOpenNewAdder={setOpenNewAdder}
                    setTranslate={setTranslate}
                    handleErrorMessage={handleErrorMessage}
                    videoId={item.id}
                    isOpenTop={isOpenTop}
                  />
                }
              </div>

            </div>
          );
        })
      }
    </section>
  );
}