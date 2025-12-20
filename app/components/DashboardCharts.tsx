'use client';

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';

// --- MOCK DATA ---
const lineChartData = [
    { name: 'Jan', uv: 400 },
    { name: 'Feb', uv: 300 },
    { name: 'Mar', uv: 500 },
    { name: 'Apr', uv: 280 },
    { name: 'May', uv: 590 },
    { name: 'Jun', uv: 320 },
    { name: 'Jul', uv: 450 },
    { name: 'Aug', uv: 380 },
    { name: 'Sep', uv: 600 },
    { name: 'Oct', uv: 500 },
    { name: 'Nov', uv: 350 },
    { name: 'Dec', uv: 480 },
];

const productPieData = [
    { name: 'Tenda Segitiga/Kerucut', value: 100, color: '#3D2B1F' }, // Dark Brown
    { name: 'Tenda Barak', value: 12, color: '#5E4B35' }, // Medium Brown
    { name: 'Tongkat', value: 18, color: '#8B6E4A' }, // Light Brown
    { name: 'Tali', value: 22, color: '#A68B6C' }, // Beige
    { name: 'Matras', value: 26, color: '#C7A682' }, // Lighter Beige
    { name: 'Paket Lengkap', value: 42, color: '#DBC29E' }, // Pale Beige
];

const memberPieData = [
    { name: 'Angkatan 18 - 2021', value: 5, color: '#3D2B1F' },
    { name: 'Angkatan 19 - 2022', value: 4, color: '#5E4B35' },
    { name: 'Angkatan 20 - 2023', value: 10, color: '#8B6E4A' },
    { name: 'Angkatan 21 - 2024', value: 15, color: '#A68B6C' },
    { name: 'Angkatan 22 - 2025', value: 18, color: '#C7A682' },
];

export default function DashboardCharts() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Line Chart Section */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-[#8B6E4A]">Statistik</h3>
                        <p className="text-xs text-gray-400">Penyewaan Produk</p>
                    </div>
                    <div className="flex gap-2">
                        <select className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-500 outline-none">
                            <option>Produk</option>
                        </select>
                        <select className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-500 outline-none">
                            <option>2023</option>
                        </select>
                    </div>
                </div>

                <div className="h-[300px] w-full relative">
                    {/* Overlay Label Example */}
                    <div className="absolute top-[20%] left-[55%] bg-[#8B6E4A] text-white text-xs px-3 py-1 rounded-full z-10 shadow-lg">
                        100 produk
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={lineChartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="uv"
                                stroke="#C7A682"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 6, fill: '#8B6E4A', stroke: 'white', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Pie Charts Section */}
            <div className="flex flex-col gap-6">
                {/* Chart Produk */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-semibold text-[#8B6E4A]">Chart</h3>
                            <p className="text-[10px] text-gray-400">Produk</p>
                        </div>
                        <select className="text-[10px] border border-gray-200 rounded px-2 py-1 text-gray-500 outline-none bg-[#8B6E4A] text-white border-none">
                            <option>2024</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative w-32 h-32">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={productPieData}
                                        innerRadius={40}
                                        outerRadius={60}
                                        paddingAngle={0}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {productPieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-lg font-bold text-gray-700">220</span>
                                <span className="text-[10px] text-gray-400">Produk</span>
                            </div>
                        </div>
                        <div className="flex-1 space-y-1">
                            {productPieData.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-[9px]">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-gray-500 truncate max-w-[80px]">{item.name}</span>
                                    </div>
                                    <span className="font-medium bg-[#8B6E4A] text-white px-1 rounded text-[8px]">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Chart Anggota */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-semibold text-[#8B6E4A]">Chart</h3>
                            <p className="text-[10px] text-gray-400">Anggota Aktif</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative w-32 h-32">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={memberPieData}
                                        innerRadius={40}
                                        outerRadius={60}
                                        paddingAngle={0}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {memberPieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-lg font-bold text-gray-700">52</span>
                                <span className="text-[10px] text-gray-400">Anggota</span>
                            </div>
                        </div>
                        <div className="flex-1 space-y-1">
                            {memberPieData.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-[9px]">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-gray-500 truncate max-w-[80px]">{item.name}</span>
                                    </div>
                                    <span className="font-medium bg-[#8B6E4A] text-white px-1 rounded text-[8px]">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
