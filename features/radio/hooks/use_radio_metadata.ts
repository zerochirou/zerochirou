"use client";

import { useEffect } from "react";
import { radioStore } from "../store/radio_store";
import { CODE_RADIO_API_ENDPOINT, METADATA_POLL_INTERVAL_MS } from "../constants";
import { fetchRadioMetadata } from "../services/radio_api";

export function useRadioMetadata() {
  useEffect(() => {
    let isCancelled = false;

    const loadMetadata = async () => {
      try {
        const result = await fetchRadioMetadata(CODE_RADIO_API_ENDPOINT);
        if (result && !isCancelled) {
          radioStore.updateFromMetadata(result);
        }
      } catch {
        // Silently handle any network errors
      }
    };

    loadMetadata();
    const interval = setInterval(loadMetadata, METADATA_POLL_INTERVAL_MS);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, []);
}
