import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", consultations: 400, downloads: 240 },
  { name: "Fév", consultations: 300, downloads: 139 },
  { name: "Mar", consultations: 520, downloads: 280 },
  { name: "Avr", consultations: 478, downloads: 390 },
  { name: "Mai", consultations: 589, downloads: 480 },
  { name: "Juin", consultations: 639, downloads: 380 },
  { name: "Juil", consultations: 780, downloads: 430 },
];

function ConsultationsChart() {
  return (
    <div className="stat-card h-80">
      <h3 className="mb-4 text-lg font-semibold">
        Consultations & Téléchargements
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorConsultations" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(37, 70%, 47%)"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="hsl(37, 70%, 47%)"
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(27, 47%, 21%)"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="hsl(27, 47%, 21%)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(37, 30%, 85%)" />
          <XAxis dataKey="name" stroke="hsl(0, 0%, 46%)" fontSize={12} />
          <YAxis stroke="hsl(0, 0%, 46%)" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(0, 0%, 100%)",
              border: "1px solid hsl(37, 30%, 85%)",
              borderRadius: "8px",
            }}
          />
          <Area
            type="monotone"
            dataKey="consultations"
            stroke="hsl(37, 70%, 47%)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorConsultations)"
            name="Consultations"
          />
          <Area
            type="monotone"
            dataKey="downloads"
            stroke="hsl(27, 47%, 21%)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorDownloads)"
            name="Téléchargements"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ConsultationsChart;
