// app/profile/page.js
export default function Profile() {
    const user = {
        name: "John Doe",
        email: "john.doe@example.com",
        joinDate: "January 2024",
        totalTransactions: 156,
        accountAge: "6 months"
    }

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Profile Info */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl text-white">{user.name.charAt(0)}</span>
                            </div>
                            <h2 className="text-xl font-semibold">{user.name}</h2>
                            <p className="text-gray-600">{user.email}</p>
                        </div>
                        <div className="mt-6 pt-6 border-t">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Member since</span>
                                <span className="font-semibold">{user.joinDate}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Transactions</span>
                                <span className="font-semibold">{user.totalTransactions}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Account age</span>
                                <span className="font-semibold">{user.accountAge}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settings Form */}
                <div className="md:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-6">Account Settings</h2>

                        <form className="space-y-6">
                            <div>
                                <label className="block text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    defaultValue={user.name}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    defaultValue={user.email}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Currency Preference</label>
                                <select className="w-full p-2 border rounded-lg">
                                    <option>USD ($)</option>
                                    <option>EUR (€)</option>
                                    <option>GBP (£)</option>
                                    <option>JPY (¥)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Budget Alert Threshold</label>
                                <input
                                    type="number"
                                    placeholder="Enter amount"
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>

                            <div className="flex space-x-4">
                                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                                    Save Changes
                                </button>
                                <button className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50">
                                    Cancel
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 pt-8 border-t">
                            <h3 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h3>
                            <button className="border border-red-600 text-red-600 px-6 py-2 rounded-lg hover:bg-red-50">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}