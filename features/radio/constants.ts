import type { RadioStation, SongInfo, ShortcutItem, RadioWallpaper } from "./types";

export const CODE_RADIO_STREAM_URL =
  "https://coderadio-admin-v2.freecodecamp.org/listen/coderadio/radio.mp3";

export const CODE_RADIO_API_ENDPOINT =
  "https://coderadio-admin-v2.freecodecamp.org/api/nowplaying/coderadio";

export const STATIONS: RadioStation[] = [
  {
    id: "coderadio",
    name: "Code Radio 24/7",
    description: "24/7 Lo-Fi and instrumental music for coding and deep focus",
    streamUrl: CODE_RADIO_STREAM_URL,
    frequency: "88.5 FM",
    callSign: "CODE-FM",
    genre: "Lo-Fi Beats",
    apiEndpoint: CODE_RADIO_API_ENDPOINT,
  },
  {
    id: "synthwave",
    name: "Synthwave Nightdrive",
    description: "Atmospheric retro synth, synthwave, and electronic neon vibes",
    streamUrl: "https://streams.ilovemusic.de/iloveradio2.mp3",
    frequency: "94.2 FM",
    callSign: "SYNTH-FM",
    genre: "Synthwave",
  },
  {
    id: "chillhop",
    name: "Chillhop Cafe",
    description: "Cozy jazz hop, coffee beats, and ambient study acoustics",
    streamUrl: "https://streams.ilovemusic.de/iloveradio17.mp3",
    frequency: "101.5 FM",
    callSign: "CHILL-FM",
    genre: "Chillhop",
  },
];


export const WALLPAPERS: RadioWallpaper[] = [
  {
    id: "moonlit_midnight_lofi",
    name: "Moonlit Midnight Lo-Fi",
    videoSrc: "/assets/videos/optimized/moonlit_midnight_lofi.mp4",
    posterSrc: "/assets/videos/posters/moonlit_midnight_lofi.jpg",
  },
  {
    id: "minecraft_overgrown_cabin",
    name: "Overgrown Cabin",
    videoSrc: "/assets/videos/optimized/minecraft_overgrown_cabin.mp4",
    posterSrc: "/assets/videos/posters/minecraft_overgrown_cabin.jpg",
  },
];

export const DEFAULT_WALLPAPER_ID = "moonlit_midnight_lofi";

export const DEFAULT_SONG: SongInfo = {
  title: "Code Radio Stream",
  artist: "freeCodeCamp",
  album: "24/7 Music Designed for Coding",
};

export const KEYBOARD_SHORTCUTS: ShortcutItem[] = [
  { key: "Space / K", desc: "Play or Pause music playback" },
  { key: "M", desc: "Mute or Unmute audio" },
  { key: "↑ / ↓", desc: "Increase or Decrease volume (5%)" },
  { key: "W", desc: "Cycle next video wallpaper" },
  { key: "H", desc: "Toggle recently played song history" },
  { key: "F", desc: "Toggle full-screen mode" },
  { key: "A", desc: "Toggle animated wallpaper loop" },
  { key: "? / C", desc: "Open this keyboard shortcuts dialog" },
];

export const METADATA_POLL_INTERVAL_MS = 12000;
export const VOLUME_STORAGE_KEY = "coderadio_volume";
export const WALLPAPER_STORAGE_KEY = "coderadio_wallpaper";

