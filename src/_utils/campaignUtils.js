import rawData from "../_data/campaign.json";

/* ─── helpers ───────────────────────────────────────────── */
const slug = (s = "") => s.trim().toLowerCase();
const sum = (rows, key) => rows.reduce((t, r) => t + Number(r[key] || 0), 0);

/* enrich once */
const data = rawData.map((r) => ({ ...r, _slug: slug(r.Channel) }));

/* pill list */
export const channels = [
  "All",
  ...Array.from(new Set(data.map((r) => r._slug))).map(
    (c) => c.charAt(0).toUpperCase() + c.slice(1)
  ),
];

/* selector */
export const getData = (ch) =>
  !ch || slug(ch) === "all" ? data : data.filter((r) => r._slug === slug(ch));

/* KPIs */
export const computeKPIs = (rows) => {
  const clicks = sum(rows, "clicks");
  const impr = sum(rows, "impressions");
  const spend = sum(rows, "media_cost");
  const wc = sum(rows, "website_clicks");

  return {
    clicks,
    impressions: impr,
    spend,
    websiteClicks: wc,
    ctr: impr ? (clicks / impr) * 100 : 0,
    cpc: clicks ? spend / clicks : 0,
    cpa: wc ? spend / wc : 0,
  };
};

/* charts + tables */
export const topCampaigns = (rows, n = 10) =>
  [...rows].sort((a, b) => b.clicks - a.clicks).slice(0, n);

export const makeXAxis = (rows) =>
  rows.map((r) => r.campaign_name?.trim() || "N/A");

export const channelPie = (rows) => {
  const map = {};
  rows.forEach((r) => {
    const k = r._slug;
    map[k] = (map[k] || 0) + (r.clicks || 0);
  });
  return { labels: Object.keys(map), series: Object.values(map) };
};

export const deviceBreakdown = () => ({
  labels: ["Desktop", "Mobile", "Tablet"],
  series: [45, 40, 15], // static placeholder
});

export const sessionChannelBreakdown = (rows) => {
  const m = {};
  rows.forEach((r) => {
    m[r._slug] = (m[r._slug] || 0) + (r.clicks || 0);
  });
  return {
    labels: Object.keys(m),
    series: Object.values(m),
    total: Object.values(m).reduce((a, b) => a + b, 0),
  };
};

/* Trezo-style extra widgets  ----------------------------- */
export const browserUsage = () => ({
  labels: ["Chrome", "Safari", "Firefox", "Edge", "Others"],
  series: [45, 25, 15, 10, 5], // must match label count
});

export const keywordStats = (rows) => {
  const map = new Map();
  rows.forEach((r) => {
    const key = r.campaign_name?.trim() || "Unnamed";
    if (!map.has(key)) map.set(key, { name: key, clicks: 0, impressions: 0 });
    const o = map.get(key);
    o.clicks += Number(r.clicks || 0);
    o.impressions += Number(r.impressions || 0);
  });
  return [...map.values()].sort((a, b) => b.clicks - a.clicks).slice(0, 8);
};

export const topPages = (rows) => {
  const map = new Map();
  rows.forEach((r) => {
    const page = r.ad_name?.trim() || "unknown-page";
    if (!map.has(page))
      map.set(page, {
        page,
        source: r.Market?.trim() || "Other",
        views: 0,
        avgTime: `${Math.floor(2 + Math.random() * 4)}m ${Math.floor(
          Math.random() * 55
        )}s`,
        bounce: +(20 + Math.random() * 25).toFixed(1), // number only
      });
    map.get(page).views += Math.round(Number(r.website_clicks || 0));
  });
  return [...map.values()].sort((a, b) => b.views - a.views).slice(0, 6);
};
