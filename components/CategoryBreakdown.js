// components/CategoryBreakdown.js
'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

export default function CategoryBreakdown() {
    const data = [
        { name: 'Housing', value: 1200, color: '#3B82F6' },
        { name: 'Food', value: 850, color: '#10B981' },
        { name: 'Transport', value: 400, color: '#F59E0B' },
        { name: 'Entertainment', value: 350, color: '#8B5CF6' },
        { name: 'Utilities', value: 300, color: '#EC4899' },
    ]

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                />
            </PieChart>
        </ResponsiveContainer>
    )
}