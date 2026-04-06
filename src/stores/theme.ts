type BgState = {
    lastBgUrl: null | string;
    bgUrl: null | string; 
    disabledBtnIsActived: boolean;
    bgBlur: number;
}

const bgState: BgState = {
    lastBgUrl: null,
    bgUrl: null,
    disabledBtnIsActived: false,
    bgBlur: 0,
};

// 仅在浏览器环境初始化
function initBgStateFromStorage() {
    if (typeof window === "undefined") return;
    //   从本地取出disabled-background
    // 等于undefined或者true都表示禁用背景，否则启用背景
    bgState.disabledBtnIsActived = !(localStorage.getItem("disabled-background") === "false");
    //  从本地取出blur
    bgState.bgBlur = Number(localStorage.getItem("background-blur")) || 0;
}

// 设置禁用背景的状态，并将其保存到 localStorage 中
function setDisabledBackground(val: boolean) {
    bgState.disabledBtnIsActived = val;
    if (typeof window !== "undefined") {
        localStorage.setItem("disabled-background", String(val));
    }
}

// 修改背景图片的 URL
function setBgUrl(url: string | null) {
    // 接收一个url
    bgState.bgUrl = url;
    bgState.lastBgUrl = url;
}

// 修改模糊度
function setBgBlur(blur: number) {
    bgState.bgBlur = blur
    localStorage.setItem('background-blur', String(blur))
}

// 媒体状态
let mediaDevice: 'desktop' | 'mobile' | null = null;

function setMediaDevice() {
    if (window.innerWidth / window.innerHeight > 1) {
        mediaDevice = 'desktop';
    } else {
        mediaDevice = 'mobile';
    }
}

// 获取背景图片的URL
async function fetchBackgroundImage(): Promise<string> {
    // 手动进行fetch封面图，提前加载背景图，提升用户体验
    //随机获取图片，图片序号在1-10之间
    const randomNum = Math.floor(Math.random() * 10) + 1;
    const fetchUrl = await fetch(`/backgrounds/${mediaDevice || 'desktop'}/${randomNum}.png`)
        .then((res) => res.blob())
        .then((blob) => {
            const createdUrl = URL.createObjectURL(blob);
            return createdUrl;
        });

    // 赋值给bgState.bgUrl
    bgState.bgUrl = fetchUrl;
    return fetchUrl;
}

// 用来销毁之前的背景图片URL，释放内存
function revokeBackgroundImage() {
    if (bgState.lastBgUrl) {
        URL.revokeObjectURL(bgState.lastBgUrl);
        bgState.lastBgUrl = bgState.bgUrl;
    }
}

export {
    bgState,
    mediaDevice,
    initBgStateFromStorage,
    setDisabledBackground,
    setBgUrl,
    setBgBlur,
    setMediaDevice,
    fetchBackgroundImage,
    revokeBackgroundImage,
}