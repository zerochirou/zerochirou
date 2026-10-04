export interface SongInfo {
  id?: string;
  title: string;
  artist: string;
  album?: string;
  art?: string;
  playedAt?: number;
  duration?: number;
}

export interface RadioStation {
  id: string;
  name: string;
  description: string;
  streamUrl: string;
  apiEndpoint?: string;
}

export interface RadioWallpaper {
  id: string;
  name: string;
  videoSrc: string;
  posterSrc: string;
}

export interface ShortcutItem {
  key: string;
  desc: string;
}

export interface RadioMetadataResult {
  currentSong: SongInfo;
  listenersCount: number;
  history: SongInfo[];
}

export interface RadioState {
  currentStationId: string;
  isPlaying: boolean;
  isBuffering: boolean;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  isAnimatedBg: boolean;
  currentWallpaperId: string;
  currentSong: SongInfo;
  songHistory: SongInfo[];
  listenersCount: number;
  historyOpen: boolean;
  shortcutsOpen: boolean;
}

export interface RadioActions {
  setStationId: (stationId: string) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsBuffering: (isBuffering: boolean) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  togglePlay: () => void;
  toggleFullscreen: () => void;
  setIsFullscreen: (isFullscreen: boolean) => void;
  toggleAnimatedBg: () => void;
  setWallpaperId: (wallpaperId: string) => void;
  cycleWallpaper: () => void;
  setCurrentSong: (song: SongInfo) => void;
  setSongHistory: (history: SongInfo[]) => void;
  setListenersCount: (count: number) => void;
  setHistoryOpen: (open: boolean) => void;
  setShortcutsOpen: (open: boolean) => void;
  updateFromMetadata: (data: RadioMetadataResult) => void;
}

export type RadioStore = RadioState & RadioActions;
