import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

export default function FinanceChart({
    income,
    expense,
}) {

    const data = [
        {
            name: "Ingresos",
            value: income,
        },
        {
            name: "Gastos",
            value: expense,
        },
    ];

    return (
        <div
            className="glass-card"
            style={{
                marginTop: "24px",
                height: "350px",
            }}
        >
            <h3>
                📊 Ingresos vs Gastos
            </h3>

            <ResponsiveContainer
                width="100%"
                height="90%"
            >
                <BarChart data={data}>

                    <XAxis dataKey="name" />

                    <YAxis />

                    <Tooltip />

                    <Bar
                        dataKey="value"
                        radius={[8, 8, 0, 0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>
    );
}