export type singleLyric = {
    time: string;
    timeFormat: number;
    lyric: string;
    trans: string;
};
export type lyricType = Array<singleLyric>;
;
export type singleAudioSrc = {
    coverUrl: string;
    lyric: string;
    audioUrl: string;
};

// 定义播放列表面板上的可视数据部分
export type playPanelSingleAudioInfo = {
    coverUrl: string;
    title: string;
    artist: string;
    duration: string;
};