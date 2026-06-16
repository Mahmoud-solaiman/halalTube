import { useState } from 'react'; // Importing the useState hook from the react package
import './AddNewDisc.scss'; // Importing the sass styles for this component
import { AddNewDiscProps, DiscsResponse } from '../types/types';
import API from '../api/axios';

export function AddNewDisc({
  newAdderContainerRef, // The reference of the new disc adder used at the function used to hide the actions, discs, and the new disc adder
  setOpenIndex, // This state is used to control which Actions component to show
  setOpenNewAdder, // This state is used to control which AddNewDisc component to show
  setTranslate, // This is used to toggle the SidePanel
  handleErrorMessage, // This function handles the error messages
  videoId, // This is the video Id of each video in the list of videos fetched from the API used when pushing a new disc
  isOpenTop // This is the variable used to determine the position of the Actions component and its sibling components
}: AddNewDiscProps) {
  //Variables and hooks
  const [newDiscValue, setNewDiscValue] = useState('');

  //Function that handles adding a new disc
  async function addDisc() {
    try {
      await API.post<DiscsResponse>('/discs/create', {
        name: newDiscValue.trim(),
        videos: [videoId]
      });
      setOpenIndex(undefined);
      setTranslate(true);
      setOpenNewAdder(null);
      handleErrorMessage('Disc was added successfully', true);
    } catch (error: any) {
      handleErrorMessage(error.response?.data?.message);
    }
  }

  // The JSX of the AddNewDisc component
  return (
    <form 
      className={isOpenTop ? "new-disc-adder open-top" : "new-disc-adder"} 
      onPointerDown={e => {
        newAdderContainerRef.current = e.currentTarget;
      }}
      onPointerUp={e => e.stopPropagation()}
      onSubmit={e => {
        e.preventDefault();
        addDisc();
      }}
    >
      <input
        autoComplete="off"
        type="text"
        name="new-disc-adder"
        id="new-disc-adder-input"
        placeholder="Enter new disc"
        value={newDiscValue}
        onChange={e => setNewDiscValue(e.target.value)}
      />
      <div className="new-disc-adder-btns-container">
        <button
          type="button"
          className="cancel-new-disc-btn"
          onPointerUp={() => {
            setOpenNewAdder(null);
          }}
        >Cancel</button>
        <button
          type="submit"
          className="add-new-disc-btn"
        >Add</button>
      </div>
    </form>
  );
}