import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Cell
} from "recharts";

export default function FinanceChart({
    income,
    expense,
    savings = 0,
}) {

    const data = [
        { name: "Ingresos", value: income },
        { name: "Gastos",   value: expense },
        { name: "Ahorros",  value: savings },
    ];

    const colors = {
        "Ingresos": "#10b981",
        "Gastos":   "#ef4444",
        "Ahorros":  "#818cf8",
    };

    return (
        <div
            className="glass-card"
            style={{ marginTop: "24px", height: "350px" }}
        >
            <h3>📊 Ingresos vs Gastos vs Ahorros</h3>

            <ResponsiveContainer width="100%" height="90%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>

                    <XAxis
                        dataKey="name"
                        stroke="var(--text-h)"
                        tick={{ fill: "var(--text-h)" }}
                    />

                    <YAxis
                        stroke="var(--text-h)"
                        tick={{ fill: "var(--text-h)" }}
                    />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: "var(--bg)",
                            borderColor: "var(--border)",
                            borderRadius: "8px",
                            color: "var(--text)"
                        }}
                        itemStyle={{ color: "var(--text)" }}
                        formatter={(value) => [`${Number(value).toFixed(2)} €`]}
                    />

                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={colors[entry.name]}
                            />
                        ))}
                    </Bar>

                </BarChart>
            </ResponsiveContainer>

        </div>
    );
}