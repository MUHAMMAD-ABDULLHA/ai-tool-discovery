import React, { useState, useEffect } from 'react';
import { getAllUsers, banUser, unbanUser, verifyCreator, unverifyCreator } from '../../api/adminApi';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [banModal, setBanModal] = useState(null);
    const [banReason, setBanReason] = useState('');

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
                <h1 className="text-white text-3xl font-bold mb-2">👥 User Management</h1>
                <p className="text-white/80">Manage users, creators, and permissions</p>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 min-w-[250px] px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60"
                />
                <div className="flex gap-2">
                    {['all', 'isBanned', 'isVerified'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg capitalize transition-all ${filter === f
                                ? 'bg-gradient-to-r from-primary to-primary-dark text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
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
                                                onClick={() => alert(`Details:\nID: ${user._id}\nJoined: ${new Date(user.createdAt).toLocaleDateString()}\nLast Login: ${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}`)}
                                                className="px-3 py-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded text-sm"
                                            >
                                                Details
                                            </button>
                                            {user.isBanned ? (
                                                <button onClick={async () => { await unbanUser(user._id); loadUsers(); }} className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm">Unban</button>
                                            ) : (
                                                <button onClick={() => setBanModal(user._id)} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm">Ban</button>
                                            )}
                                            {user.isVerified ? (
                                                <button onClick={async () => { await unverifyCreator(user._id); loadUsers(); }} className="px-3 py-1 bg-neutral-400 hover:bg-neutral-500 text-white rounded text-sm">Unverify</button>
                                            ) : (
                                                <button onClick={async () => { await verifyCreator(user._id); loadUsers(); }} className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm">Verify</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

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
                            <button onClick={handleBan} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg">Ban User</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
