    async function fetchBackgroundImage():Promise<string> {
    // 手动进行fetch封面图，提前加载背景图，提升用户体验
    const url = await fetch("https://img.asahinamafuyu.top/")
        .then((res) => res.blob())
        .then((blob) => {
            const createdUrl = URL.createObjectURL(blob);
            return createdUrl;
        });
            return url;
    }

export  {
    // 这里可以放一些全局的函数或者变量
    fetchBackgroundImage
}
