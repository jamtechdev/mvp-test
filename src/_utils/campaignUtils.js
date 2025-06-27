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
export const revenueByChannel = () => ({
  labels: ["Google Ads", "Facebook Ads", "LinkedIn", "Email"],
  series: [120000, 95000, 40000, 15000], // revenue (₹ or $)
});

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

/* ------------- data helpers ------------------------------------------------ */
// import rawData from "../_data/campaign.json";

// /* utils */
// const slug   = (s = "") => s.trim().toLowerCase();
// const toNum  = (v) => Number(v || 0);
// const sum    = (arr, key) => arr.reduce((t, r) => t + toNum(r[key]), 0);
// const parseD = (d) => (d ? new Date(d) : null);

// /* one-time enrichment ------------------------------------------------------- */
// const data = rawData.map((r) => ({
//   ...r,
//   _slug   : slug(r.Channel),
//   _camp   : slug(r.campaign_name || ""),
//   _date   : parseD(r.date),
// }));

// /* main selector ------------------------------------------------------------- */
// export const getData = ({ channel = "All", campaign, dateRange } = {}) => {
//   let rows = data;

//   /* filter by channel */
//   if (channel && slug(channel) !== "all") rows = rows.filter((r) => r._slug === slug(channel));

//   /* filter by campaign (string OR array) */
//   if (campaign) {
//     const set = new Set(
//       Array.isArray(campaign) ? campaign.map(slug) : [slug(campaign)]
//     );
//     rows = rows.filter((r) => set.has(r._camp));
//   }

//   /* filter by dateRange = {start: Date|String, end: Date|String} */
//   if (dateRange?.start || dateRange?.end) {
//     const s = dateRange.start ? new Date(dateRange.start) : null;
//     const e = dateRange.end   ? new Date(dateRange.end)   : null;
//     rows = rows.filter((r) => {
//       if (!r._date) return false;
//       if (s && r._date < s) return false;
//       if (e && r._date > e) return false;
//       return true;
//     });
//   }

//   return rows;
// };

// /* list of channels for the filter pills ------------------------------------ */
// export const channels = [
//   "All",
//   ...Array.from(new Set(data.map((r) => r._slug))).map(
//     (c) => c.charAt(0).toUpperCase() + c.slice(1)
//   ),
// ];

// /* -------------------------------------------------------------------------- */
// /* KPI block (now includes leads & revenue + optional targets)                */
// export const computeKPIs = (rows, targets = {}) => {
//   const clicks      = sum(rows, "clicks");
//   const impr        = sum(rows, "impressions");
//   const spend       = sum(rows, "media_cost");
//   const leads       = sum(rows, "leads");
//   const revenue     = sum(rows, "revenue");
//   const conversions = sum(rows, "conversions");

//   return {
//     clicks,
//     impressions : impr,
//     spend,
//     leads,
//     revenue,
//     conversions,
//     ctr : impr ? (clicks / impr) * 100 : 0,
//     cpc : clicks ? spend / clicks : 0,
//     cpa : leads  ? spend / leads  : 0,
//     targets,            // {spend: x, impressions: y, ...} – pass from page
//   };
// };

// /* funnel steps + conversion rates ------------------------------------------ */
// export const buildFunnel = (rows) => {
//   const steps = [
//     { label: "Impressions", value: sum(rows, "impressions") },
//     { label: "Clicks",      value: sum(rows, "clicks") },
//     { label: "Leads",       value: sum(rows, "leads") },
//     { label: "Conversions", value: sum(rows, "conversions") },
//     { label: "Revenue",     value: sum(rows, "revenue") },
//   ];

//   const convRates = steps.slice(1).map((s, i) => {
//     const prev = steps[i].value || 1;
//     return prev ? (s.value / prev) * 100 : 0;
//   });

//   return { steps, convRates };
// };

// /* trend series for dropdown KPI -------------------------------------------- */
// export const buildTrendSeries = (rows, metric = "spend") => {
//   /* group by day */
//   const byDay = new Map();
//   rows.forEach((r) => {
//     if (!r._date) return;
//     const day = r._date.toISOString().slice(0, 10);   // YYYY-MM-DD
//     if (!byDay.has(day)) byDay.set(day, 0);
//     byDay.set(day, byDay.get(day) + toNum(r[metric]));
//   });

//   const dates  = [...byDay.keys()].sort();
//   const values = dates.map((d) => byDay.get(d));

//   return { dates, values };
// };

// /* ad-level performance table ----------------------------------------------- */
// export const adPerformance = (rows, n = 20) => {
//   const map = new Map();

//   rows.forEach((r) => {
//     const adKey = `${r.ad_name}|${r.platform}`;
//     if (!map.has(adKey))
//       map.set(adKey, {
//         ad          : r.ad_name || "Untitled",
//         platform    : r.platform || r.Channel || "Other",
//         objective   : r.objective || "—",
//         clicks      : 0,
//         impressions : 0,
//         leads       : 0,
//         revenue     : 0,
//       });
//     const o = map.get(adKey);
//     o.clicks      += toNum(r.clicks);
//     o.impressions += toNum(r.impressions);
//     o.leads       += toNum(r.leads);
//     o.revenue     += toNum(r.revenue);
//   });

//   /* basic “best vs objective” flag */
//   const rowsArr = [...map.values()].map((r) => ({
//     ...r,
//     perfScore :
//       r.objective?.toLowerCase().includes("lead")
//         ? r.leads
//         : r.objective?.toLowerCase().includes("revenue")
//         ? r.revenue
//         : r.clicks,
//   }));

//   return rowsArr.sort((a, b) => b.perfScore - a.perfScore).slice(0, n);
// };

// /* bar-chart friendly helpers (horizontal) ----------------------------------- */
// export const channelBar = (rows) => {
//   const m = {};
//   rows.forEach((r) => {
//     m[r._slug] = (m[r._slug] || 0) + toNum(r.clicks);
//   });
//   return {
//     labels : Object.keys(m).map((l) => l.toUpperCase()),
//     series : Object.values(m),
//   };
// };

// export const revenueByChannel = (rows) => {
//   const m = {};
//   rows.forEach((r) => {
//     m[r._slug] = (m[r._slug] || 0) + toNum(r.revenue);
//   });
//   return {
//     labels : Object.keys(m).map((l) => l.toUpperCase()),
//     series : Object.values(m),
//   };
// };

// /* legacy helpers kept (topCampaigns, etc.) ---------------------------------- */
// export const topCampaigns = (rows, n = 10) =>
//   [...rows].sort((a, b) => b.clicks - a.clicks).slice(0, n);

// export const makeXAxis = (rows) =>
//   rows.map((r) => r.campaign_name?.trim() || "N/A");

// /* device breakdown placeholder (still used by another section) -------------- */
// export const deviceBreakdown = () => ({
//   labels : ["Desktop", "Mobile", "Tablet"],
//   series : [45, 40, 15],
// });
