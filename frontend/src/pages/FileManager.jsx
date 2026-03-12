import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import '../file-manager.css';
import '../dashboard.css';

const FileManager = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [fmSidebarOpen, setFmSidebarOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [expandedFolders, setExpandedFolders] = useState(['root', 'project1']);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024) {
                setFmSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleFolder = (folderId, e) => {
        e.stopPropagation();
        setExpandedFolders(prev => 
            prev.includes(folderId) 
                ? prev.filter(id => id !== folderId) 
                : [...prev, folderId]
        );
    };

    const handleDragEvent = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            alert(`${e.dataTransfer.files.length} file(s) intercepted for upload directly into "Photos" directory!`);
        }
    };

    return (
        <div style={{ backgroundColor: 'var(--dash-bg)', minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif", color: 'var(--dash-text-main)' }}>
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
                            <div className={`tree-node ${expandedFolders.includes('root') ? 'expanded' : ''}`}>
                                <div className="tree-row" onClick={(e) => toggleFolder('root', e)}>
                                    <div className="tree-toggle"><i className="ri-arrow-right-s-fill"></i></div>
                                    <i className="ri-hard-drive-2-fill tree-icon"></i>
                                    <span className="tree-label font-semibold">Workspace Drive</span>
                                </div>

                                {expandedFolders.includes('root') && (
                                    <div className="tree-children">
                                        <div className={`tree-node ${expandedFolders.includes('project1') ? 'expanded' : ''}`}>
                                            <div className="tree-row" onClick={(e) => toggleFolder('project1', e)}>
                                                <div className="tree-toggle"><i className="ri-arrow-right-s-fill"></i></div>
                                                <i className="ri-folder-2-line tree-icon"></i>
                                                <span className="tree-label">Beverly Hills Estate</span>
                                            </div>
                                            {expandedFolders.includes('project1') && (
                                                <div className="tree-children">
                                                    <div className="tree-node">
                                                        <div className="tree-row active">
                                                            <div className="tree-toggle"></div>
                                                            <i className="ri-folder-2-fill tree-icon"></i>
                                                            <span className="tree-label">Photos</span>
                                                        </div>
                                                    </div>
                                                    <div className="tree-node">
                                                        <div className="tree-row">
                                                            <div className="tree-toggle"></div>
                                                            <i className="ri-folder-2-line tree-icon"></i>
                                                            <span className="tree-label">Documents</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
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
                                    <span className="bc-item">Beverly Hills Estate</span>
                                    <i className="ri-arrow-right-s-line bc-sep"></i>
                                    <span className="bc-item">Photos</span>
                                </div>
                            </div>

                            <div className="toolbar-actions">
                                <div className="search-input">
                                    <i className="ri-search-line"></i>
                                    <input type="text" placeholder="Search in Photos..." />
                                </div>
                                <div className="action-divider"></div>
                                <button className="btn btn-outline"><i className="ri-folder-add-line"></i> New Folder</button>
                                <button className="btn btn-primary" onClick={() => alert('Trigger native file upload')}><i className="ri-upload-cloud-2-line"></i> Upload</button>
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

                        <div className="fm-content" id="fmDropzone" onDragEnter={handleDragEvent} onDragOver={handleDragEvent} onDragLeave={handleDragEvent} onDrop={handleDrop}>
                            {/* GRID VIEW DIRECTORY CONTENT */}
                            {viewMode === 'grid' && (
                                <div className="file-grid" id="gridViewBody">
                                    <div className="file-card">
                                        <div className="file-preview" style={{ height: '100px', borderBottom: 'none', background: 'transparent' }}>
                                            <i className="ri-folder-2-fill text-folder" style={{ fontSize: '64px' }}></i>
                                        </div>
                                        <div className="file-info" style={{ borderTop: '1px solid var(--dash-border)' }}>
                                            <div className="file-name">High-Res Renders</div>
                                            <div className="file-meta">
                                                <span>Folder • 3 items</span>
                                                <div className="file-actions">
                                                    <button className="icon-btn small"><i className="ri-more-2-fill"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="file-card">
                                        <div className="file-preview">
                                            <i className="ri-image-2-fill text-image"></i>
                                            <div className="file-extension">JPG</div>
                                        </div>
                                        <div className="file-info">
                                            <div className="file-name">exterior_render_01.jpg</div>
                                            <div className="file-meta">
                                                <span>4.2 MB • Oct 12, 2025</span>
                                                <div className="file-actions">
                                                    <button className="icon-btn small"><i className="ri-download-2-line"></i></button>
                                                    <button className="icon-btn small"><i className="ri-more-2-fill"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* LIST VIEW DIRECTORY CONTENT */}
                            {viewMode === 'list' && (
                                <div className="file-list" id="listViewBody">
                                    <div className="list-header">
                                        <div>Name</div>
                                        <div className="cell-hide-mobile">Date Modified</div>
                                        <div className="cell-hide-mobile">Type</div>
                                        <div className="cell-hide-mobile">Size</div>
                                        <div style={{ textAlign: 'right' }}></div>
                                    </div>
                                    <div className="list-row">
                                        <div className="list-cell cell-name"><i className="ri-folder-2-fill text-folder"></i> High-Res Renders</div>
                                        <div className="list-cell muted cell-hide-mobile">Oct 16, 2025</div>
                                        <div className="list-cell muted cell-hide-mobile">Folder</div>
                                        <div className="list-cell muted cell-hide-mobile">--</div>
                                        <div className="file-actions">
                                            <button className="icon-btn small"><i className="ri-more-2-fill"></i></button>
                                        </div>
                                    </div>
                                    <div className="list-row">
                                        <div className="list-cell cell-name"><i className="ri-image-2-fill text-image"></i> exterior_render_01.jpg</div>
                                        <div className="list-cell muted cell-hide-mobile">Oct 12, 2025</div>
                                        <div className="list-cell muted cell-hide-mobile">Image</div>
                                        <div className="list-cell muted cell-hide-mobile">4.2 MB</div>
                                        <div className="file-actions">
                                            <button className="icon-btn small"><i className="ri-download-2-line"></i></button>
                                            <button className="icon-btn small" title="Rename"><i className="ri-pencil-line"></i></button>
                                            <button className="icon-btn small" title="Delete" style={{ color: '#ef4444' }}><i className="ri-delete-bin-line"></i></button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FileManager;
