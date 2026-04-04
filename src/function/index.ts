// 导入查询状态
import { mediaDevice } from "@/stores/theme";
async function fetchBackgroundImage(): Promise<string> {
    // 手动进行fetch封面图，提前加载背景图，提升用户体验
    //随机获取图片，图片序号在1-10之间
    const randomNum = Math.floor(Math.random() * 10) + 1;
    const url = await fetch(`/backgrounds/${mediaDevice || 'desktop'}/${randomNum}.png`)
        .then((res) => res.blob())
        .then((blob) => {
            const createdUrl = URL.createObjectURL(blob);
            return createdUrl;
        });
    return url;
}

export {
    // 这里可以放一些全局的函数或者变量
    fetchBackgroundImage
}
