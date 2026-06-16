import { useEffect } from 'react';
import { DiscsActionsProps, DiscsResponse } from '../types/types';
import './DiscsActions.scss'; // Import the style sheet of this component
import API from '../api/axios';

export function DiscsActions({
  discsContainerRef,
  videoId,
  handleErrorMessage,
  setOpenDisc,
  setOpenIndex,
  setOpenNewAdder,
  index,
  isOpenTop,
  setDiscs,
  discs
}: DiscsActionsProps) {

  useEffect(() => {
    const fetchDiscs = async () => {
      try {
        const discs: DiscsResponse = await API.get('/discs');
        setDiscs(discs.data.discs);
      } catch (error) {
        console.error("Something went wrong when trying to connect to the server.");
      }
    }

    fetchDiscs();
  }, []);

  const addNewVideo = async (id: string, videos: string[]) => {
    try {
      const existingVideo = videos.find(video => video === videoId);
      if (existingVideo) {
        handleErrorMessage('Video already exists in this disc!');
      } else {
        await API.put(`/discs/update/${id}`, {
          videos: [videoId, ...videos]
        });

        handleErrorMessage('Video has been added successfully.', true);
      }

      setOpenDisc(null);
      setOpenIndex(undefined);
    } catch (error: any) {
      handleErrorMessage(error.response?.data?.message);
    }
  }

  // The JSX of the DiscsActions component
  return (
    <div
      className={isOpenTop ? (!discs.length ? 'discs-actions-container open-top empty' : 'discs-actions-container open-top') : (!discs.length ? 'discs-actions-container empty' : 'discs-actions-container')}
      onPointerDown={e => {
        if (!discs.length) {
          discsContainerRef.current = e.currentTarget;
        }
      }}
      onPointerUp={e => e.stopPropagation()}
    >
      <div className="discs-actions-parent">
        {
          discs.length ?
            discs.map(item => {
              return (
                <div
                  key={item._id}
                  className="disc-actions"
                  onPointerUp={e => {
                    e.stopPropagation();
                    discsContainerRef.current = e.currentTarget.parentElement;
                    addNewVideo(item._id, item.videos);
                  }}
                >
                  <span>{item.name.length > 18 ? `${item.name.slice(0, 18).trimEnd()}...` : item.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <path d="M128 128C128 92.7 156.7 64 192 64L448 64C483.3 64 512 92.7 512 128L512 545.1C512 570.7 483.5 585.9 462.2 571.7L320 476.8L177.8 571.7C156.5 585.9 128 570.6 128 545.1L128 128zM192 112C183.2 112 176 119.2 176 128L176 515.2L293.4 437C309.5 426.3 330.5 426.3 346.6 437L464 515.2L464 128C464 119.2 456.8 112 448 112L192 112z" />
                  </svg>
                </div>
              )
            }) :
            "You have no discs to show!"
        }
      </div>
      <button type="button" onPointerUp={e => {
        if (e.pointerType === 'touch') {
          setOpenIndex(undefined);
        }
        setOpenDisc(null);
        setOpenNewAdder(index);
      }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
        >
          <path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z" />
        </svg>
        New disc
      </button>
    </div>
  );
}