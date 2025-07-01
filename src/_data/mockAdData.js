export const ads = [
  {
    ad_id: "fb‑001",
    ad_name: "Summer Flash Sale",
    platform: "facebook",
    objective: "Traffic",
    impressions: 82_450,
    clicks: 3_214,
    thumbnail_url:
      "https://via.placeholder.com/120x120.png?text=Summer+Sale",
    preview_url: "https://facebook.com/ads/fb-001",
  },
  {
    ad_id: "gg‑002",
    ad_name: "Free Trial – Search",
    platform: "google",
    objective: "Leads",
    impressions: 91_320,
    clicks: 5_876,
    thumbnail_url:
      "https://via.placeholder.com/120x120.png?text=Free+Trial",
    preview_url: "https://ads.google.com/gg-002",
  },
  {
    ad_id: "li‑003",
    ad_name: "Whitepaper Download",
    platform: "linkedin",
    objective: "Conversions",
    impressions: 25_900,
    clicks: 1_120,
    thumbnail_url:
      "https://via.placeholder.com/120x120.png?text=Whitepaper",
    preview_url: "https://linkedin.com/ads/li-003",
  },
];

/* Pick whichever row you consider “best” (here: most clicks) */
export const topAd = ads.reduce((best, ad) =>
  ad.clicks > best.clicks ? ad : best
);
