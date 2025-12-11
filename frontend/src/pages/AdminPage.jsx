import React, { useState, useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import { adminAPI, categoriesAPI } from '../services/api'
import { Plus, Edit, Trash2, Search, X } from 'lucide-react'
import '../styles/components/AdminPage.css'

function TabButton({ active, onClick, children }) {
    return (
        <button
            onClick={onClick}
            className={`tab-btn ${active ? 'active' : ''}`}
        >
            {children}
        </button>
    )
}

function AdminPage() {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState('users') // 'users' or 'categories'

    // State for Users
    const [users, setUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const [userSearch, setUserSearch] = useState('')

    // State for Categories
    const [categories, setCategories] = useState([])
    const [filteredCategories, setFilteredCategories] = useState([])
    const [categorySearch, setCategorySearch] = useState('')
    const [editingCategory, setEditingCategory] = useState(null)
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
    const [categoryForm, setCategoryForm] = useState({ name: '', description: '', expiryInMonths: '' })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (activeTab === 'users') filterUsers()
        else if (activeTab === 'categories') filterCategories()
    }, [userSearch, categorySearch, users, categories, activeTab])

    async function fetchData() {
        setLoading(true)
        setError(null)
        try {
            if (activeTab === 'users') {
                const res = await adminAPI.getAllUsers()
                setUsers(res.data)
            } else {
                const res = await categoriesAPI.getAll()
                setCategories(res.data)
            }
        } catch (err) {
            setError('Failed to fetch data')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // Refetch when switching tabs
    useEffect(() => {
        fetchData()
    }, [activeTab])

    function filterUsers() {
        if (!userSearch) {
            setFilteredUsers(users)
            return
        }
        const lower = userSearch.toLowerCase()
        const filtered = users.filter(u =>
            u.name?.toLowerCase().includes(lower) ||
            u.email?.toLowerCase().includes(lower) ||
            u.id?.toString().includes(lower)
        )
        setFilteredUsers(filtered)
    }

    function filterCategories() {
        if (!categorySearch) {
            setFilteredCategories(categories)
            return
        }
        const lower = categorySearch.toLowerCase()
        const filtered = categories.filter(c =>
            c.name?.toLowerCase().includes(lower)
        )
        setFilteredCategories(filtered)
    }

    async function toggleUserStatus(userId, currentStatus) {
        try {
            const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
            await adminAPI.updateUserStatus(userId, newStatus)
            // Update locally (optimistic or refetch)
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u))
        } catch (err) {
            console.error('Failed to update status', err)
            alert('Failed to update status')
        }
    }

    async function handleDeleteCategory(id) {
        if (!confirm('Are you sure you want to delete this category?')) return
        try {
            await categoriesAPI.delete(id)
            setCategories(prev => prev.filter(c => c.id !== id))
        } catch (err) {
            console.error(err)
            alert('Failed to delete category')
        }
    }

    function openCategoryModal(category = null) {
        if (category) {
            setEditingCategory(category)
            setCategoryForm({
                name: category.name,
                expiryInMonths: category.expiryInMonths || ''
            })
        } else {
            setEditingCategory(null)
            setCategoryForm({ name: '', expiryInMonths: '' })
        }
        setIsCategoryModalOpen(true)
    }

    async function handleCategorySubmit(e) {
        e.preventDefault()
        try {
            if (editingCategory) {
                await categoriesAPI.update(editingCategory.id, categoryForm)
            } else {
                await categoriesAPI.add(categoryForm)
            }
            setIsCategoryModalOpen(false)
            fetchData() // Refresh list
        } catch (err) {
            console.error(err)
            alert('Failed to save category')
        }
    }

    return (
        <div className="admin-container">

            {/* Header & Admin Details */}
            <div className="admin-header">
                <div className="admin-title">
                    <h1>Admin Dashboard</h1>
                    <p>Manage users and service categories</p>
                </div>

                {/* Admin Card */}
                <div className="admin-card">
                    <span className="name">{user?.name || 'Admin'}</span>
                    <span className="email">{user?.email}</span>
                    <span className="role">{user?.role || 'ADMIN'}</span>
                    <span className="contact">{user?.contactNo}</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="admin-tabs">
                <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
                    Users Management
                </TabButton>
                <TabButton active={activeTab === 'categories'} onClick={() => setActiveTab('categories')}>
                    Categories Management
                </TabButton>
            </div>

            {/* Content */}
            <div className="admin-content">

                {/* USERS TAB */}
                {activeTab === 'users' && (
                    <div className="tab-content">
                        <div className="toolbar">
                            <div className="search-container">
                                <Search className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    className="search-input"
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Vehicles</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="7" style={{ textAlign: 'center' }}>Loading...</td></tr>
                                    ) : filteredUsers.length === 0 ? (
                                        <tr><td colSpan="7" style={{ textAlign: 'center' }}>No users found.</td></tr>
                                    ) : filteredUsers.map(u => (
                                        <tr key={u.id}>
                                            <td style={{ fontWeight: '500' }}>#{u.id}</td>
                                            <td>{u.name}</td>
                                            <td>{u.email}</td>
                                            <td>
                                                <span className={`badge ${u.role === 'ADMIN' ? 'badge-admin' : 'badge-user'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            {/* Use totalVehicleCount if available, else fallback to vehicles.length */}
                                            <td>{u.totalVehicleCount !== undefined ? u.totalVehicleCount : (u.vehicles?.length || 0)}</td>
                                            <td>
                                                <span className={`badge ${u.status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}`}>
                                                    {u.status}
                                                </span>
                                            </td>
                                            <td>
                                                {u.role !== 'ADMIN' && (
                                                    <button
                                                        onClick={() => toggleUserStatus(u.id, u.status)}
                                                        className={`btn-action ${u.status === 'ACTIVE' ? 'btn-deactivate' : 'btn-activate'}`}
                                                    >
                                                        {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* CATEGORIES TAB */}
                {activeTab === 'categories' && (
                    <div className="tab-content">
                        <div className="toolbar">
                            <div className="search-container">
                                <Search className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    className="search-input"
                                    value={categorySearch}
                                    onChange={(e) => setCategorySearch(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => openCategoryModal()}
                                className="btn-primary"
                            >
                                <Plus size={18} /> Add Category
                            </button>
                        </div>

                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Expiry (Months)</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading...</td></tr>
                                    ) : filteredCategories.length === 0 ? (
                                        <tr><td colSpan="5" style={{ textAlign: 'center' }}>No categories found.</td></tr>
                                    ) : filteredCategories.map(c => (
                                        <tr key={c.id}>
                                            <td style={{ fontWeight: '500' }}>#{c.id}</td>
                                            <td>{c.name}</td>
                                            <td>{c.expiryInMonths !== undefined ? c.expiryInMonths : '-'}</td>
                                            <td>
                                                <button
                                                    onClick={() => openCategoryModal(c)}
                                                    className="btn-icon edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCategory(c.id)}
                                                    className="btn-icon delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Category Modal */}
            {isCategoryModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>
                                {editingCategory ? 'Edit Category' : 'New Category'}
                            </h2>
                            <button
                                onClick={() => setIsCategoryModalOpen(false)}
                                className="btn-icon"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCategorySubmit}>
                            <div className="form-group">
                                <label>Category Name</label>
                                <input
                                    required
                                    type="text"
                                    className="form-input"
                                    value={categoryForm.name}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={categoryForm.description}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Expiry Period (Months)</label>
                                <input
                                    required
                                    type="number"
                                    className="form-input"
                                    value={categoryForm.expiryInMonths}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, expiryInMonths: e.target.value })}
                                />
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setIsCategoryModalOpen(false)}
                                    className="btn-cancel"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                >
                                    {editingCategory ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminPage
