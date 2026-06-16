import { ActionsProps } from '../types/types';
import './Actions.scss'; // The sass style sheet of the elements in this component

export function Actions({ 
    setOpenDisc, // The state that controls which disc is open
    index, // The index of the video list fetched from the api
    actionsContainerRef, // The reference of the actions container used at the function that hides the actions, the discs, and the new disc adder
    setOpenNewAdder, // The state the controls which new disc adder to add
    isOpenTop, // This is the variable that controls whether to show the actions and it's subsequent elements above or below the three dots
    handleErrorMessage,
    setOpenIndex,
    url
  }: ActionsProps) {

  // The JSX of the Actions component
  return (
    <div className={isOpenTop ? "actions-popup open-top" : "actions-popup"}>
      <div
        className="save-disc-action"
        onPointerDown={e => {
          actionsContainerRef.current = e.currentTarget.parentElement;
        }}
        onPointerUp={e => {
          e.stopPropagation();
          if (e.pointerType === 'touch') {
            setOpenDisc(() => index);
            setOpenIndex(undefined);
            return;
          }
          console.log('hi');
          setOpenDisc(prev => {
            if (Number.isFinite(prev)) return null;
            return index;
          });
          setOpenNewAdder(null);
        }}
      >
        <span>Save to disc</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
          <path d="M128 128C128 92.7 156.7 64 192 64L448 64C483.3 64 512 92.7 512 128L512 545.1C512 570.7 483.5 585.9 462.2 571.7L320 476.8L177.8 571.7C156.5 585.9 128 570.6 128 545.1L128 128zM192 112C183.2 112 176 119.2 176 128L176 515.2L293.4 437C309.5 426.3 330.5 426.3 346.6 437L464 515.2L464 128C464 119.2 456.8 112 448 112L192 112z" />
        </svg>
      </div>
      <div 
        className="new-disc-action"
        onPointerDown={e => {
          actionsContainerRef.current = e.currentTarget.parentElement;
        }}
        onPointerUp={e => {
          e.stopPropagation();
          if (e.pointerType === 'touch') {
            setOpenIndex(undefined);
          }
          setOpenNewAdder(index);
          setOpenDisc(null);
        }}
      >
        <span>Create new disc</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
          <path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z" />
        </svg>
      </div>
      <div 
        className="download-btn"
        onPointerDown={e => {
          actionsContainerRef.current = e.currentTarget.parentElement;
        }}
        onPointerUp={e => {
          e.stopPropagation();
          handleErrorMessage("This feature isn't available yet...");
          setOpenIndex(undefined);
        }}
      >
        <span>Download</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
            <path d="M352 96C352 78.3 337.7 64 320 64C302.3 64 288 78.3 288 96L288 306.7L246.6 265.3C234.1 252.8 213.8 252.8 201.3 265.3C188.8 277.8 188.8 298.1 201.3 310.6L297.3 406.6C309.8 419.1 330.1 419.1 342.6 406.6L438.6 310.6C451.1 298.1 451.1 277.8 438.6 265.3C426.1 252.8 405.8 252.8 393.3 265.3L352 306.7L352 96zM160 384C124.7 384 96 412.7 96 448L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 448C544 412.7 515.3 384 480 384L433.1 384L376.5 440.6C345.3 471.8 294.6 471.8 263.4 440.6L206.9 384L160 384zM464 440C477.3 440 488 450.7 488 464C488 477.3 477.3 488 464 488C450.7 488 440 477.3 440 464C440 450.7 450.7 440 464 440z"/>
          </svg>
      </div>
      <div 
        className="share-btn"
        onPointerDown={e => {
          actionsContainerRef.current = e.currentTarget.parentElement;
        }}
        onPointerUp={e => {
          e.stopPropagation();
          navigator.share({ url });
          setOpenIndex(undefined);
        }}
      >
        <span>Share</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
            <path d="M371.8 82.4C359.8 87.4 352 99 352 112L352 192L240 192C142.8 192 64 270.8 64 368C64 481.3 145.5 531.9 164.2 542.1C166.7 543.5 169.5 544 172.3 544C183.2 544 192 535.1 192 524.3C192 516.8 187.7 509.9 182.2 504.8C172.8 496 160 478.4 160 448.1C160 395.1 203 352.1 256 352.1L352 352.1L352 432.1C352 445 359.8 456.7 371.8 461.7C383.8 466.7 397.5 463.9 406.7 454.8L566.7 294.8C579.2 282.3 579.2 262 566.7 249.5L406.7 89.5C397.5 80.3 383.8 77.6 371.8 82.6z"/>
          </svg>
      </div>
    </div>
  );
}