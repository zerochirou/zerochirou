import type { RadioMetadataResult, SongInfo } from "../types";
import { CODE_RADIO_API_ENDPOINT } from "../constants";

interface AzuraCastSongHistoryItem {
  song?: {
    id?: string;
    title?: string;
    artist?: string;
    album?: string;
    art?: string;
  };
  played_at?: number;
}

interface AzuraCastNowPlayingResponse {
  now_playing?: {
    song?: {
      id?: string;
      title?: string;
      artist?: string;
      album?: string;
      art?: string;
    };
    duration?: number;
    elapsed?: number;
  };
  listeners?: {
    total?: number;
    unique?: number;
    current?: number;
  };
  song_history?: AzuraCastSongHistoryItem[];
}

/**
 * Fetches now-playing metadata specifically from freeCodeCamp Code Radio API.
 */
export async function fetchRadioMetadata(
  endpoint = CODE_RADIO_API_ENDPOINT,
): Promise<RadioMetadataResult | null> {
  try {
    const response = await fetch(endpoint, {
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data: AzuraCastNowPlayingResponse = await response.json();

    const song = data.now_playing?.song;
    const currentSong: SongInfo = {
      id: song?.id,
      title: song?.title || "Code Radio Track",
      artist: song?.artist || "freeCodeCamp",
      album: song?.album || "24/7 Music Designed for Coding",
      art: song?.art || "",
      duration: data.now_playing?.duration || 0,
    };

    const listenersCount = data.listeners?.total ?? 0;

    const history: SongInfo[] = Array.isArray(data.song_history)
      ? data.song_history.map((item) => ({
          id: item.song?.id,
          title: item.song?.title || "Unknown Track",
          artist: item.song?.artist || "Unknown Artist",
          album: item.song?.album || "",
          playedAt: item.played_at,
        }))
      : [];

    return {
      currentSong,
      listenersCount,
      history,
    };
  } catch {
    return null;
  }
}
