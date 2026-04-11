export async function openFullScreen(el: HTMLElement) {
    await el.requestFullscreen().then(() => {
        return true;
    }).catch((err) => {
       throw new Error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    })
}

export async function exitFullScreen() {
    await document.exitFullscreen();
}


