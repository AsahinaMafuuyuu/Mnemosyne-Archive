// 只存：id、标题、歌手、排序
// 体积极小，一开始就全量加载
export interface PlayListItem {
    filename: string;   // 用filename就可以匹配路径，然后进行动态加载了
    title: string;       
    artist: string;
    album: string;
    duration?: string;
}

// {
//   "AiDao": "04:23",
//   "AiPai": "03:38",
//   "EnvyBaby": "02:14",
//   "Loschen": "02:23",
//   "Love": "03:16",
//   "NiceJune": "04:45",
//   "ParasolCider": "03:32",
//   "PurpleSunflower": "04:33",
//   "ThreeColor": "04:22"
// }

export const PlayAudioList: PlayListItem[] = [
    {
        "filename": "AiDao",
        "title": "哀悼、そして日常は続く",
        "artist": "羽累",
        "album": "音楽的同位体 裏命 1st COMPILATION ALBUM パラノーマル vol.3 交響のパラノーマル",
        duration: "04:23"
    },
    {
        "filename": "AiPai",
        "title": "爱派Dancehall",
        "artist": "HIMEHINA",
        "album": "爱派Dancehall",
        duration: "03:38"
    },
    {
        "filename": "EnvyBaby",
        "title": "エンヴィーベイビー (Envy Baby)",
        "artist": "25時、ナイトコードで。/宵崎奏/朝比奈まふゆ/東雲絵名",
        "album": "25時、ナイトコードで。 SEKAI ALBUM vol.3",
        duration: "02:14"
    },
    {
        "filename": "Loschen",
        "title": "Löschen",
        "artist": "BlackY/Risa Yuzuki",
        "album": "Löschen",
        duration: "02:23"
    },
    {
        "filename": "Love",
        "title": "LOVEぃ",
        "artist": "春猿火/ヰ世界情緒",
        "album": "LOVEぃ",
        duration: "03:16"
    },
    {
        "filename": "NiceJune",
        "title": "とても素敵な六月でした",
        "artist": "25時、ナイトコードで。/宵崎奏/朝比奈まふゆ/東雲絵名",
        "album": "25時、ナイトコードで。 SEKAI ALBUM vol.3",
        duration: "04:45"
    },
    {
        "filename": "ParasolCider",
        "title": "パラソルサイダー",
        "artist": "MORE MORE JUMP！",
        "album": "イフ/パラソルサイダー",
        duration: "03:32"
    },
    {
        "filename": "PurpleSunflower",
        "title": "紫色の向日葵 (紫色的向日葵)",
        "artist": "香椎モイミ",
        "album": "紫色の向日葵 (紫色的向日葵)",
        duration: "04:33"
    },
    {
        "filename": "ThreeColor",
        "title": "三色·绘恋 (《三色△绘恋》游戏主题曲)",
        "artist": "云翼星辰",
        "album": "三色△绘恋 OP",
        duration: "04:22"
    }
];