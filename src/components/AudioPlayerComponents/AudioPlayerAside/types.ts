import type { PlayListItem } from "@/stores/playList";
import type { lyricType } from "../types";

export type PlayMode = "wholeOnce" | "singleCircle" | "wholeCircle" | "random";

export interface AudioTrackAssets {
    audioUrl: string;
    coverUrl: string;
    lyrics: lyricType;
}

export interface LoadedAudioTrack {
    actualIndex: number;
    meta: PlayListItem;
    assets: AudioTrackAssets;
}

export interface PlaylistViewItem {
    actualIndex: number;
    orderIndex: number;
    meta: PlayListItem;
    coverUrl?: string;
    isActive: boolean;
}
