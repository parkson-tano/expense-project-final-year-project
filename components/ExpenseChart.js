// components/ExpenseChart.js
'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function ExpenseChart() {
    const data = [
        { month: 'Jan', expenses: 2450, income: 5200 },
        { month: 'Feb', expenses: 2800, income: 5200 },
        { month: 'Mar', expenses: 3200, income: 5400 },
        { month: 'Apr', expenses: 2900, income: 5200 },
        { month: 'May', expenses: 3450, income: 5200 },
        { month: 'Jun', expenses: 3100, income: 5500 },
    ]

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                />
                <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    )
}