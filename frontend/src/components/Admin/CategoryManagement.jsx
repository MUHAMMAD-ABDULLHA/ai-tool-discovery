import React, { useState, useEffect } from 'react';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../api/adminApi';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        icon: ''
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const data = await getAllCategories();
            setCategories(data.categories || []);
        } catch (error) {
            console.error('Error loading categories:', error);
            alert('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                slug: category.slug,
                description: category.description || '',
                icon: category.icon || ''
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                slug: '',
                description: '',
                icon: ''
            });
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingCategory(null);
        setFormData({ name: '', slug: '', description: '', icon: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await updateCategory(editingCategory._id, formData);
                alert('Category updated successfully');
            } else {
                await createCategory(formData);
                alert('Category created successfully');
            }
            handleCloseModal();
            loadCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            alert(error.response?.data?.message || 'Error saving category');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        try {
            await deleteCategory(id);
            alert('Category deleted successfully');
            loadCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            alert(error.response?.data?.message || 'Error deleting category');
        }
    };

    // Auto-generate slug from name
    const handleNameChange = (e) => {
        const name = e.target.value;
        if (!editingCategory) {
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            setFormData(prev => ({ ...prev, name, slug }));
        } else {
            setFormData(prev => ({ ...prev, name }));
        }
    };

    return (
        <div className="w-full">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20 flex justify-between items-center">
                <div>
                    <h1 className="text-black text-3xl font-bold mb-2">📁 Category Management</h1>
                    <p className="text-black/80">Manage tool categories and classifications</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                    + Add Category
                </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl overflow-x-auto">
                {loading ? (
                    <p className="text-center py-8">Loading...</p>
                ) : categories.length === 0 ? (
                    <p className="text-center py-8 text-neutral-500">No categories found. Create one to get started.</p>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-neutral-200">
                                <th className="text-left p-3 font-semibold w-16">Icon</th>
                                <th className="text-left p-3 font-semibold">Name</th>
                                <th className="text-left p-3 font-semibold">Slug</th>
                                <th className="text-left p-3 font-semibold">Description</th>
                                <th className="text-center p-3 font-semibold w-24">Tools</th>
                                <th className="text-right p-3 font-semibold w-32">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category._id} className="border-b border-neutral-100 hover:bg-neutral-50">
                                    <td className="p-3 text-2xl">{category.icon}</td>
                                    <td className="p-3 font-semibold">{category.name}</td>
                                    <td className="p-3 text-neutral-500 font-mono text-sm">{category.slug}</td>
                                    <td className="p-3 text-neutral-600 text-sm max-w-xs truncate">{category.description}</td>
                                    <td className="p-3 text-center">
                                        <span className="bg-neutral-100 px-2 py-1 rounded text-xs font-medium">
                                            {category.toolCount || 0}
                                        </span>
                                    </td>
                                    <td className="p-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenModal(category)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Create/Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleCloseModal}>
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-6 text-neutral-900">
                            {editingCategory ? 'Edit Category' : 'New Category'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleNameChange}
                                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="e.g. Chatbots"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Slug</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                                    placeholder="e.g. chatbots"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Icon (Emoji)</label>
                                <input
                                    type="text"
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="e.g. 🤖"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    rows="3"
                                    placeholder="Optional description..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium"
                                >
                                    {editingCategory ? 'Save Changes' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;
