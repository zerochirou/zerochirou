import type { RadioStation, SongInfo, ShortcutItem } from "./types";

export const CODE_RADIO_STREAM_URL =
  "https://coderadio-admin-v2.freecodecamp.org/listen/coderadio/radio.mp3";

export const CODE_RADIO_API_ENDPOINT =
  "https://coderadio-admin-v2.freecodecamp.org/api/nowplaying/coderadio";

export const STATIONS: RadioStation[] = [
  {
    id: "coderadio",
    name: "freeCodeCamp Code Radio",
    description: "24/7 music designed for coding and concentration",
    streamUrl: CODE_RADIO_STREAM_URL,
    apiEndpoint: CODE_RADIO_API_ENDPOINT,
  },
];

export const DEFAULT_SONG: SongInfo = {
  title: "Code Radio Stream",
  artist: "freeCodeCamp",
  album: "24/7 Music Designed for Coding",
};

export const KEYBOARD_SHORTCUTS: ShortcutItem[] = [
  { key: "Space / K", desc: "Play or Pause music playback" },
  { key: "M", desc: "Mute or Unmute audio" },
  { key: "↑ / ↓", desc: "Increase or Decrease volume (5%)" },
  { key: "H", desc: "Toggle recently played song history" },
  { key: "F", desc: "Toggle full-screen mode" },
  { key: "A", desc: "Toggle animated wallpaper loop" },
  { key: "? / C", desc: "Open this keyboard shortcuts dialog" },
];

export const METADATA_POLL_INTERVAL_MS = 12000;
export const VOLUME_STORAGE_KEY = "coderadio_volume";
