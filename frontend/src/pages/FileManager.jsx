import React, { useState, useEffect, useRef } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import Toast from '../components/Toast';
import api from '../services/api';
import '../file-manager.css';
import '../dashboard.css';

const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const FileManager = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [fmSidebarOpen, setFmSidebarOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [files, setFiles] = useState([]);
    const [folders, setFolders] = useState([]);
    const [currentFolder, setCurrentFolder] = useState('');
    const [loading, setLoading] = useState(true);
    const [toasts, setToasts] = useState([]);
    const [newFolderModal, setNewFolderModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const fileInputRef = useRef(null);

    const addToast = (msg, type = 'success') => setToasts(prev => [...prev, { id: Date.now(), message: msg, type }]);
    const dismissToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    useEffect(() => {
        fetchFolders();
    }, []);

    useEffect(() => {
        fetchFiles();
    }, [currentFolder]);

    const fetchFolders = async () => {
        try {
            const { data } = await api.get('/uploads/folders');
            setFolders(data.data || []);
        } catch {
            // silently ignore
        }
    };

    const fetchFiles = async () => {
        try {
            setLoading(true);
            const url = currentFolder ? `/uploads?folder=${currentFolder}` : '/uploads';
            const { data } = await api.get(url);
            setFiles(data.data || []);
        } catch {
            addToast('Failed to load files', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles || selectedFiles.length === 0) return;

        const formData = new FormData();
        Array.from(selectedFiles).forEach(file => formData.append('files', file));

        try {
            const url = currentFolder ? `/uploads?folder=${currentFolder}` : '/uploads';
            const { data } = await api.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            if (data.success) {
                addToast(`${selectedFiles.length} file(s) uploaded!`, 'success');
                fetchFiles();
            }
        } catch {
            addToast('Upload failed', 'error');
        }
        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDelete = async (filename) => {
        if (!window.confirm(`Delete "${filename}"?`)) return;
        try {
            const url = currentFolder
                ? `/uploads/${filename}?folder=${currentFolder}`
                : `/uploads/${filename}`;
            const { data } = await api.delete(url);
            if (data.success) {
                addToast('File deleted', 'success');
                setFiles(files.filter(f => f.name !== filename));
            }
        } catch {
            addToast('Delete failed', 'error');
        }
    };

    const handleCreateFolder = async (e) => {
        e.preventDefault();
        if (!newFolderName.trim()) return;
        try {
            await api.post('/uploads/folders', { name: newFolderName.trim() });
            addToast(`Folder "${newFolderName.trim()}" created!`, 'success');
            setNewFolderName('');
            setNewFolderModal(false);
            fetchFolders();
        } catch (err) {
            addToast(err?.response?.data?.message || 'Could not create folder', 'error');
        }
    };

    const handleDeleteFolder = async (slug, name) => {
        if (!window.confirm(`Delete folder "${name}" and all its contents? This cannot be undone.`)) return;
        try {
            await api.delete(`/uploads/folders/${slug}`);
            addToast(`Folder deleted`, 'success');
            if (currentFolder === slug) setCurrentFolder('');
            fetchFolders();
        } catch {
            addToast('Failed to delete folder', 'error');
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files?.length > 0) {
            const formData = new FormData();
            Array.from(e.dataTransfer.files).forEach(file => formData.append('files', file));
            try {
                const url = currentFolder ? `/uploads?folder=${currentFolder}` : '/uploads';
                const { data } = await api.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                if (data.success) {
                    addToast(`${e.dataTransfer.files.length} file(s) uploaded!`, 'success');
                    fetchFiles();
                }
            } catch {
                addToast('Upload failed', 'error');
            }
        }
    };

    const handleDragEvent = (e) => { e.preventDefault(); e.stopPropagation(); };

    const formatSize = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const isImage = (filename) => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(filename);

    const getFileUrl = (f) => `${BASE_URL}/api${f.url}`;

    const visibleFiles = searchTerm
        ? files.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : files;

    return (
        <div style={{ backgroundColor: 'var(--dash-bg)', minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif", color: 'var(--dash-text-main)' }}>
            <Toast messages={toasts} onDismiss={dismissToast} />
            <AdminSidebar open={sidebarOpen} />

            <main className="main-content">
                <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="File Manager" />

                <div className="fm-layout" style={{ height: 'calc(100vh - 70px)' }}>

                    {/* ── Left Folder Tree Panel ── */}
                    <div className={`fm-sidebar ${fmSidebarOpen ? 'open' : ''}`}>
                        <div className="fm-sidebar-header">
                            <span style={{ fontWeight: 600, fontSize: '13px' }}>Storage Explorer</span>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                <button
                                    onClick={() => setNewFolderModal(true)}
                                    title="New Folder"
                                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', padding: '4px 8px', color: 'inherit', cursor: 'pointer', fontSize: '14px' }}>
                                    <i className="ri-folder-add-line" />
                                </button>
                                <button className="icon-btn small" style={{ display: window.innerWidth <= 1024 ? 'block' : 'none' }} onClick={() => setFmSidebarOpen(false)}>
                                    <i className="ri-close-line" />
                                </button>
                            </div>
                        </div>
                        <div className="fm-tree">
                            {/* Root */}
                            <div
                                className={`tree-row ${currentFolder === '' ? 'active' : ''}`}
                                onClick={() => setCurrentFolder('')}
                                style={{ cursor: 'pointer' }}>
                                <div className="tree-toggle"><i className="ri-arrow-right-s-fill" /></div>
                                <i className="ri-server-fill tree-icon" />
                                <span className="tree-label" style={{ fontWeight: 600 }}>All Uploads</span>
                            </div>
                            {/* Sub-folders */}
                            {folders.map(f => (
                                <div key={f.slug} style={{ display: 'flex', alignItems: 'center', paddingLeft: '16px' }}>
                                    <div
                                        className={`tree-row ${currentFolder === f.slug ? 'active' : ''}`}
                                        onClick={() => setCurrentFolder(f.slug)}
                                        style={{ flex: 1, cursor: 'pointer' }}>
                                        <div className="tree-toggle" />
                                        <i className="ri-folder-fill tree-icon" style={{ color: '#f59e0b' }} />
                                        <span className="tree-label">{f.name}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteFolder(f.slug, f.name)}
                                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px', fontSize: '13px', opacity: 0.7, flexShrink: 0 }}
                                        title="Delete folder">
                                        <i className="ri-delete-bin-line" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Main File Area ── */}
                    <div className="fm-main">
                        <div className="fm-toolbar">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <button className="icon-btn small" style={{ display: window.innerWidth <= 1024 ? 'block' : 'none' }} onClick={() => setFmSidebarOpen(!fmSidebarOpen)}>
                                    <i className="ri-menu-unfold-line" />
                                </button>
                                <div className="breadcrumbs">
                                    <span className="bc-item" style={{ cursor: 'pointer' }} onClick={() => setCurrentFolder('')}>All Uploads</span>
                                    {currentFolder && (
                                        <>
                                            <i className="ri-arrow-right-s-line bc-sep" />
                                            <span className="bc-item">{currentFolder}</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="toolbar-actions">
                                <div className="search-input">
                                    <i className="ri-search-line" />
                                    <input
                                        type="text"
                                        placeholder="Search files..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="action-divider" />
                                <button className="btn" onClick={() => setNewFolderModal(true)}
                                    style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)', color: 'var(--dash-text-main)', display: 'flex', alignItems: 'center', gap: '6px', padding: '0.45rem 0.875rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                                    <i className="ri-folder-add-line" /> New Folder
                                </button>
                                <input type="file" multiple ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
                                <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()}>
                                    <i className="ri-upload-cloud-2-line" /> Upload
                                </button>
                                <div className="action-divider" />
                                <div style={{ display: 'flex', background: 'var(--dash-bg)', padding: '4px', borderRadius: 'var(--dash-radius)', border: '1px solid var(--dash-border)' }}>
                                    <button className={`icon-btn small ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')} style={viewMode === 'grid' ? { background: 'var(--dash-surface)', boxShadow: 'var(--dash-shadow-sm)', color: 'var(--dash-text-main)' } : { color: 'var(--dash-text-muted)' }}>
                                        <i className="ri-grid-fill" />
                                    </button>
                                    <button className={`icon-btn small ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')} style={viewMode === 'list' ? { background: 'var(--dash-surface)', boxShadow: 'var(--dash-shadow-sm)', color: 'var(--dash-text-main)' } : { color: 'var(--dash-text-muted)' }}>
                                        <i className="ri-list-check" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="fm-content" onDragEnter={handleDragEvent} onDragOver={handleDragEvent} onDragLeave={handleDragEvent} onDrop={handleDrop}>
                            {loading ? (
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '3rem', color: '#64748b', gap: '1rem' }}>
                                    <i className="ri-loader-4-line" style={{ fontSize: '2rem' }} /> Loading files...
                                </div>
                            ) : visibleFiles.length === 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                                    <i className="ri-folder-upload-line" style={{ fontSize: '4rem', marginBottom: '1rem' }} />
                                    <p>{searchTerm ? 'No files match your search.' : 'Drop files here or click Upload'}</p>
                                </div>
                            ) : (
                                <>
                                    {/* GRID VIEW */}
                                    {viewMode === 'grid' && (
                                        <div className="file-grid">
                                            {visibleFiles.map(f => (
                                                <div className="file-card" key={f.name}>
                                                    <div className="file-preview"
                                                        style={isImage(f.name) ? { backgroundImage: `url(${getFileUrl(f)})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#f1f5f9' } : {}}>
                                                        {!isImage(f.name) && (
                                                            <>
                                                                <i className="ri-file-text-fill text-image" style={{ color: '#64748b' }} />
                                                                <div className="file-extension">{f.name.split('.').pop().toUpperCase()}</div>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="file-info" style={{ borderTop: '1px solid var(--dash-border)' }}>
                                                        <div className="file-name" title={f.name}>{f.name}</div>
                                                        <div className="file-meta">
                                                            <span>{formatSize(f.size)}</span>
                                                            <div className="file-actions">
                                                                {/* View (opens in new tab) */}
                                                                <a href={getFileUrl(f)} target="_blank" rel="noreferrer" className="icon-btn small" title="View">
                                                                    <i className="ri-external-link-line" />
                                                                </a>
                                                                {/* Download */}
                                                                <a href={getFileUrl(f)} download={f.name} className="icon-btn small" title="Download">
                                                                    <i className="ri-download-line" />
                                                                </a>
                                                                {/* Delete */}
                                                                <button className="icon-btn small" style={{ color: '#ef4444' }} onClick={() => handleDelete(f.name)} title="Delete">
                                                                    <i className="ri-delete-bin-line" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* LIST VIEW */}
                                    {viewMode === 'list' && (
                                        <div className="file-list">
                                            <div className="list-header">
                                                <div>Name</div>
                                                <div className="cell-hide-mobile">Date</div>
                                                <div className="cell-hide-mobile">Size</div>
                                                <div style={{ textAlign: 'right' }}>Actions</div>
                                            </div>
                                            {visibleFiles.map(f => (
                                                <div className="list-row" key={f.name}>
                                                    <div className="list-cell cell-name">
                                                        <i className={isImage(f.name) ? 'ri-image-2-fill text-image' : 'ri-file-text-fill'} style={{ color: isImage(f.name) ? '#2563eb' : '#64748b' }} />
                                                        <span style={{ marginLeft: '10px' }} title={f.name}>{f.name}</span>
                                                    </div>
                                                    <div className="list-cell muted cell-hide-mobile">{new Date(f.createdAt).toLocaleDateString()}</div>
                                                    <div className="list-cell muted cell-hide-mobile">{formatSize(f.size)}</div>
                                                    <div className="file-actions" style={{ justifyContent: 'flex-end', minWidth: '100px' }}>
                                                        <a href={getFileUrl(f)} target="_blank" rel="noreferrer" className="icon-btn small" title="View">
                                                            <i className="ri-external-link-line" />
                                                        </a>
                                                        <a href={getFileUrl(f)} download={f.name} className="icon-btn small" title="Download">
                                                            <i className="ri-download-line" />
                                                        </a>
                                                        <button className="icon-btn small" style={{ color: '#ef4444' }} onClick={() => handleDelete(f.name)}>
                                                            <i className="ri-delete-bin-line" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* ── New Folder Modal ── */}
            {newFolderModal && (
                <div onClick={e => { if (e.target === e.currentTarget) setNewFolderModal(false); }}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ background: '#fff', borderRadius: '20px', padding: '2rem', maxWidth: '400px', width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <i className="ri-folder-add-line" style={{ color: '#f59e0b' }} /> New Folder
                            </h3>
                            <button onClick={() => setNewFolderModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>
                                <i className="ri-close-line" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateFolder}>
                            <input
                                autoFocus
                                type="text"
                                value={newFolderName}
                                onChange={e => setNewFolderName(e.target.value)}
                                placeholder="e.g. Project Green Valley"
                                style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', marginBottom: '1rem', boxSizing: 'border-box' }}
                                required
                            />
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button type="button" onClick={() => setNewFolderModal(false)} style={{ flex: 1, padding: '0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', background: '#fff', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ flex: 2, padding: '0.75rem', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Create Folder</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileManager;
