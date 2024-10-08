import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface NutritionChartProps {
  nutrition: {
    protein: number;
    fat: number;
    carbs: number;
  };
}

export function NutritionChart({ nutrition }: NutritionChartProps) {
  const data = [
    { name: 'Protein', value: nutrition.protein },
    { name: 'Fat', value: nutrition.fat },
    { name: 'Carbs', value: nutrition.carbs },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}