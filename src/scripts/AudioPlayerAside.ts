export function initAudioPlayAside() {
    // 获取到侧边栏的整体元素
    const aside_container: HTMLElement = document.querySelector(
        '[data-ui="aside-container"]',
    ) as HTMLElement;

    // 获取到隐藏的音乐控件
    const audio_entity: HTMLAudioElement = document.querySelector(
        '[data-audio="hidden"]',
    ) as HTMLAudioElement;

    // 获取到播放音乐功能面板容器
    const audio_container: HTMLElement = aside_container.querySelector(
        '[data-ui="audio-aside-container"]',
    ) as HTMLElement;

    // 获取到侧边折叠栏展开隐藏控件
    const aside_folder: HTMLElement = aside_container.querySelector(
        '[data-ui="aside-folder"]',
    ) as HTMLElement;

    // 获取到侧边折叠栏展开隐藏控件当中的svg
    const audio_aside_bar_el: HTMLElement = aside_folder.querySelector(
        '[data-ui="audio-aside-svg"]',
    ) as HTMLElement;

    // 获取到播放和暂停交替的按钮容器
    const audio_player_btn_container = audio_container.querySelector(
        '[data-ui="audio-player-btn-container"]',
    ) as HTMLElement;

    // 获取到播放按钮和暂停按钮
    const audio_player_btns =
        audio_player_btn_container.querySelectorAll<HTMLElement>("svg");

    // 获取播放模式按钮容器
    const audio_play_mode_container: HTMLElement =
        audio_container.querySelector(
            '[data-ui="audio-play-mode-container"]',
        ) as HTMLElement;

    // 获取到播放模式按钮的list
    const audio_play_mode_list =
        audio_play_mode_container.querySelectorAll<HTMLElement>("svg");

    // 获取到封面
    const cover_image: HTMLElement = audio_container.querySelector(
        '[data-ui="audio-cover-image"]',
    ) as HTMLElement;

    // 音量键
    const volume_container: HTMLAudioElement = audio_container.querySelector(
        '[data-ui="volume-button-container"]',
    ) as HTMLAudioElement;

    // 静音和音量图标
    const volume_button_list = volume_container.querySelectorAll<HTMLElement>(
        '[data-ui="volume-button"]',
    );

    // 音量调节
    const volume_slider: HTMLInputElement = audio_container.querySelector(
        '[data-ui="audio-volume-slider"]',
    ) as HTMLInputElement;

    // 获取到音量字体
    const volume_font: HTMLElement = audio_container.querySelector(
        '[data-ui="digital-volume-display"]',
    ) as HTMLElement;

    // 获取到播放条
    const playback_bar: HTMLInputElement = audio_container.querySelector(
        '[data-ui="playback-bar"]',
    ) as HTMLInputElement;

    // 获取到播放条文字
    const play_progress_text: HTMLElement = audio_container.querySelector(
        '[data-ui="play-progress-text"',
    ) as HTMLElement;

    // 添加按钮监听展开
    aside_folder.addEventListener("click", () => {
        if (!audio_aside_bar_el.classList.contains("rotate-[-180deg]")) {
            audio_aside_bar_el.classList.add("rotate-[-180deg]");

            aside_container.dataset.unfold = "true";
        } else {
            aside_container.dataset.unfold = "false";
            audio_aside_bar_el.classList.remove("rotate-[-180deg]");
        }
    });

    // 播放等操作
    audio_player_btn_container.addEventListener("click", () => {
        if (audio_entity.paused) {
            audio_player_btns[0].dataset.hidden = "true";
            audio_player_btns[1].dataset.hidden = "false";
            audio_entity.play();
            cover_image.dataset.rotate = "true";
        } else {
            audio_player_btns[0].dataset.hidden = "false";
            audio_player_btns[1].dataset.hidden = "true";
            audio_entity.pause();
            cover_image.dataset.rotate = "false";
        }
    });

    let origin_volume: number = 50;

    // 调整音量等
    volume_container.addEventListener("click", () => {
        audio_entity.muted = !audio_entity.muted;
        if (volume_button_list[0].dataset.hidden === "true") {
            // 音量键为hidden，那么此时就是静音
            volume_button_list[0].dataset.hidden = "false";
            volume_button_list[1].dataset.hidden = "true";

            // 赋值
            volume_slider.value = origin_volume.toString();
            audio_entity.volume = origin_volume / 100;
            volume_font.innerText = origin_volume + "%";
            // 音量调节
        } else {
            volume_button_list[0].dataset.hidden = "true";
            volume_button_list[1].dataset.hidden = "false";

            // 记录下当前音量

            origin_volume = Number(volume_slider.value);
            volume_slider.value = "0";
            audio_entity.volume = 0;
            volume_font.innerText = 0 + "%";
        }
    });

    volume_container.addEventListener("mouseenter", () => { });

    let playMode: String = "wholeOnce";
    // 调整播放模式
    // 顺序->单曲循环->列表循环->随机播放
    audio_play_mode_container.addEventListener("click", () => {
        if (playMode === "wholeOnce") {
            playMode = "singleCircle";
            audio_play_mode_list[0].dataset.hidden = "true";
            audio_play_mode_list[1].dataset.hidden = "false";
        } else if (playMode === "singleCircle") {
            playMode = "wholeCircle";
            audio_play_mode_list[1].dataset.hidden = "true";
            audio_play_mode_list[2].dataset.hidden = "false";
        } else if (playMode === "wholeCircle") {
            playMode = "random";
            audio_play_mode_list[2].dataset.hidden = "true";
            audio_play_mode_list[3].dataset.hidden = "false";
        } else {
            playMode = "wholeOnce";
            audio_play_mode_list[3].dataset.hidden = "true";
            audio_play_mode_list[0].dataset.hidden = "false";
        }
    });

    // 滑动
    volume_slider.addEventListener("input", (e: HTMLInputElement | any) => {
        const volume_value = Number(e.target.value) / 100;

        // 调整音量
        audio_entity.volume = volume_value;

        origin_volume = volume_value * 100;

        // 改变数值
        volume_font.innerText = (volume_value * 100).toFixed(0) + "%";
    });
    let picked_play_time = 0
    let total_played_time = audio_entity.duration
    let total_played_time_by_min: String = Math.floor(total_played_time / 60000).toString() + ((total_played_time % 60000) / 1000).toFixed(2)

    // 歌曲进度滑动
    playback_bar.addEventListener("input", (e: HTMLInputElement | any) => {
        // 只改变当前时间戳和记录的值
        const current_time = (e.target.value / 100) * total_played_time


        // 记录的时间
        play_progress_text.innerText = Math.floor(current_time / 60000).toString() + ((current_time % 60000) / 1000).toFixed(2) + " / " + total_played_time_by_min
    });
}
