import type { lyricType } from "../types";
import type { AudioTrackAssets } from "./types";

const coverModules = import.meta.glob<{
    default: {
        src: string;
    };
}>("@/assets/images/*.png");

const audioModules = import.meta.glob<{ default: string }>(
    "@/assets/audios/*.mp3",
);

const lyricModules = import.meta.glob<{ default: lyricType }>(
    "@/assets/lyrics/*.json",
);

const coverCache = new Map<string, string>();
const audioCache = new Map<string, string>();
const lyricCache = new Map<string, lyricType>();

function getCoverImporter(filename: string) {
    return coverModules[`/src/assets/images/${filename}.png`];
}

function getAudioImporter(filename: string) {
    return audioModules[`/src/assets/audios/${filename}.mp3`];
}

function getLyricImporter(filename: string) {
    return lyricModules[`/src/assets/lyrics/${filename}.json`];
}

export async function loadCoverUrl(filename: string): Promise<string> {
    const cached = coverCache.get(filename);
    if (cached) {
        return cached;
    }

    const importer = getCoverImporter(filename);
    if (!importer) {
        throw new Error(`Missing cover asset for "${filename}"`);
    }

    const module = await importer();
    const coverUrl = module.default.src;
    coverCache.set(filename, coverUrl);
    return coverUrl;
}

export async function loadAudioUrl(filename: string): Promise<string> {
    const cached = audioCache.get(filename);
    if (cached) {
        return cached;
    }

    const importer = getAudioImporter(filename);
    if (!importer) {
        throw new Error(`Missing audio asset for "${filename}"`);
    }

    const module = await importer();
    const audioUrl = module.default;
    audioCache.set(filename, audioUrl);
    return audioUrl;
}

export async function loadLyricData(filename: string): Promise<lyricType> {
    const cached = lyricCache.get(filename);
    if (cached) {
        return cached;
    }

    const importer = getLyricImporter(filename);
    if (!importer) {
        throw new Error(`Missing lyric asset for "${filename}"`);
    }

    const module = await importer();
    const lyricData = module.default;
    lyricCache.set(filename, lyricData);
    return lyricData;
}

export async function loadTrackAssets(
    filename: string,
): Promise<AudioTrackAssets> {
    const [coverUrl, audioUrl, lyrics] = await Promise.all([
        loadCoverUrl(filename),
        loadAudioUrl(filename),
        loadLyricData(filename),
    ]);

    return {
        audioUrl,
        coverUrl,
        lyrics,
    };
}

export async function loadAllCoverUrls(
    filenames: string[],
): Promise<Record<string, string>> {
    const entries = await Promise.all(
        filenames.map(async (filename) => [filename, await loadCoverUrl(filename)]),
    );

    return Object.fromEntries(entries);
}
