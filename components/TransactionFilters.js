// components/TransactionFilters.js
'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function TransactionFilters({ filters, onFilterChange }) {
    return (
        <div className="bg-white p-4 rounded-lg border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={filters.search}
                        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex gap-2">
                    <select
                        value={filters.type}
                        onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All</option>
                        <option value="income">Income</option>
                        <option value="expense">Expenses</option>
                    </select>
                </div>
            </div>
        </div>
    )
}