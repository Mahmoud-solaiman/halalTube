import { useEffect, useRef } from 'react';
import './SavedVideoControls.scss';
import { SavedVideosControlsProps, SavedVideosDetailsResponse } from '../../types/types';
import API from '../../api/axios';
import { useParams, useSearchParams } from 'react-router-dom';

export default function SavedVideoControls({
  setOpenControls,
  controlsBtnRef,
  savedVideosDetails,
  setSavedVideosDetails,
  targetIndex,
  setOpenDiscs,
  discsRef,
  handleErrorMessage,
  videos,
  setVideos,
  url
}: SavedVideosControlsProps) {
  const controlsRef = useRef<HTMLDivElement>(null);
  const id = useParams().id;
  const [ searchParams ] = useSearchParams();

  async function removeVideo() {
    try {
      const updatedVideos = videos.filter(video => video !== savedVideosDetails[targetIndex].id);
      const updatedDisc = await API.put<SavedVideosDetailsResponse>(`/discs/update/${id || searchParams.get('discId')}`, {
        videos: updatedVideos
      });

      handleErrorMessage(updatedDisc.data.message, true);
      setSavedVideosDetails(savedVideosDetails.filter(video => video.id !== savedVideosDetails[targetIndex].id));
      setOpenControls(null);
      setOpenDiscs(null);
      setVideos(updatedVideos);
      
    } catch (error: any) {
      handleErrorMessage(error.response?.data?.message);
    }
  }

  useEffect(() => {
    function hideControls(e: PointerEvent) {
      const target = e.target as Node;
      if (
        !controlsRef.current?.contains(target) &&
        !controlsBtnRef.current?.contains(target) &&
        !discsRef.current?.contains(target)
      ) {
        setOpenControls(null);
        setOpenDiscs(null);
      }
    }

    document.addEventListener('click', hideControls);

    return () => document.removeEventListener('click', hideControls);
  });
  return (
    <div className="saved-video-controls" ref={controlsRef}>
      <div className="control" onClick={removeVideo}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
          <path d="M232.7 69.9C237.1 56.8 249.3 48 263.1 48L377 48C390.8 48 403 56.8 407.4 69.9L416 96L512 96C529.7 96 544 110.3 544 128C544 145.7 529.7 160 512 160L128 160C110.3 160 96 145.7 96 128C96 110.3 110.3 96 128 96L224 96L232.7 69.9zM128 208L512 208L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 208zM216 272C202.7 272 192 282.7 192 296L192 488C192 501.3 202.7 512 216 512C229.3 512 240 501.3 240 488L240 296C240 282.7 229.3 272 216 272zM320 272C306.7 272 296 282.7 296 296L296 488C296 501.3 306.7 512 320 512C333.3 512 344 501.3 344 488L344 296C344 282.7 333.3 272 320 272zM424 272C410.7 272 400 282.7 400 296L400 488C400 501.3 410.7 512 424 512C437.3 512 448 501.3 448 488L448 296C448 282.7 437.3 272 424 272z" />
        </svg>
        <h3 className="control-label">Delete</h3>
      </div>
      <div className="control" onClick={() => setOpenDiscs(targetIndex)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
          <path d="M128 128C128 92.7 156.7 64 192 64L448 64C483.3 64 512 92.7 512 128L512 545.1C512 570.7 483.5 585.9 462.2 571.7L320 476.8L177.8 571.7C156.5 585.9 128 570.6 128 545.1L128 128zM192 112C183.2 112 176 119.2 176 128L176 515.2L293.4 437C309.5 426.3 330.5 426.3 346.6 437L464 515.2L464 128C464 119.2 456.8 112 448 112L192 112z" />
        </svg>
        <h3 className="control-label">Save to disc</h3>
      </div>
      <div className="control" onClick={() => {
        setOpenControls(null);
        handleErrorMessage("This feature isn't available yet...");
        setOpenDiscs(null);
      }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
          <path d="M352 96C352 78.3 337.7 64 320 64C302.3 64 288 78.3 288 96L288 306.7L246.6 265.3C234.1 252.8 213.8 252.8 201.3 265.3C188.8 277.8 188.8 298.1 201.3 310.6L297.3 406.6C309.8 419.1 330.1 419.1 342.6 406.6L438.6 310.6C451.1 298.1 451.1 277.8 438.6 265.3C426.1 252.8 405.8 252.8 393.3 265.3L352 306.7L352 96zM160 384C124.7 384 96 412.7 96 448L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 448C544 412.7 515.3 384 480 384L433.1 384L376.5 440.6C345.3 471.8 294.6 471.8 263.4 440.6L206.9 384L160 384zM464 440C477.3 440 488 450.7 488 464C488 477.3 477.3 488 464 488C450.7 488 440 477.3 440 464C440 450.7 450.7 440 464 440z" />
        </svg>
        <h3 className="control-label">Download</h3>
      </div>
      <div className="control" onClick={() => {
        setOpenControls(null);
        navigator.share({ url });
        setOpenDiscs(null);
      }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
          <path d="M371.8 82.4C359.8 87.4 352 99 352 112L352 192L240 192C142.8 192 64 270.8 64 368C64 481.3 145.5 531.9 164.2 542.1C166.7 543.5 169.5 544 172.3 544C183.2 544 192 535.1 192 524.3C192 516.8 187.7 509.9 182.2 504.8C172.8 496 160 478.4 160 448.1C160 395.1 203 352.1 256 352.1L352 352.1L352 432.1C352 445 359.8 456.7 371.8 461.7C383.8 466.7 397.5 463.9 406.7 454.8L566.7 294.8C579.2 282.3 579.2 262 566.7 249.5L406.7 89.5C397.5 80.3 383.8 77.6 371.8 82.6z" />
        </svg>
        <h3 className="control-label">Share</h3>
      </div>
    </div>
  );
}