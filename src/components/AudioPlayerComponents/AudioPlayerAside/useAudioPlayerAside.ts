import { PlayAudioList } from "@/stores/playList";
import { startTransition, useEffect, useEffectEvent, useRef, useState } from "react";
import { loadAllCoverUrls, loadTrackAssets } from "./assets";
import type { LoadedAudioTrack, PlayMode, PlaylistViewItem } from "./types";

const PLAY_MODES: PlayMode[] = [
    "wholeOnce",
    "singleCircle",
    "wholeCircle",
    "random",
];

function createSequentialOrder() {
    return Array.from({ length: PlayAudioList.length }, (_, index) => index);
}

function shuffleNumbers(list: number[]) {
    const next = list.slice();

    for (let index = next.length - 1; index > 0; index -= 1) {
        const selectedIndex = Math.floor(Math.random() * (index + 1));
        [next[index], next[selectedIndex]] = [next[selectedIndex], next[index]];
    }

    return next;
}

function createRandomOrder(currentActualIndex: number) {
    const rest = createSequentialOrder().filter((index) => index !== currentActualIndex);
    return [currentActualIndex, ...shuffleNumbers(rest)];
}

function formatSeconds(seconds: number) {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return "0:00";
    }

    const safeSeconds = Math.floor(seconds);
    const minutes = Math.floor(safeSeconds / 60);
    const restSeconds = `${safeSeconds % 60}`.padStart(2, "0");

    return `${minutes}:${restSeconds}`;
}

function getProgressText(
    currentTime: number,
    duration: number | null,
    fallbackDuration: string,
) {
    const durationText =
        duration !== null && Number.isFinite(duration)
            ? formatSeconds(duration)
            : fallbackDuration;

    return `${formatSeconds(currentTime)} / ${durationText}`;
}

function findLyricIndex(
    lyrics: LoadedAudioTrack["assets"]["lyrics"],
    currentTime: number,
) {
    let foundIndex = 0;

    for (let index = 0; index < lyrics.length; index += 1) {
        if (currentTime >= lyrics[index].timeFormat) {
            foundIndex = index;
        } else {
            break;
        }
    }

    return foundIndex;
}

export function useAudioPlayerAside() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const shouldAutoplayRef = useRef(false);
    const volumeBeforeMuteRef = useRef(25);
    const isPlayingRef = useRef(false);
    const isUserSeekingRef = useRef(false);
    const currentLyricIndexRef = useRef(0);
    const trackRequestIdRef = useRef(0);

    const [isUnfolded, setIsUnfolded] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
    const [isVolumePanelOpen, setIsVolumePanelOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(25);
    const [playMode, setPlayMode] = useState<PlayMode>("wholeOnce");
    const [playOrder, setPlayOrder] = useState(createSequentialOrder);
    const [playIndex, setPlayIndex] = useState(0);
    const [playbackPercent, setPlaybackPercent] = useState(0);
    const [progressText, setProgressText] = useState("0:00 / 0:00");
    const [currentTrack, setCurrentTrack] = useState<LoadedAudioTrack | null>(null);
    const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
    const [playlistCoverMap, setPlaylistCoverMap] = useState<Record<string, string>>({});

    const currentActualIndex = playOrder[playIndex] ?? 0;
    const currentMeta = currentTrack?.meta ?? PlayAudioList[currentActualIndex];
    const lyrics = currentTrack?.assets.lyrics ?? [];
    const coverUrl =
        currentTrack?.assets.coverUrl ??
        playlistCoverMap[currentMeta?.filename ?? PlayAudioList[0].filename];

    const syncPlaybackState = useEffectEvent(() => {
        const audio = audioRef.current;
        if (!audio) {
            return;
        }

        const duration =
            Number.isFinite(audio.duration) && audio.duration > 0
                ? audio.duration
                : null;
        const currentTime = audio.currentTime;

        if (!isUserSeekingRef.current && duration) {
            setPlaybackPercent((currentTime / duration) * 100);
        }

        setProgressText(
            getProgressText(currentTime, duration, currentMeta?.duration ?? "0:00"),
        );

        if (lyrics.length === 0) {
            return;
        }

        const nextLyricIndex = findLyricIndex(lyrics, currentTime);
        if (nextLyricIndex !== currentLyricIndexRef.current) {
            currentLyricIndexRef.current = nextLyricIndex;
            setCurrentLyricIndex(nextLyricIndex);
        }
    });

    useEffect(() => {
        let cancelled = false;

        loadAllCoverUrls(PlayAudioList.map((item) => item.filename))
            .then((coverMap) => {
                if (cancelled) {
                    return;
                }

                startTransition(() => {
                    setPlaylistCoverMap(coverMap);
                });
            })
            .catch(() => {
                // Ignore cover preload failures and let the active track load path surface issues.
            });

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) {
            return;
        }

        audio.loop = playMode === "singleCircle";
    }, [playMode]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) {
            return;
        }

        audio.volume = volume / 100;
        audio.muted = isMuted;
    }, [isMuted, volume]);

    useEffect(() => {
        let cancelled = false;
        const requestId = trackRequestIdRef.current + 1;
        trackRequestIdRef.current = requestId;

        const nextMeta = PlayAudioList[currentActualIndex];
        if (!nextMeta) {
            return;
        }

        setIsLoading(true);
        setPlaybackPercent(0);
        setProgressText(`0:00 / ${nextMeta.duration ?? "0:00"}`);
        setCurrentLyricIndex(0);
        currentLyricIndexRef.current = 0;

        loadTrackAssets(nextMeta.filename)
            .then((assets) => {
                if (cancelled || requestId !== trackRequestIdRef.current) {
                    return;
                }

                startTransition(() => {
                    setCurrentTrack({
                        actualIndex: currentActualIndex,
                        meta: nextMeta,
                        assets,
                    });
                });

                const audio = audioRef.current;
                if (!audio) {
                    return;
                }

                audio.pause();
                audio.src = assets.audioUrl;
                audio.currentTime = 0;
                audio.loop = playMode === "singleCircle";
                audio.load();
            })
            .catch(() => {
                if (cancelled || requestId !== trackRequestIdRef.current) {
                    return;
                }

                setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [currentActualIndex]);

    useEffect(() => {
        if (!isPlaying) {
            return;
        }

        let animationFrameId = 0;

        const tick = () => {
            syncPlaybackState();
            animationFrameId = requestAnimationFrame(tick);
        };

        animationFrameId = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isPlaying, syncPlaybackState]);

    function requestTrackChange(nextOrderIndex: number, autoplay = isPlayingRef.current) {
        shouldAutoplayRef.current = autoplay;
        setPlayIndex(nextOrderIndex);
    }

    function handleAudioPlay() {
        isPlayingRef.current = true;
        setIsPlaying(true);
    }

    function handleAudioPause() {
        isPlayingRef.current = false;
        setIsPlaying(false);
    }

    function handleAudioCanPlay() {
        setIsLoading(false);
        syncPlaybackState();

        const audio = audioRef.current;
        if (!audio) {
            return;
        }

        if (shouldAutoplayRef.current) {
            void audio.play().catch(() => {
                isPlayingRef.current = false;
                setIsPlaying(false);
            });
            return;
        }

        audio.pause();
    }

    function handleAudioTimeUpdate() {
        syncPlaybackState();
    }

    function handleAudioLoadedMetadata() {
        syncPlaybackState();
    }

    function handleAudioEnded() {
        if (playMode === "wholeOnce") {
            if (playIndex === playOrder.length - 1) {
                shouldAutoplayRef.current = false;
                setPlayIndex(0);
                return;
            }

            requestTrackChange(playIndex + 1, true);
            return;
        }

        if (playMode === "wholeCircle") {
            requestTrackChange((playIndex + 1) % playOrder.length, true);
            return;
        }

        if (playMode === "random") {
            if (playOrder.length <= 1) {
                shouldAutoplayRef.current = false;
                return;
            }

            if (playIndex < playOrder.length - 1) {
                requestTrackChange(playIndex + 1, true);
                return;
            }

            const nextOrder = createRandomOrder(currentActualIndex);
            shouldAutoplayRef.current = true;
            setPlayOrder(nextOrder);
            setPlayIndex(nextOrder.length > 1 ? 1 : 0);
        }
    }

    function toggleUnfold() {
        setIsUnfolded((prev) => !prev);

        if (isUnfolded) {
            setIsDetailOpen(false);
            setIsPlaylistOpen(false);
        }
    }

    function toggleDetailPanel() {
        setIsDetailOpen((prev) => !prev);
    }

    function togglePlaylist() {
        setIsPlaylistOpen((prev) => !prev);
    }

    function openVolumePanel() {
        setIsVolumePanelOpen(true);
    }

    function closeVolumePanel() {
        setIsVolumePanelOpen(false);
    }

    function togglePlay() {
        const audio = audioRef.current;
        if (!audio || isLoading) {
            return;
        }

        if (audio.paused) {
            shouldAutoplayRef.current = true;
            void audio.play();
            return;
        }

        audio.pause();
    }

    function playPrevious() {
        if (isLoading) {
            return;
        }

        const nextIndex = playIndex === 0 ? playOrder.length - 1 : playIndex - 1;
        requestTrackChange(nextIndex, true);
    }

    function playNext() {
        if (isLoading) {
            return;
        }

        const nextIndex = playIndex === playOrder.length - 1 ? 0 : playIndex + 1;
        requestTrackChange(nextIndex, true);
    }

    function cyclePlayMode() {
        const currentModeIndex = PLAY_MODES.indexOf(playMode);
        const nextMode = PLAY_MODES[(currentModeIndex + 1) % PLAY_MODES.length];
        const actualIndex = playOrder[playIndex] ?? 0;

        setPlayMode(nextMode);

        if (nextMode === "random") {
            setPlayOrder(createRandomOrder(actualIndex));
            setPlayIndex(0);
            return;
        }

        if (playMode === "random") {
            setPlayOrder(createSequentialOrder());
            setPlayIndex(actualIndex);
        }
    }

    function selectTrack(orderIndex: number) {
        if (orderIndex === playIndex) {
            const audio = audioRef.current;
            if (audio?.paused) {
                shouldAutoplayRef.current = true;
                void audio.play();
            }
            return;
        }

        const audio = audioRef.current;
        requestTrackChange(orderIndex, audio ? !audio.paused : isPlayingRef.current);
    }

    function updateVolume(nextVolume: number) {
        const safeVolume = Math.max(0, Math.min(100, Math.round(nextVolume)));

        if (safeVolume > 0) {
            volumeBeforeMuteRef.current = safeVolume;
            setIsMuted(false);
        } else {
            setIsMuted(true);
        }

        setVolume(safeVolume);
    }

    function toggleMute() {
        if (isMuted || volume === 0) {
            const restoredVolume = volumeBeforeMuteRef.current || 25;
            setIsMuted(false);
            setVolume(restoredVolume);
            return;
        }

        volumeBeforeMuteRef.current = volume;
        setIsMuted(true);
        setVolume(0);
    }

    function previewSeek(nextPercent: number) {
        const safePercent = Math.max(0, Math.min(100, nextPercent));
        const audio = audioRef.current;
        const duration =
            audio && Number.isFinite(audio.duration) && audio.duration > 0
                ? audio.duration
                : null;

        isUserSeekingRef.current = true;
        setPlaybackPercent(safePercent);
        setProgressText(
            getProgressText(
                ((duration ?? 0) * safePercent) / 100,
                duration,
                currentMeta?.duration ?? "0:00",
            ),
        );
    }

    function commitSeek(nextPercent: number) {
        const safePercent = Math.max(0, Math.min(100, nextPercent));
        const audio = audioRef.current;

        if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) {
            isUserSeekingRef.current = false;
            return;
        }

        audio.currentTime = (audio.duration * safePercent) / 100;
        isUserSeekingRef.current = false;
        setPlaybackPercent(safePercent);
        syncPlaybackState();
    }

    const playlistItems: PlaylistViewItem[] = playOrder.map((actualIndex, orderIndex) => ({
        actualIndex,
        orderIndex,
        meta: PlayAudioList[actualIndex],
        coverUrl: playlistCoverMap[PlayAudioList[actualIndex].filename],
        isActive: orderIndex === playIndex,
    }));

    return {
        audioRef,
        closeVolumePanel,
        commitSeek,
        coverUrl,
        currentLyricIndex,
        currentMeta,
        currentTrack,
        cyclePlayMode,
        handleAudioCanPlay,
        handleAudioEnded,
        handleAudioLoadedMetadata,
        handleAudioPause,
        handleAudioPlay,
        handleAudioTimeUpdate,
        isDetailOpen,
        isLoading,
        isMuted,
        isPlaying,
        isPlaylistOpen,
        isUnfolded,
        isVolumePanelOpen,
        lyrics,
        openVolumePanel,
        playMode,
        playNext,
        playPrevious,
        playbackPercent,
        playlistItems,
        previewSeek,
        progressText,
        selectTrack,
        toggleDetailPanel,
        toggleMute,
        togglePlay,
        togglePlaylist,
        toggleUnfold,
        updateVolume,
        volume,
    };
}
