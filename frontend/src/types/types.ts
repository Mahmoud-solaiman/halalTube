import { RefObject } from "react";

export type DiscType = {
  _id: string;
  name: string;
  user: string;
  videos: string[];
  parentId: string;
  ancestors: string[];
}

export type HomeProps = {
  setTranslate: React.Dispatch<React.SetStateAction<boolean>>;
  translate: boolean;
  menuContainer: RefObject<HTMLDivElement | null>;
  discs: DiscType[];
  setDiscs: React.Dispatch<React.SetStateAction<DiscType[]>>;
  handleErrorMessage(message: string, isSuccess?: boolean): void;
  setWatchTitle: React.Dispatch<React.SetStateAction<string>>;
  setPoster: React.Dispatch<React.SetStateAction<string>>;
}

export type SearchProps = {
  isChannel: boolean;
  setIsSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
  setPopUpChannelLogo: React.Dispatch<React.SetStateAction<PopUpChannelLogo>>
  setSearchHistory: React.Dispatch<React.SetStateAction<SearchHistory[]>>
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>
  fetchChannelsData(value: string): Promise<void>;
  searchField: RefObject<HTMLInputElement | null>;
  translate: boolean;
}

export type SearchHistory = {
  key: string;
  searchName: string;
}

export type HeaderProps = {
  setVideos: React.Dispatch<React.SetStateAction<VideosDetails>>;
  setChannelVideos(value: unknown): void;
  setChannelsLogos(value: unknown): void;
  setTranslate(value: boolean): void;
  menuContainer: RefObject<HTMLDivElement | null>;
  handleErrorMessage(message: string, isSuccess?: boolean): void;
  setIsChannel(value: boolean): void;
  isChannel: boolean;
  popUpChannelLogo: PopUpChannelLogo;
  setPopUpChannelLogo: React.Dispatch<React.SetStateAction<PopUpChannelLogo>>
  setChannelLogo(value: unknown): void;
  setWatchTitle(value: string): void;
  setIsLoading(value: boolean): void;
  translate: boolean;
}

type PopUpChannelLogo = {
  items?: [{
    id: string;
    snippet: {
      thumbnails: { default: { url: string } };
      title: string;
      customUrl: string;
    }
  }]
}

export type PopUpChannelLogoResponse = {
  message: string;
  success: boolean;
  data: PopUpChannelLogo;
}

export type VideosResponse = {
  message: string;
  success: boolean;
  channelsLogos: ChannelsLogos;
  videosDetails: VideosDetails;
}

export type ChannelVideosResponse = {
  message: string;
  success: boolean;
  videoStats: VideosDetails;
}

export type SuggestionsProps = {
  popUpChannelLogo: PopUpChannelLogo;
  setIsSuggestions(value: boolean): void;
  setChannelVideos(value: unknown): void;
  setChannelLogo(value: PopUpChannelLogo): void;
  searchHistory: SearchHistory[];
  setSearchHistory(value: SearchHistory[]): void;
  searchText: string;
  fetchChannelsData(value: string): void;
  searchField: RefObject<HTMLInputElement | null>;
  setSearchText(value: string): void;
  setIsLoading(value: boolean): void;
  isLoadingChannels: boolean;
}

export type SidePanelProps = {
  setTranslate(value: boolean): void;
  menuContainer: RefObject<HTMLDivElement | null>;
  discs: DiscType[];
  setDiscs(value: DiscType[]): void;
  handleErrorMessage(message: string, isSuccess?: boolean): void;
  isDarkMode: boolean;
  setIsDarkMode(value: boolean): void;
  setWatchTitle(value: string): void;
}

export type DiscProps = {
  disc: string;
  title: string;
  discId: string;
  setDiscs(value: DiscType[]): void;
  deleteConfirmationRef: RefObject<HTMLElement | null>
  handleErrorMessage(message: string, isSuccess?: boolean): void;
  discObject: DiscType;
  setWatchTitle(value: string): void;
  discs: DiscType[];
  parentId: string;
}

export type DiscDeleteProps = {
  setDiscs(value: DiscType[]): void;
  setShowDelete(value: boolean): void;
  deleteConfirmationRef: RefObject<HTMLElement | null>;
  discId: string;
  discs: DiscType[];
}

type ChannelsLogos = {
  items: [{
    id: string;
    snippet: {
      thumbnails: {
        default: {
          url: string;
        }
      }
    }
  }]
}

export type VideosDetails = {
  items: [{
    id: string;
    snippet: {
      thumbnails: {
        maxres: {
          url: string;
        },
        standard: {
          url: string;
        },
        high: {
          url: string;
        },
        medium: {
          url: string;
        },
        default: {
          url: string;
        },
      };
      title: string;
      channelTitle: string;
      channelId: string;
      publishedAt: string;
    };
    contentDetails: {
      duration: string;
    };
    statistics: {
      viewCount: string;
    }
  }]
}

export type VideoResponse = {
  message: string;
  success: boolean;
  video: VideosDetails;
}

export type VideoGridProps = {
  channelLogo: ChannelsLogos;
  videos: VideosDetails | {};
  setDiscs(value: DiscType[]): void;
  setTranslate(value: boolean): void;
  handleErrorMessage(message: string, isSuccess?: boolean): void;
  setPoster(value: string): void;
  discs: DiscType[];
}

export type ActionsProps = {
  setOpenDisc(value: number | null | ((value: number |  null) => number | null)): void;
  index: number;
  actionsContainerRef: RefObject<HTMLElement | null>;
  setOpenNewAdder(value: number | null): void;
  isOpenTop: boolean;
  handleErrorMessage(message: string, isSuccess?: boolean): void;
  setOpenIndex(value: number | undefined): void;
  url: string;
}

export type DiscsActionsProps = {
  discsContainerRef: RefObject<HTMLElement | null>;
  videoId: string;
  handleErrorMessage(message: string, isSuccess?: boolean): void;
  setOpenDisc(value: number | null): void;
  setOpenIndex(value: number | undefined): void;
  setOpenNewAdder: React.Dispatch<React.SetStateAction<number | null>>;
  index: number;
  isOpenTop: boolean;
  setDiscs(value: DiscType[]): void;
  discs: DiscType[];
}

export type AddNewDiscProps = {
  newAdderContainerRef: RefObject<HTMLElement | null>
  setOpenIndex(value: number | undefined): void;
  setOpenNewAdder(value: number | null): void;
  setTranslate(value: boolean): void;
  handleErrorMessage(message: string, isSuccess?: boolean): void;
  videoId: string;
  isOpenTop: boolean;
}

export type SavedVideosProps = {
  setTranslate(value: boolean): void;
  handleErrorMessage(message: string, isSuccess?: boolean): void;
  setPoster(value: string): void;
  savedVideosDetails: SavedVideosDetails[] | undefined;
  setSavedVideosDetails(value: SavedVideosDetails[] | ((value: SavedVideosDetails[] | undefined) => SavedVideosDetails[] | undefined)): void;
  videos: string[];
  setVideos(value: string[]): void;
}

export type SavedVideosHeaderProps = {
  discName?: string;
  setTranslate(value: boolean): void;
  menuContainer: RefObject<HTMLDivElement | null>;
}

export type SavedVideosDetails = {
  snippet: {
    thumbnails: {
      maxres: {
        url: string;
      },
      standard: {
        url: string;
      },
      high: {
        url: string;
      },
      medium: {
        url: string;
      },
      default: {
        url: string;
      },
    },
    channelTitle: string;
    title: string;
    publishedAt: string;
  };
  id: string;
  statistics: {
    viewCount: string;
  };
  contentDetails: {
    duration: string;
  }
};

export type SavedVideosDetailsResponse = {
  message: string;
  success: boolean;
  videos: {
    items: SavedVideosDetails[];
  },
  disc: DiscType;
}

export type SubDiscsResponse = {
  message: string;
  success: boolean;
  discs: DiscType[];
}

export type SavedVideosPanelProps = {
  discName: string;
  savedVideosDetails: SavedVideosDetails[] | undefined;
  setPoster(value: string | undefined): void;
  subDiscs: DiscType[];
}

export type SavedVideosGridProps = {
  savedVideosDetails: SavedVideosDetails[] | undefined;
  setSavedVideosDetails(value: SavedVideosDetails[] | ((value: SavedVideosDetails[] | undefined) => SavedVideosDetails[] | undefined)): void;
  handleErrorMessage(message: string, isSuccess?: boolean): void;
  setPoster(value: string): void;
  layout: 'saved-videos' | 'watch-panel';
  videos: string[];
  setVideos(value: string[] | ((value: string[]) => string[])): void;
  subDiscs: DiscType[];
  setSubDiscs(value: DiscType[] | ((value: DiscType[]) => DiscType[])): void;
}

export type SavedVideosControlsProps = {
  setOpenControls(value: number | null): void;
  controlsBtnRef: RefObject<SVGSVGElement | null>;
  savedVideosDetails: SavedVideosDetails[];
  setSavedVideosDetails(value: SavedVideosDetails[]): void;
  targetIndex: number;
  setOpenDiscs(value: number | null): void;
  discsRef: RefObject<HTMLDivElement | null>;
  handleErrorMessage(message: string, isSuccess?: boolean): void;
  videos: string[];
  setVideos(value: string[]): void;
  url: string;
}

export type DiscsControlsProps = {
  discsRef: RefObject<HTMLDivElement | null>;
  videoId: string;
  setOpenControls(value: number | null): void;
  setOpenDiscs(value: number | null): void;
  handleErrorMessage(message: string, isSuccess?: boolean): void;
}

export type WatchProps = Omit<SavedVideosGridProps, 'setVideos' | 'setDiscName' | 'setTranslate' | 'setIsSpinner' | 'setSubDiscs' | 'subDiscs'> & {
  setTranslate(value: boolean): void;
  menuContainer: RefObject<HTMLDivElement | null>
  setDiscs(value: DiscType[]): void;
  handleErrorMessage(message: string, isSuccess?: boolean): void;
  watchTitle: string;
  poster: string;
  setVideos(value: string[]): void;
}

export type WatchPanelProps = Omit<SavedVideosGridProps, 'subDiscs' | 'setSubDiscs'> & {
  setDiscs: React.Dispatch<React.SetStateAction<DiscType[]>>;
};

export type ControlsProps = {
  isBlur: boolean;
  setIsBlur: React.Dispatch<React.SetStateAction<boolean>>;
  isShowControls: boolean;
  hideControls?(): void;
  isSettings: boolean;
  isSpeedSettings: boolean;
  isNoteTakers: boolean;
  setIsSettings: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSpeedSettings: React.Dispatch<React.SetStateAction<boolean>>;
  setIsNoteTakers: React.Dispatch<React.SetStateAction<boolean>>;
}

export type Location = {
  coords: {
    latitude: number;
    longitude: number;
  }
}

export type NextPrayer = {
  timings: {[key: string]: string}
}

export type VideoPlayerSettingsProps = {
  setIsSpeedSettings: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSettings: React.Dispatch<React.SetStateAction<boolean>>;
  setBlurBoxes: React.Dispatch<React.SetStateAction<string[]>>;
  blurBoxes: string[];
  setIsNoteTakers: React.Dispatch<React.SetStateAction<boolean>>;
} 

export type PlaySpeedControlsProps = Omit<VideoPlayerSettingsProps, 'setBlurBoxes' | 'blurBoxes' | 'setIsNoteTakers'>;

export type BlurBoxProps = {
  blurBoxes: string[];
  setBlurBoxes: React.Dispatch<React.SetStateAction<string[]>>;
}

export type NoteTakersProps = {
  setIsNoteTakers: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSettings: React.Dispatch<React.SetStateAction<boolean>>;
  setNotes: React.Dispatch<React.SetStateAction<NoteTakerType[]>>;
  notes: NoteTakerType[];
  setNoteTakers: React.Dispatch<React.SetStateAction<NoteTakerType[]>>;
  noteTakers: NoteTakerType[];
}

export type NoteProps = {
  note: NoteTakerType;
  notes: NoteTakerType[];
  setNotes: React.Dispatch<React.SetStateAction<NoteTakerType[]>>;
  setNoteTakers: React.Dispatch<React.SetStateAction<NoteTakerType[]>>;
  noteTakers: NoteTakerType[];
}

export type NoteColorsProps = {
  noteRef: RefObject<HTMLElement | null>;
  setIsNoteColors: React.Dispatch<React.SetStateAction<boolean>>;
  noteId: string;
  noteTakers: NoteTakerType[];
  setNoteTakers: React.Dispatch<React.SetStateAction<NoteTakerType[]>>;
}

export type NoteTakerResponse = {
  message: string;
  success: boolean;
  note: NoteTakerType;
}

export type NoteTakersResponse = Omit<NoteTakerResponse, 'note'> & {
  notes: NoteTakerType[];
}

export type NoteTakerType = {
  _id: string;
  videoId: string;
  user: string;
  title: string;
  description: string;
  backgroundColor: string;
}

export type AuthenticationProps = {
  handleErrorMessage(message: string, isSuccess?: boolean): void;
  layout: 'register' | 'login';
}

export type AuthenticationRes = {
  data: {
    message: string; 
    isRegistered: boolean;
    token: string;
  }
}

export type DiscsResponse = {
  data: {
    message: string;
    discs: DiscType[];
    success: boolean;
  }
}

export type SingleDiscResponse = {
  data: {
    message: string;
    disc: DiscType;
    success: boolean;
    videos: SavedVideosDetails[];
  }
}

export type SettingsProps = {
  setIsSettings: React.Dispatch<React.SetStateAction<boolean>>;
  settingsBtnRef: RefObject<SVGSVGElement | null>;
}

export interface SubDiscProps extends React.ComponentPropsWithoutRef<"div">{
  title: string;
  videosCount: number;
  id: string;
  latestVideo: string;
  setSubDiscs: React.Dispatch<React.SetStateAction<DiscType[]>>;
  handleErrorMessage(message: string, isSuccess?: boolean): void;
}

export interface NewSubDiscProps {
  setIsAddSubdisc?: React.Dispatch<React.SetStateAction<boolean>>;
  setSubDiscs: React.Dispatch<React.SetStateAction<DiscType[]>>;
  handleErrorMessage(message: string, isSuccess?: boolean): void;
  type: 'new' | 'edit';
  setIsEditSubdisc?: React.Dispatch<React.SetStateAction<boolean>>;
  subdiscId?: string;
  currentName?: string;
}

export type SingleSubdiscResponse = Omit<SubDiscsResponse, 'discs'> & {
  disc: DiscType;
} 

export interface SubDiscControlsProps {
  setIsControls: React.Dispatch<React.SetStateAction<boolean>>;
  controlsBtnRef: RefObject<HTMLDivElement | null>;
  subdiscId: string;
  setSubDiscs: React.Dispatch<React.SetStateAction<DiscType[]>>;
  setIsEditSubdisc: React.Dispatch<React.SetStateAction<boolean>>;
}