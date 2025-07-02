import { useState, useMemo } from "react";
import { Card } from "react-bootstrap";
import InfoPopover from "./InsightModel";
import Image from "next/image";

const PLACEHOLDER = "/images/img-placeholder.jpg";

export default function TopAdCreative({ ad = [] }) {
  if (!ad.length) {
    return (
      <Card className="p-3 h-100 campign-card d-flex justify-content-center">
        <div className="text-center text-muted">No ad creative data</div>
      </Card>
    );
  }

  const sortedAds = useMemo(() => {
    return [...ad].sort((a, b) => {
      if (b.clicks !== a.clicks) return b.clicks - a.clicks;
      const ctrA = a.impressions ? a.clicks / a.impressions : 0;
      const ctrB = b.impressions ? b.clicks / b.impressions : 0;
      return ctrB - ctrA;
    });
  }, [ad]);

  const [srcMap, setSrcMap] = useState(() => {
    const initial = {};
    sortedAds.forEach((item, idx) => {
      initial[idx] = item.thumbnail_url || PLACEHOLDER;
    });
    return initial;
  });

  return (
    <Card className="p-3 h-100 campign-card d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-semibold mb-0">Top‑Performing Ad</h6>
        <InfoPopover
          title="Top Ad – AI Insight"
          description="This ad drives the most clicks vs its objective."
          placement="bottom"
        />
      </div>

      {sortedAds.map((creative, index) => {
        const ctr = creative.impressions
          ? ((creative.clicks / creative.impressions) * 100).toFixed(2)
          : "—";

        return (
          <div
            className="d-flex gap-3 align-items-start performing-card"
            key={`${creative.ad_name}-${index}`}
          >
            <Image
              src={srcMap[index]}
              alt={creative.ad_name}
              width={120}
              height={120}
              className="rounded"
              style={{ objectFit: "cover" }}
              placeholder="blur"
              blurDataURL={PLACEHOLDER}
              onError={() =>
                setSrcMap((prev) => ({ ...prev, [index]: PLACEHOLDER }))
              }
            />

            <div className="flex-grow-1">
              <h6 className="fw-semibold mb-1">{creative.ad_name}</h6>
              <div className="small text-muted mb-2">
                {creative.platform} • {creative.objective}
              </div>

              <div className="d-flex flex-wrap gap-4 small value-text">
                <span>
                  <strong>{creative.clicks.toLocaleString()}</strong> clicks
                </span>
                <span>
                  <strong>{creative.impressions.toLocaleString()}</strong> impr.
                </span>
                <span>
                  CTR&nbsp;
                  <strong>{ctr}%</strong>
                </span>
              </div>
            </div>

            {creative.preview_url && (
              <a
                href={creative.preview_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-primary d-flex align-items-center"
              >
                <i className="bi bi-box-arrow-up-right me-1" /> View
              </a>
            )}
          </div>
        );
      })}
    </Card>
  );
}

// import { useState } from "react";
// import { Card } from "react-bootstrap";
// import InfoPopover from "./InsightModel";
// import Image from "next/image";

// const PLACEHOLDER = "/images/img-placeholder.jpg";

// export default function TopAdCreative({ ad }) {
//   if (!ad?.length) {
//     return (
//       <Card className="p-3 h-100 campign-card d-flex justify-content-center">
//         <div className="text-center text-muted">No ad creative data</div>
//       </Card>
//     );
//   }

//   const [src, setSrc] = useState(ad.thumbnail_url || PLACEHOLDER);

//   return (
//     <Card className="p-3 h-100 campign-card d-flex flex-column">
//       {/* header */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h6 className="fw-semibold mb-0">Top‑Performing Ad</h6>
//         <InfoPopover
//           title="Top Ad – AI Insight"
//           description="This ad drives the most clicks vs its objective."
//           placement="bottom"
//         />
//       </div>
//       {ad?.map((ad, index) => {
//         const ctr = ad.impressions
//           ? ((ad.clicks / ad.impressions) * 100).toFixed(2)
//           : "—";
//         return (
//           <div className="d-flex gap-3 align-items-start performing-card" key={index}>
//             {/* thumbnail (120 × 120) */}
//             <Image
//               src={src}
//               alt={ad.ad_name}
//               width={120}
//               height={120}
//               className="rounded"
//               style={{ objectFit: "cover" }}
//               placeholder="blur"
//               blurDataURL={PLACEHOLDER}
//               onError={() => setSrc(PLACEHOLDER)}
//             />

//             <div className="flex-grow-1">
//               <h6 className="fw-semibold mb-1">{ad.ad_name}</h6>
//               <div className="small text-muted mb-2">
//                 {ad.platform} • {ad.objective}
//               </div>

//               <div className="d-flex flex-wrap gap-4 small value-text">
//                 <span>
//                   <strong>{ad.clicks.toLocaleString()}</strong> clicks
//                 </span>
//                 <span>
//                   <strong>{ad.impressions.toLocaleString()}</strong> impr.
//                 </span>
//                 <span>
//                   CTR&nbsp;
//                   <strong>{ctr}%</strong>
//                 </span>
//               </div>
//             </div>

//             {ad.preview_url && (
//               <a
//                 href={ad.preview_url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="btn btn-sm btn-outline-primary d-flex align-items-center"
//               >
//                 <i className="bi bi-box-arrow-up-right me-1" /> View
//               </a>
//             )}
//           </div>
//         );
//       })}
//     </Card>
//   );
// }
