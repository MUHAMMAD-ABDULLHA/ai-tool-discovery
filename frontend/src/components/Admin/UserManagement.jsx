import React, { useState, useEffect } from 'react';
import { getAllUsers, banUser, unbanUser, verifyCreator, unverifyCreator } from '../../api/adminApi';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [banModal, setBanModal] = useState(null);
    const [banReason, setBanReason] = useState('');

    const [detailModal, setDetailModal] = useState(null);

    useEffect(() => {
        loadUsers();
    }, [filter, search]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.search = search;
            if (filter !== 'all') params[filter] = 'true';

            const data = await getAllUsers(params);
            setUsers(data.users || []);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBan = async () => {
        if (!banReason.trim()) return alert('Please provide a ban reason');
        try {
            await banUser(banModal, banReason);
            setBanModal(null);
            setBanReason('');
            loadUsers();
            alert('User banned');
        } catch (error) {
            alert(error.response?.data?.message || 'Error banning user');
        }
    };

    return (
        <div className="w-full">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
                <h1 className="text-black text-3xl font-bold mb-2">👥 User Management</h1>
                <p className="text-black/80">Manage users, creators, and permissions</p>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 min-w-[250px] px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-black placeholder-white/60"
                />
                <div className="flex gap-2">
                    {['all', 'isBanned', 'isVerified'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg capitalize transition-all ${filter === f
                                ? 'bg-accent-faded text-primary font-medium'
                                : 'bg-white/10 text-neutral-600 hover:bg-neutral-100'
                                }`}
                        >
                            {f === 'all' ? 'All' : f.replace('is', '')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl overflow-x-auto">
                {loading ? <p className="text-center py-8">Loading...</p> : users.length === 0 ? <p className="text-center py-8 text-neutral-500">No users found</p> : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-neutral-200">
                                <th className="text-left p-3 font-semibold">User</th>
                                <th className="text-left p-3 font-semibold">Email</th>
                                <th className="text-left p-3 font-semibold">Role</th>
                                <th className="text-left p-3 font-semibold">Status</th>
                                <th className="text-left p-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border-b border-neutral-100 hover:bg-neutral-50">
                                    <td className="p-3">
                                        <div className="font-semibold">{user.name}</div>
                                        {user.isVerified && <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">✓ Verified</span>}
                                    </td>
                                    <td className="p-3 text-sm">{user.email}</td>
                                    <td className="p-3"><span className="px-2 py-1 bg-neutral-100 rounded text-xs">{user.role}</span></td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs ${user.isBanned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                            {user.isBanned ? 'Banned' : user.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setDetailModal(user)}
                                                className="px-3 py-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded text-sm"
                                            >
                                                Details
                                            </button>
                                            {user.isBanned ? (
                                                <button onClick={async () => { await unbanUser(user._id); loadUsers(); }} className="px-3 py-1 bg-green-500 hover:bg-green-600 text-black rounded text-sm">Unban</button>
                                            ) : (
                                                <button onClick={() => setBanModal(user._id)} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-black rounded text-sm">Ban</button>
                                            )}
                                            {user.isVerified ? (
                                                <button onClick={async () => { await unverifyCreator(user._id); loadUsers(); }} className="px-3 py-1 bg-neutral-400 hover:bg-neutral-500 text-black rounded text-sm">Unverify</button>
                                            ) : (
                                                <button onClick={async () => { await verifyCreator(user._id); loadUsers(); }} className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-black rounded text-sm">Verify</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* User Detail Modal */}
            {detailModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setDetailModal(null)}>
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setDetailModal(null)} className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-700">✕</button>
                        <h2 className="text-2xl font-bold mb-6 text-neutral-900">User Details</h2>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl text-primary font-bold">
                                    {detailModal.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900">{detailModal.name}</h3>
                                    <p className="text-neutral-500">{detailModal.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-neutral-50 rounded-lg">
                                    <div className="text-xs text-neutral-500 uppercase font-semibold mb-1">Role</div>
                                    <div className="font-medium capitalize">{detailModal.role}</div>
                                </div>
                                <div className="p-3 bg-neutral-50 rounded-lg">
                                    <div className="text-xs text-neutral-500 uppercase font-semibold mb-1">Status</div>
                                    <div className={`font-medium capitalize ${detailModal.isBanned ? 'text-red-600' : 'text-green-600'}`}>
                                        {detailModal.isBanned ? 'Banned' : detailModal.status}
                                    </div>
                                </div>
                                <div className="p-3 bg-neutral-50 rounded-lg">
                                    <div className="text-xs text-neutral-500 uppercase font-semibold mb-1">Joined</div>
                                    <div className="font-medium">{new Date(detailModal.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div className="p-3 bg-neutral-50 rounded-lg">
                                    <div className="text-xs text-neutral-500 uppercase font-semibold mb-1">Last Login</div>
                                    <div className="font-medium">{detailModal.lastLogin ? new Date(detailModal.lastLogin).toLocaleDateString() : 'Never'}</div>
                                </div>
                            </div>

                            {detailModal.isBanned && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-lg mt-4">
                                    <div className="text-xs text-red-800 uppercase font-semibold mb-1">Ban Reason</div>
                                    <p className="text-red-700 text-sm">{detailModal.bannedReason}</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button onClick={() => setDetailModal(null)} className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {banModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setBanModal(null)}>
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-4">Ban User</h2>
                        <textarea
                            placeholder="Reason for ban..."
                            value={banReason}
                            onChange={(e) => setBanReason(e.target.value)}
                            rows="4"
                            className="w-full p-3 border border-neutral-300 rounded-lg mb-4"
                        />
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setBanModal(null)} className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 rounded-lg">Cancel</button>
                            <button onClick={handleBan} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-black rounded-lg">Ban User</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
