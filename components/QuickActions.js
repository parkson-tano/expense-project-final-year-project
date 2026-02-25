// components/QuickActions.js
'use client'

import { PlusIcon, ArrowUpTrayIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

export default function QuickActions() {
    const actions = [
        { icon: PlusIcon, label: 'Add Money', color: 'bg-green-500', onClick: () => { } },
        { icon: ArrowUpTrayIcon, label: 'Send', color: 'bg-blue-500', onClick: () => { } },
        { icon: DocumentTextIcon, label: 'Statements', color: 'bg-purple-500', onClick: () => { } },
    ]

    return (
        <div className="flex space-x-2">
            {actions.map((action, index) => (
                <button
                    key={index}
                    onClick={action.onClick}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors group"
                >
                    <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium hidden sm:block">{action.label}</span>
                </button>
            ))}
        </div>
    )
}