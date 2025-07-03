import { FunnelChart, Funnel, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = [
  "#ff6384", // Impressions
  "#ff9f40", // Clicks
  "#ffcd56", // Leads
  "#4bc0c0", // Conversions
  "#36a2eb", // Revenue
];

const stages = [
  { name: "Impressions", value: 12000, fill: COLORS[0] },
  { name: "Clicks", value: 7800, fill: COLORS[1] },
  { name: "Leads", value: 3400, fill: COLORS[2] },
  { name: "Conversions", value: 850, fill: COLORS[3] },
  { name: "Revenue", value: 120, fill: COLORS[4] },
];

export default function CampaignFunnel() {
  return (
    <div className="d-flex gap-4 mt-5">
      <div className="flex-grow-1">
        <ResponsiveContainer width="100%" height={350}>
          <FunnelChart>
            <Tooltip formatter={(v) => v.toLocaleString()} />
            <Funnel
              data={stages}
              dataKey="value"
              cx="50%"
              cy="50%"
              neckWidth={0}
              neckHeight={0}
              gap={6}
              cornerRadius={4}
              stroke="none"
              isAnimationActive
            />
          </FunnelChart>
        </ResponsiveContainer>
      </div>

      {/* Custom color legend */}
      <div className="d-flex flex-column justify-content-center">
        {stages.map((stage) => (
          <div key={stage.name} className="d-flex align-items-center mb-2">
            <span
              style={{
                display: "inline-block",
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: stage.fill,
                marginRight: 8,
              }}
            />
            <span className="text-muted" style={{ fontSize: 14 }}>
              {stage.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
