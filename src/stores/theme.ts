
export type BgState = {
    bgUrl: null | string; 
    disabledBtnIsActived: boolean;
    bgBlur: number;
}

export const bgState: BgState = {
    bgUrl: null,
    disabledBtnIsActived: false,
    bgBlur: 0,
};

// 仅在浏览器环境初始化
export function initBgStateFromStorage() {
    if (typeof window === "undefined") return;
    //   从本地取出disabled-background
    // 等于undefined或者true都表示禁用背景，否则启用背景
    bgState.disabledBtnIsActived = !(localStorage.getItem("disabled-background") === "false");
    //  从本地取出blur
    bgState.bgBlur = Number(localStorage.getItem("background-blur")) || 0;
}

// 设置禁用背景的状态，并将其保存到 localStorage 中
export function setDisabledBackground(val: boolean) {
    bgState.disabledBtnIsActived = val;
    if (typeof window !== "undefined") {
        localStorage.setItem("disabled-background", String(val));
    }
}

// 修改背景图片的 URL
export function setBgUrl(url: string | null) {
    // 接收一个url
    bgState.bgUrl = url;
}

// 修改模糊度
export function setBgBlur(blur: number) {
    bgState.bgBlur = blur
    localStorage.setItem('background-blur', String(blur))
}

// 媒体状态
export let mediaDevice: 'desktop' | 'mobile' | null = null;

export function setMediaDevice() {
    if (window.innerWidth / window.innerHeight > 1) {
        mediaDevice = 'desktop';
    } else {
        mediaDevice = 'mobile';
    }
}