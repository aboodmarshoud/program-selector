import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function MultiProgramRadarChart({ data, programs, radarColor }: any) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--ink)", fontSize: 13, fontWeight: 700 }} />
        {programs.map((program: any, index: number) => (
          <Radar
            key={program.id}
            name={program.name}
            dataKey={`P${index}`}
            stroke={radarColor(index)}
            fill={radarColor(index)}
            fillOpacity={0.22}
            strokeWidth={2.5}
          />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function DimensionRadarChart({ data, programName, userColor, programColor }: any) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--ink)", fontSize: 13, fontWeight: 700 }} />
        <Radar name="احتياجك" dataKey="A" stroke={userColor} fill={userColor} fillOpacity={0.26} strokeWidth={2} />
        <Radar name={programName} dataKey="B" stroke={programColor} fill={programColor} fillOpacity={0.2} strokeWidth={2.5} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function AnalyticsTimelineChart({ data }: any) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 12, right: 24, left: 10, bottom: 8 }}>
        <defs>
          <linearGradient id="analyticsAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#176b54" stopOpacity={0.34} />
            <stop offset="95%" stopColor="#176b54" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="name" tick={{ fill: "var(--muted)", fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fill: "var(--muted)", fontSize: 12 }} />
        <Tooltip />
        <Area type="monotone" dataKey="value" stroke="#176b54" strokeWidth={2.5} fill="url(#analyticsAreaFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function AnalyticsDonutChart({ data, colors }: any) {
  return (
    <ResponsiveContainer width="100%" height={230}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={58} outerRadius={88} paddingAngle={3}>
          {data.map((item: any, index: number) => (
            <Cell key={item.name} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function AnalyticsBarChart({ data, height, valueSuffix, formatMetricValue }: any) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis type="number" allowDecimals tick={{ fill: "var(--muted)", fontSize: 12 }} />
        <YAxis dataKey="name" type="category" width={160} tick={{ fill: "var(--ink)", fontSize: 12 }} />
        <Tooltip formatter={(value: any, _name: any, item: any) => item?.payload?.displayValue || `${formatMetricValue(value)}${valueSuffix}`} />
        <Bar dataKey="value" fill="#176b54" radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
