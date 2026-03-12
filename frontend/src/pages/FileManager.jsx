import React, { useState, useEffect, useRef } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import Toast from '../components/Toast';
import api from '../services/api';
import '../file-manager.css';
import '../dashboard.css';

const FileManager = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [fmSidebarOpen, setFmSidebarOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toasts, setToasts] = useState([]);
    const fileInputRef = useRef(null);

    const addToast = (msg, type = 'success') => setToasts(prev => [...prev, { id: Date.now(), message: msg, type }]);
    const dismissToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    useEffect(() => {
        fetchFiles();
        const handleResize = () => {
            if (window.innerWidth > 1024) setFmSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchFiles = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/uploads');
            setFiles(data.data || []);
        } catch (error) {
            addToast('Failed to load files', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles || selectedFiles.length === 0) return;

        const formData = new FormData();
        Array.from(selectedFiles).forEach(file => {
            formData.append('files', file);
        });

        try {
            const { data } = await api.post('/uploads', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (data.success) {
                addToast(`${selectedFiles.length} file(s) uploaded!`, 'success');
                fetchFiles();
            }
        } catch (error) {
            addToast('Upload failed', 'error');
        }
    };

    const handleDelete = async (filename) => {
        if (!window.confirm(`Are you sure you want to delete ${filename}?`)) return;
        try {
            const { data } = await api.delete(`/uploads/${filename}`);
            if (data.success) {
                addToast('File deleted', 'success');
                setFiles(files.filter(f => f.name !== filename));
            }
        } catch (error) {
            addToast('Delete failed', 'error');
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const formData = new FormData();
            Array.from(e.dataTransfer.files).forEach(file => {
                formData.append('files', file);
            });
            try {
                const { data } = await api.post('/uploads', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (data.success) {
                    addToast(`${e.dataTransfer.files.length} file(s) uploaded!`, 'success');
                    fetchFiles();
                }
            } catch (error) {
                addToast('Upload failed', 'error');
            }
        }
    };

    const handleDragEvent = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const formatSize = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const isImage = (filename) => {
        return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(filename);
    };

    return (
        <div style={{ backgroundColor: 'var(--dash-bg)', minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif", color: 'var(--dash-text-main)' }}>
            <Toast messages={toasts} onDismiss={dismissToast} />
            <AdminSidebar open={sidebarOpen} />

            <main className="main-content">
                <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="File Manager" />

                <div className="fm-layout" style={{ height: 'calc(100vh - 70px)' }}>

                    {/* Left Folder Tree Panel */}
                    <div className={`fm-sidebar ${fmSidebarOpen ? 'open' : ''}`} id="fmSidebar">
                        <div className="fm-sidebar-header">
                            <span className="font-semibold text-sm">Storage Explorer</span>
                            <button className="icon-btn small tree-mobile-toggle" style={{ display: window.innerWidth <= 1024 ? 'block' : 'none' }} onClick={() => setFmSidebarOpen(false)}>
                                <i className="ri-close-line"></i>
                            </button>
                        </div>
                        <div className="fm-tree" id="folderTree">
                            <div className="tree-node expanded">
                                <div className="tree-row active">
                                    <div className="tree-toggle"><i className="ri-arrow-right-s-fill"></i></div>
                                    <i className="ri-server-fill tree-icon"></i>
                                    <span className="tree-label font-semibold">Server Uploads</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main File Area */}
                    <div className="fm-main">
                        <div className="fm-toolbar">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <button className="icon-btn small" id="toggleTreeBtn" style={{ display: window.innerWidth <= 1024 ? 'block' : 'none' }} onClick={() => setFmSidebarOpen(!fmSidebarOpen)}>
                                    <i className="ri-menu-unfold-line"></i>
                                </button>
                                <div className="breadcrumbs">
                                    <span className="bc-item">Server Uploads</span>
                                    <i className="ri-arrow-right-s-line bc-sep"></i>
                                    <span className="bc-item">All Files</span>
                                </div>
                            </div>

                            <div className="toolbar-actions">
                                <div className="search-input">
                                    <i className="ri-search-line"></i>
                                    <input type="text" placeholder="Search files..." />
                                </div>
                                <div className="action-divider"></div>
                                <input type="file" multiple ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
                                <button className="btn btn-primary" onClick={() => fileInputRef.current.click()}><i className="ri-upload-cloud-2-line"></i> Upload</button>
                                <div className="action-divider"></div>
                                <div style={{ display: 'flex', background: 'var(--dash-bg)', padding: '4px', borderRadius: 'var(--dash-radius)', border: '1px solid var(--dash-border)' }}>
                                    <button className={`icon-btn small ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')} style={viewMode === 'grid' ? { background: 'var(--dash-surface)', boxShadow: 'var(--dash-shadow-sm)', color: 'var(--dash-text-main)' } : { color: 'var(--dash-text-muted)' }}>
                                        <i className="ri-grid-fill"></i>
                                    </button>
                                    <button className={`icon-btn small ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')} style={viewMode === 'list' ? { background: 'var(--dash-surface)', boxShadow: 'var(--dash-shadow-sm)', color: 'var(--dash-text-main)' } : { color: 'var(--dash-text-muted)' }}>
                                        <i className="ri-list-check"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="fm-content" onDragEnter={handleDragEvent} onDragOver={handleDragEvent} onDragLeave={handleDragEvent} onDrop={handleDrop}>
                            {loading ? (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: '#64748b' }}>Loading files...</div>
                            ) : files.length === 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                                    <i className="ri-folder-upload-line" style={{ fontSize: '4rem', marginBottom: '1rem' }} />
                                    <p>Drop files here or click Upload</p>
                                </div>
                            ) : (
                                <>
                                    {/* GRID VIEW */}
                                    {viewMode === 'grid' && (
                                        <div className="file-grid">
                                            {files.map(f => (
                                                <div className="file-card" key={f.name}>
                                                    <div className="file-preview" style={isImage(f.name) ? { backgroundImage: `url(${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${f.url})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#f1f5f9' } : {}}>
                                                        {!isImage(f.name) && (
                                                            <>
                                                                <i className="ri-file-text-fill text-image" style={{ color: '#64748b' }}></i>
                                                                <div className="file-extension">{f.name.split('.').pop().toUpperCase()}</div>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="file-info" style={{ borderTop: '1px solid var(--dash-border)' }}>
                                                        <div className="file-name" title={f.name}>{f.name}</div>
                                                        <div className="file-meta">
                                                            <span>{formatSize(f.size)}</span>
                                                            <div className="file-actions">
                                                                <a href={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${f.url}`} target="_blank" rel="noreferrer" className="icon-btn small" title="View"><i className="ri-external-link-line"></i></a>
                                                                <button className="icon-btn small" style={{ color: '#ef4444' }} onClick={() => handleDelete(f.name)} title="Delete"><i className="ri-delete-bin-line"></i></button>
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
                                            {files.map(f => (
                                                <div className="list-row" key={f.name}>
                                                    <div className="list-cell cell-name">
                                                        <i className={isImage(f.name) ? "ri-image-2-fill text-image" : "ri-file-text-fill"} style={{ color: isImage(f.name) ? '#2563eb' : '#64748b' }}></i> 
                                                        <span style={{ marginLeft: '10px' }} title={f.name}>{f.name}</span>
                                                    </div>
                                                    <div className="list-cell muted cell-hide-mobile">{new Date(f.createdAt).toLocaleDateString()}</div>
                                                    <div className="list-cell muted cell-hide-mobile">{formatSize(f.size)}</div>
                                                    <div className="file-actions" style={{ justifyContent: 'flex-end', minWidth: '80px' }}>
                                                        <a href={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${f.url}`} target="_blank" rel="noreferrer" className="icon-btn small"><i className="ri-external-link-line"></i></a>
                                                        <button className="icon-btn small" style={{ color: '#ef4444' }} onClick={() => handleDelete(f.name)}><i className="ri-delete-bin-line"></i></button>
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
        </div>
    );
};

export default FileManager;
