export interface UmamiStats {
    pageviews: number;
    visitors: number;
    visits: number;
    bounces: number;
    totaltime: number;
    comparison: {
        pageviews: number;
        visitors: number;
        visits: number;
        bounces: number;
        totaltime: number;
    };
}
export async function getUmamiStats(path?: string): Promise<UmamiStats> {
    const res = await fetch(
        `https://umami-request.woshizhendicai.workers.dev/api/umami/stats${path ? '?path=' + path : ''}`
    )
        .then((res) => res.json())
        .then((data) => {
            return data;
        });

    return res
}
