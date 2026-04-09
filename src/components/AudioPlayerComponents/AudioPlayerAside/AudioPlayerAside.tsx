import type { CSSProperties } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
    AsideChevronIcon,
    DetailCollapseIcon,
    NextTrackIcon,
    PauseIcon,
    PlaylistIcon,
    PlayIcon,
    PlayModeIcon,
    PreviousTrackIcon,
    VolumeHighIcon,
    VolumeMuteIcon,
} from "./icons";
import { useAudioPlayerAside } from "./useAudioPlayerAside";

type CSSVariables = CSSProperties & {
    "--bg"?: string;
    "--val"?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

function getRangeStyle(value: number): CSSVariables {
    return {
        "--val": value.toString(),
    };
}

export default function AudioPlayerAside() {
    const {
        audioRef,
        closeVolumePanel,
        commitSeek,
        coverUrl,
        currentLyricIndex,
        currentMeta,
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
    } = useAudioPlayerAside();

    const titleMeasureRef = useRef<HTMLSpanElement | null>(null);
    const titleOuterRef = useRef<HTMLDivElement | null>(null);
    const lyricPanelRef = useRef<HTMLDivElement | null>(null);
    const lyricResumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lyricItemRefs = useRef<Array<HTMLDivElement | null>>([]);

    const [isTitleOverflow, setIsTitleOverflow] = useState(false);
    const [isLyricAutoScrollPaused, setIsLyricAutoScrollPaused] = useState(false);

    useLayoutEffect(() => {
        const measureOverflow = () => {
            if (!titleMeasureRef.current || !titleOuterRef.current) {
                return;
            }

            setIsTitleOverflow(
                titleMeasureRef.current.getBoundingClientRect().width >
                    titleOuterRef.current.getBoundingClientRect().width,
            );
        };

        measureOverflow();

        if (typeof ResizeObserver === "undefined") {
            return;
        }

        const observer = new ResizeObserver(measureOverflow);

        if (titleMeasureRef.current) {
            observer.observe(titleMeasureRef.current);
        }

        if (titleOuterRef.current) {
            observer.observe(titleOuterRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [currentMeta?.title, isUnfolded]);

    useEffect(() => {
        if (isLyricAutoScrollPaused) {
            return;
        }

        const activeLyric = lyricItemRefs.current[currentLyricIndex];
        const lyricPanel = lyricPanelRef.current;

        if (!activeLyric || !lyricPanel) {
            return;
        }

        const nextTop =
            activeLyric.offsetTop -
            lyricPanel.clientHeight / 2 +
            activeLyric.clientHeight / 2;

        lyricPanel.scrollTo({
            top: Math.max(nextTop, 0),
            behavior: "smooth",
        });
    }, [currentLyricIndex, isLyricAutoScrollPaused, lyrics.length]);

    useEffect(() => {
        return () => {
            if (lyricResumeTimerRef.current) {
                clearTimeout(lyricResumeTimerRef.current);
            }
        };
    }, []);

    function pauseLyricAutoScrollTemporarily() {
        setIsLyricAutoScrollPaused(true);

        if (lyricResumeTimerRef.current) {
            clearTimeout(lyricResumeTimerRef.current);
        }

        lyricResumeTimerRef.current = setTimeout(() => {
            setIsLyricAutoScrollPaused(false);
        }, 3000);
    }

    const detailPanelStyle: CSSVariables = {
        "--bg": coverUrl ? `url(${coverUrl})` : "none",
    };

    const currentTitle = currentMeta?.title ?? "";
    const titleText = isTitleOverflow
        ? `${currentTitle}\u00A0\u00A0${currentTitle}`
        : currentTitle;

    return (
        <div
            data-unfold={isUnfolded}
            data-ui="aside-container"
            className="w-fit fixed bottom-0 left-0 flex transition-all ease-in-out duration-1000 max-w-145 unfold:w-[33vw]
            max-[1400px]:unfold:w-[40vw]
            max-[1140px]:unfold:w-[50vw]
            max-[768px]:unfold:w-[70vw]
            max-[550px]:unfold:w-[90vw]
            max-[425px]:unfold:min-w-67.5
            z-999"
        >
            <audio
                ref={audioRef}
                data-ui="real-audio-element"
                onCanPlay={handleAudioCanPlay}
                onEnded={handleAudioEnded}
                onLoadedMetadata={handleAudioLoadedMetadata}
                onPause={handleAudioPause}
                onPlay={handleAudioPlay}
                onTimeUpdate={handleAudioTimeUpdate}
            />

            <div
                data-covermove={isDetailOpen}
                data-ui="unfold-area"
                className="w-0 h-full relative transition-all duration-1000 ease-in-out unfold:w-[calc(33vw-20px)]
                max-[1400px]:unfold:w-[calc(40vw-20px)]
                max-[1140px]:unfold:w-[calc(50vw-20px)]
                max-[768px]:unfold:w-[calc(70vw-20px)]
                max-[550px]:unfold:w-[calc(90vw-20px)]"
            >
                <div
                    data-hidden={!isDetailOpen}
                    data-ui="audio-detail-info-display-container"
                    className="w-full h-80 absolute bottom-full transition-all duration-1000 ease-in-out overflow-hidden rounded-t-[5px]
                    unfold:border-l unfold:border-r border-[#ccc]
                    unfold:border-t
                    flex items-center
                    [background-image:var(--bg)] bg-cover bg-center bg-no-repeat
                    hidden:translate-y-0 hidden:h-0 hidden:border-t-0 saturate-150 backdrop-blur-[15px]"
                    style={detailPanelStyle}
                >
                    <div
                        data-ui="medium-glass-filter"
                        className="w-full transition-all duration-1000 ease-in-out h-80 flex items-center
                        unfold:h-full unfold:bg-[rgba(255,255,255,0.55)] unfold:backdrop-blur-[1px]"
                    >
                        <header
                            data-ui="detail-info-shut-down-panel"
                            className="absolute w-full h-5 top-0 bg-[rgba(255,255,255,0.55)] backdrop-blur-[15px] saturate-150 flex justify-center items-center"
                        >
                            <button
                                type="button"
                                data-ui="click-hidden-detail-panel-icon"
                                className="h-5 flex items-center justify-center text-[#666] transition-colors hover:text-black"
                                onClick={toggleDetailPanel}
                                aria-label="关闭歌曲详情面板"
                            >
                                <DetailCollapseIcon className="h-5 w-5" />
                            </button>
                        </header>

                        <div
                            data-ui="audio-detail-cover-image-container"
                            className="w-[40%] h-full items-center justify-center flex bg-[rgba(255,255,255,0.55)]"
                        >
                            <div
                                data-ui="larger-cover-display"
                                className="w-[60%] aspect-square rounded-[50%] overflow-hidden bg-white/20"
                            >
                                {coverUrl ? (
                                    <img
                                        src={coverUrl}
                                        alt={currentTitle}
                                        data-rotate={isPlaying}
                                        className="w-full h-full rounded-[50%] object-cover animate-cover-rotate [animation-play-state:paused]
                                        rotate:[animation-play-state:running]"
                                    />
                                ) : null}
                            </div>
                        </div>

                        <div
                            data-ui="audio-detail-singer-lyric-info"
                            className="w-[60%] transition-all ease-in-out duration-1000 h-full pr-2.5 bg-[rgba(255,255,255,0.55)] pt-5 flex flex-col justify-center items-start"
                        >
                            <div data-ui="lyric-header-song-info" className="w-full">
                                <div
                                    data-ui="detail-info-about-song-name"
                                    className="h-[27px] overflow-hidden w-full text-[18px] font-bold font-sans"
                                >
                                    {currentMeta?.title}
                                </div>
                                <div className="flex w-full max-[425px]:flex-col">
                                    <div
                                        data-ui="detail-info-about-album-name"
                                        className="flex-1 truncate text-[12px] text-[#ccc]"
                                    >
                                        专辑: {currentMeta?.album}
                                    </div>
                                    <div
                                        data-ui="detail-info-about-singer-name"
                                        className="flex-1 truncate text-[12px] text-[#ccc]"
                                    >
                                        歌手: {currentMeta?.artist}
                                    </div>
                                </div>
                            </div>

                            <div
                                data-ui="audio-lyric-display-container"
                                className="h-[70%] w-[85%] relative overflow-hidden pt-3 fade-vertical"
                            >
                                <div
                                    ref={lyricPanelRef}
                                    data-ui="lyric-real-panel"
                                    className="scrollbar-hidden h-full w-full absolute overflow-scroll text-[14px] z-1 flex flex-col items-start gap-2.5 pt-[30%] pb-[50%]"
                                    onTouchMove={pauseLyricAutoScrollTemporarily}
                                    onWheel={pauseLyricAutoScrollTemporarily}
                                >
                                    {lyrics.map((lyric, index) => (
                                        <div
                                            key={`${lyric.time}-${index}`}
                                            ref={(element) => {
                                                lyricItemRefs.current[index] = element;
                                            }}
                                            className={cx(
                                                "transition-colors duration-300",
                                                index === currentLyricIndex
                                                    ? "text-[black]"
                                                    : "text-[#737d83]",
                                            )}
                                        >
                                            <p>{lyric.lyric}</p>
                                            {lyric.trans ? <p>{lyric.trans}</p> : null}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    data-ui="audio-aside-container"
                    className="relative w-full
                    z-10
                    box-border h-25 p-0 flex items-center gap-0
                    bg-[rgba(255,255,255,0.85)]
                    transition-all duration-1000 ease-in-out
                    backdrop-blur-[3px] border-l-[#ccc] border-l-solid
                    unfold:p-3.75 unfold:gap-5 unfold:border-l
                    border-t border-t-[#ccc] border-t-solid
                    border-b border-b-[#ccc] border-b-solid
                    unfold:rounded-tl-[5px] unfold:rounded-bl-[5px]
                    max-[768px]:unfold:justify-between
                    max-[425px]:gap-0 max-[425px]:justify-between max-[425px]:unfold:p-2.5"
                >
                    <div
                        data-ui="audio-cover-image-container"
                        className="w-0 h-0 rounded-[50%] transition-all duration-1000 ease-[cubic-bezier(0.78,-0.32,0.00,1.34)]
                        unfold:w-20 unfold:h-20
                        max-[1400px]:unfold:w-15 max-[1400px]:unfold:h-15
                        shrink-0"
                    >
                        {coverUrl ? (
                            <img
                                data-rotate={isPlaying}
                                data-ui="audio-cover-image"
                                className="w-0 h-0 relative rounded-[50%] object-cover animate-cover-rotate [animation-play-state:paused]
                                rotate:[animation-play-state:running]
                                transition-all duration-1000 ease-in-out
                                unfold:w-full unfold:h-full cursor-pointer"
                                src={coverUrl}
                                alt={currentTitle}
                                onClick={toggleDetailPanel}
                            />
                        ) : null}
                    </div>

                    <div
                        data-ui="audio-info-display"
                        data-titleoverflow={isTitleOverflow}
                        className="w-0 flex flex-col transition-all duration-1000 ease-in-out justify-between items-start
                        unfold:w-30 overflow-hidden unfold:flex-1 unfold:shrink
                        max-[1400px]:unfold:flex-1 max-[1400px]:unfold:shrink
                        max-[870px]:text-[12px]
                        max-[768px]:text-[16px]
                        max-[425px]:unfold:flex-1 max-[425px]:unfold:shrink-0
                        max-[425px]:unfold:min-w-15"
                    >
                        <div
                            ref={titleOuterRef}
                            data-ui="audio-title-outer-container"
                            className="w-full overflow-x-hidden relative"
                        >
                            <div
                                data-show="audio_title"
                                className="w-0 transition-[width] ease-in-out duration-1000 text-nowrap font-bold text-[calc(1em+2px)]
                                unfold:w-fit
                                titleoverflow:animate-title-scroll"
                            >
                                {titleText}
                            </div>
                            <span
                                ref={titleMeasureRef}
                                className="absolute pointer-events-none opacity-0 text-nowrap font-bold text-[calc(1em+2px)]"
                            >
                                {currentTitle}
                            </span>
                        </div>

                        <div
                            data-show="singer_info"
                            className="w-0 unfold:w-fit block truncate text-[#e8dfdf] transition-all ease-in-out duration-1000
                            max-[1150px]:unfold:w-fit
                            max-[870px]:unfold:w-full max-[870px]:unfold:overflow-clip"
                        >
                            {currentMeta?.artist}
                        </div>
                    </div>

                    <div
                        data-ui="panel-and-play-visualized-bar"
                        className="h-full w-0 flex flex-col justify-end gap-2 items-center transition-all duration-1000
                        pt-1 unfold:w-min-[180px] unfold:w-50 unfold:w-max-[250px] covermove:flex-1
                        max-[1140px]:unfold:w-[170px]
                        max-[870px]:unfold:w-45 max-[870px]:unfold:flex-none
                        max-[768px]:unfold:w-37.5 max-[768px]:unfold:w-min-[150px] max-[768px]:covermove:flex-1
                        max-[425px]:justify-center max-[425px]:covermove:items-center max-[425px]:unfold:w-20 max-[425px]:overflow-hidden max-[425px]:unfold:shrink-0 max-[425px]:covermove:flex-1"
                    >
                        <div
                            data-ui="audio-real-player-hidden"
                            className="w-full h-fit flex items-center justify-between
                            max-[425px]:gap-2 max-[425px]:justify-end max-[425px]:covermove:justify-center"
                        >
                            <button
                                type="button"
                                data-disabled={isLoading}
                                data-hidden={isDetailOpen}
                                data-ui="forward-one"
                                className="overflow-hidden
                                max-[425px]:hidden:hidden
                                disabled:cursor-not-allowed text-black"
                                onClick={playPrevious}
                                aria-label="上一首"
                            >
                                <PreviousTrackIcon className="svg-size max-[768px]:w-5 max-[768px]:h-5" />
                            </button>

                            <button
                                type="button"
                                data-disabled={isLoading}
                                data-ui="audio-player-btn-container"
                                className="relative flex justify-center items-center overflow-hidden
                                disabled:cursor-not-allowed
                                audio-player-btn-container
                                max-[425px]:w-8 max-[425px]:h-8 text-black"
                                onClick={togglePlay}
                                aria-label={isPlaying ? "暂停" : "播放"}
                            >
                                <PlayIcon
                                    data-ui="play-audio-btn"
                                    data-hidden={isPlaying}
                                    className="svg-size relative
                                    hidden:hidden
                                    max-[768px]:w-5 max-[768px]:h-5
                                    max-[425px]:w-7 max-[425px]:h-7"
                                />
                                <PauseIcon
                                    data-ui="pause-audio-btn"
                                    data-hidden={!isPlaying}
                                    className="svg-size relative
                                    hidden:hidden
                                    max-[768px]:w-5 max-[768px]:h-5
                                    max-[425px]:w-7 max-[425px]:h-7"
                                />
                            </button>

                            <button
                                type="button"
                                data-disabled={isLoading}
                                data-hidden={isDetailOpen}
                                data-ui="next-one"
                                className="overflow-hidden
                                max-[425px]:hidden:hidden
                                disabled:cursor-not-allowed text-black"
                                onClick={playNext}
                                aria-label="下一首"
                            >
                                <NextTrackIcon className="svg-size max-[768px]:w-5 max-[768px]:h-5" />
                            </button>

                            <div
                                data-ui="volume-button-container-and-volume-adjust"
                                className="flex relative max-[425px]:hidden"
                                onMouseEnter={openVolumePanel}
                                onMouseLeave={closeVolumePanel}
                            >
                                <button
                                    type="button"
                                    data-ui="volume-button-container"
                                    className="w-0 h-0 transition-all ease-in-out overflow-hidden duration-1000
                                    unfold:w-6.25 unfold:h-6.25
                                    max-[768px]:unfold:w-5 max-[768px]:unfold:h-5 text-black"
                                    onClick={toggleMute}
                                    aria-label={isMuted ? "取消静音" : "静音"}
                                >
                                    <VolumeHighIcon
                                        data-ui="volume-button"
                                        data-hidden={isMuted}
                                        className="svg-size hidden:hidden svg-size-small"
                                    />
                                    <VolumeMuteIcon
                                        data-ui="volume-button"
                                        data-hidden={!isMuted}
                                        className="svg-size hidden:hidden svg-size-small"
                                    />
                                </button>

                                <div
                                    data-ui="volume-control-bar"
                                    data-hidden={!isVolumePanelOpen}
                                    className="w-7 h-30 absolute -top-33 -left-1 transition-all ease-in-out duration-1000 hidden:hidden z-[999]"
                                >
                                    <div className="h-4 w-4 rotate-45 absolute bg-[#676060] rounded-[5px] top-full left-[50%] -translate-x-2 -translate-y-2.25" />
                                    <div className="h-30 w-8 bg-[#676060] -left-0.5 rounded-[5px] relative flex items-end justify-center">
                                        <input
                                            data-ui="audio-volume-slider"
                                            type="range"
                                            min="0"
                                            max="100"
                                            className="-rotate-90 w-22 absolute bottom-15 hover:text-[blue] volume-range-style"
                                            value={volume}
                                            style={getRangeStyle(volume)}
                                            onChange={(event) =>
                                                updateVolume(Number(event.target.value))
                                            }
                                        />
                                        <div
                                            data-ui="digital-volume-display"
                                            className="w-fit text-[0.6rem] text-[white] bottom-1"
                                        >
                                            {volume}%
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                data-ui="audio-play-mode-container"
                                className="flex relative overflow-hidden
                                max-[425px]:hidden:hidden text-black"
                                onClick={cyclePlayMode}
                                aria-label="切换播放模式"
                            >
                                <PlayModeIcon
                                    mode={playMode}
                                    className="svg-size hidden:hidden svg-size-small"
                                />
                            </button>

                            <button
                                type="button"
                                data-ui="audio-play-list-btn-container"
                                className="flex relative overflow-hidden text-black"
                                onClick={togglePlaylist}
                                aria-label="切换播放列表"
                            >
                                <PlaylistIcon
                                    className="svg-size
                                    max-[768px]:w-5 max-[768px]:h-5
                                    max-[425px]:w-7 max-[425px]:h-7"
                                />
                            </button>
                        </div>

                        <div
                            data-hidden={isDetailOpen}
                            data-ui="audio-play-time"
                            className="w-full h-full flex gap-2 overflow-hidden justify-center
                            max-[425px]:hidden:hidden max-[425px]:flex-col max-[425px]:items-center max-[425px]:pt-1"
                        >
                            <input
                                data-ui="playback-bar"
                                type="range"
                                min="0"
                                max="100"
                                className="play-time-schedule-range-style w-[calc(95%-60px)]
                                max-[425px]:w-full"
                                value={playbackPercent}
                                style={getRangeStyle(playbackPercent)}
                                onChange={(event) =>
                                    previewSeek(Number(event.target.value))
                                }
                                onMouseUp={(event) =>
                                    commitSeek(Number(event.currentTarget.value))
                                }
                                onTouchEnd={(event) =>
                                    commitSeek(Number(event.currentTarget.value))
                                }
                            />
                            <div
                                data-ui="play-progress-text"
                                className="text-[12px] flex items-center text-center truncate
                                max-[425px]:text-[10px]"
                            >
                                {progressText}
                            </div>
                        </div>
                    </div>
                </div>

                <aside
                    data-hidden={!isPlaylistOpen}
                    data-ui="play-list-visual-panel"
                    className="w-[60%] h-75 flex flex-col rounded-[10px] p-0 overflow-hidden border-[#ccc] absolute right-0 bg-[rgba(0,0,0,.4)] saturate-100 backdrop-blur-[12px] bottom-full transition-all duration-1000 ease-in-out
                    covermove:rounded-tr-none covermove:rounded-br-none z-0
                    unfold:p-2 unfold:border
                    hidden:h-0 hidden:border-0 hidden:pt-0 hidden:pb-0"
                >
                    <header
                        data-ui="play-array-header"
                        className="text-[16px] text-[#ccc] whitespace-nowrap"
                    >
                        播放列表
                    </header>
                    <div className="overflow-auto play-array-scrollbar">
                        <ul
                            data-ui="real-play-array-container"
                            className="flex flex-1 flex-col items-center justify-center gap-[10px]"
                        >
                            {playlistItems.map((item) => (
                                <li key={`${item.meta.filename}-${item.orderIndex}`} className="w-full">
                                    <button
                                        type="button"
                                        className={cx(
                                            "cursor-pointer w-full flex gap-1 items-center rounded-[6px] px-1 py-0.5 transition-colors",
                                            item.isActive
                                                ? "text-red-300 bg-[#ccc]/10"
                                                : "text-white/90 hover:bg-[#ccc]/10",
                                        )}
                                        onDoubleClick={() => selectTrack(item.orderIndex)}
                                    >
                                        {item.coverUrl ? (
                                            <img
                                                src={item.coverUrl}
                                                className="min-w-8 max-h-8 border border-[#black] w-8 aspect-square rounded-[5px] object-cover"
                                                alt={item.meta.title}
                                            />
                                        ) : (
                                            <div className="min-w-8 max-h-8 w-8 aspect-square rounded-[5px] bg-white/20" />
                                        )}
                                        <div className="flex flex-col flex-1 text-[14px] overflow-hidden text-left">
                                            <span className="w-full truncate">{item.meta.title}</span>
                                            <span className="w-full truncate">{item.meta.artist}</span>
                                        </div>
                                        <span className="flex justify-center items-center text-[10px]">
                                            {item.meta.duration}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>

            <button
                type="button"
                data-ui="aside-folder"
                className="w-5 h-25 bg-[#faf8f8] flex justify-center items-center border border-[#ccc] border-solid overflow-hidden rounded-r-[5px]"
                onClick={toggleUnfold}
                aria-label={isUnfolded ? "收起播放器侧栏" : "展开播放器侧栏"}
            >
                <AsideChevronIcon
                    data-ui="audio-aside-svg"
                    className={cx(
                        "h-7.5 w-7.5 font-[1000] fill-[#ccc] transition-all duration-1000 ease-linear",
                        isUnfolded && "rotate-[-180deg]",
                    )}
                />
            </button>
        </div>
    );
}
