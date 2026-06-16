import { useRef, useState } from 'react';
import './NewSubDisc.scss';
import { NewSubDiscProps, SingleSubdiscResponse } from '../types/types';
import API from '../api/axios';
import { useParams } from 'react-router-dom';

export default function NewSubDisc({
  setIsAddSubdisc,
  setSubDiscs,
  handleErrorMessage,
  type,
  setIsEditSubdisc,
  subdiscId,
  currentName
}: NewSubDiscProps) {
  const [ isDisabledBtn, setIsDisabledBtn ] = useState<boolean>(true)
  const [ inputValue, setInputValue ] = useState<string>(currentName ? currentName : '');
  const parentId = useParams().id;
  const subdiscAdder = useRef<HTMLElement>(null);

  const addNewSubdisc = async () => {
    try {
      const newSubdisc = await API.post<SingleSubdiscResponse>('/discs/create', {
        parentId,
        name: inputValue.trim()
      });

      setSubDiscs(prev => [...prev, newSubdisc.data.disc]);
      if (setIsAddSubdisc) setIsAddSubdisc(false);
      handleErrorMessage('Subdisc has been created successfully', true);

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      handleErrorMessage(errorMessage)
    }
  }

  const editSubdiscName = async () => {
    try {
      await API.put(`/discs/update/${subdiscId}`, {
        name: inputValue.trim()
      });

      setSubDiscs(prev => prev.map(item => {
        if (item._id === subdiscId) {
          item.name = inputValue.trim();
          return item;
        }

        return item;
      }));

      if (setIsEditSubdisc) setIsEditSubdisc(false);

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      handleErrorMessage(errorMessage)
    }
  }

  const hideSubdisc = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as Node;

    if (!subdiscAdder.current?.contains(target)) {
      if (setIsAddSubdisc) setIsAddSubdisc(false);
    }
  }
    
  return (
    <div className="subdisc-adder-container" onPointerUp={hideSubdisc}>
      <section className="subdisc-adder" ref={subdiscAdder}>
        <div>
          <svg onClick={() => {
            if (type === 'new' && setIsAddSubdisc) {
              setIsAddSubdisc(false);
            } else if (type === 'edit' && setIsEditSubdisc) {
              setIsEditSubdisc(false);
            }
          }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
            <title>Close</title>
            <path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" />
          </svg>
        </div>

        <form onSubmit={e => {
          e.preventDefault();
          type === 'new' ? addNewSubdisc() : editSubdiscName();
        }}>
          <input 
            type="text" 
            name="subdisc-input" 
            id="subdisc-input" 
            className="subdisc-input" 
            placeholder={type === 'new' ? "Add a new subdisc" : "Edit your subdisc"}
            autoFocus
            autoComplete="off"
            value={inputValue}
            onChange={e => {
              if (e.currentTarget.value.trim().length > 4) {
                setInputValue(e.currentTarget.value);
                setIsDisabledBtn(false);
              } else {
                setInputValue(e.currentTarget.value);
                setIsDisabledBtn(true);
              }
            }}
          />
          <div className="subdisc-btns-container">
            <button title="Cancel" type="button" onClick={() => {
              if (type === 'new' && setIsAddSubdisc) {
                setIsAddSubdisc(false);
              } else if (type === 'edit' && setIsEditSubdisc) {
                setIsEditSubdisc(false);
              }
            }}>Cancel</button>
            {
              type === 'new'
              ? <button title="Add" type="submit" disabled={isDisabledBtn}>Add</button>
              : <button title="Update" type="submit" disabled={isDisabledBtn}>Update</button>
            }
          </div>
        </form>
      </section>
    </div>
  );
}