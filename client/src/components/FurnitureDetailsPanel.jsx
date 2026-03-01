/**
 * FurnitureDetailsPanel
 * 
 * A premium sliding panel that appears when a furniture item is selected.
 * Shows: Price, Material details, Star Ratings, Variants, and Buy Links
 * from IKEA, Pepperfry, and Urban Ladder.
 */
import { useState, useEffect, useRef } from 'react';
import { getCatalogItem, renderStars } from '../utils/furnitureCatalog';

const FurnitureDetailsPanel = ({ item, onClose }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedVariant, setSelectedVariant] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const panelRef = useRef(null);

    const catalog = item ? getCatalogItem(item.type) : null;

    useEffect(() => {
        if (item && catalog) {
            // animate in
            requestAnimationFrame(() => setIsVisible(true));
            setActiveTab('overview');
            setSelectedVariant(0);
        } else {
            setIsVisible(false);
        }
    }, [item?.id]);

    if (!item || !catalog) return null;

    const currentVariant = catalog.variants[selectedVariant];

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '📋' },
        { id: 'materials', label: 'Materials', icon: '🧱' },
        { id: 'buy', label: 'Buy Now', icon: '🛒' },
    ];

    return (
        <>
            {/* Inline Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes fadeInUp {
          from { transform: translateY(12px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
          50% { box-shadow: 0 0 16px 4px rgba(99,102,241,0.15); }
        }
        .details-panel {
          animation: slideInRight 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .details-panel.closing {
          animation: slideOutRight 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .fade-in-up {
          animation: fadeInUp 0.4s ease forwards;
        }
        .shimmer-bg {
          background: linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }
        .buy-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .variant-chip:hover {
          transform: scale(1.05);
        }
        .variant-chip.active {
          animation: pulseGlow 2s ease-in-out infinite;
        }
        .detail-scrollbar::-webkit-scrollbar { width: 4px; }
        .detail-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .detail-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .detail-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}} />

            <div
                ref={panelRef}
                className={`details-panel ${!isVisible ? 'closing' : ''}`}
                style={{
                    position: 'absolute',
                    right: 0,
                    top: '56px',
                    bottom: 0,
                    width: '420px',
                    minWidth: '380px',
                    zIndex: 40,
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'linear-gradient(180deg, rgba(15,23,42,0.97), rgba(30,41,59,0.97))',
                    backdropFilter: 'blur(24px)',
                    borderLeft: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '-8px 0 40px rgba(0,0,0,0.4)',
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(99,102,241,0.08)',
                    flexShrink: 0,
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                <span style={{ fontSize: '28px' }}>{catalog.icon}</span>
                                <div>
                                    <h3 style={{
                                        fontSize: '18px', fontWeight: 800, color: '#f1f5f9',
                                        margin: 0, letterSpacing: '-0.02em'
                                    }}>
                                        {catalog.label}
                                    </h3>
                                    <span style={{
                                        fontSize: '11px', color: '#818cf8', fontWeight: 600,
                                        textTransform: 'uppercase', letterSpacing: '0.08em'
                                    }}>
                                        {catalog.category}
                                    </span>
                                </div>
                            </div>

                            {/* Rating */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                                <span style={{ color: '#fbbf24', fontSize: '14px', letterSpacing: '1px' }}>
                                    {renderStars(catalog.rating)}
                                </span>
                                <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                                    {catalog.rating} ({catalog.reviews.toLocaleString()} reviews)
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleClose}
                            style={{
                                width: '32px', height: '32px', borderRadius: '8px',
                                background: 'rgba(255,255,255,0.08)', border: 'none',
                                color: '#94a3b8', cursor: 'pointer', fontSize: '16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s',
                            }}
                            onMouseOver={e => { e.target.style.background = 'rgba(239,68,68,0.2)'; e.target.style.color = '#ef4444'; }}
                            onMouseOut={e => { e.target.style.background = 'rgba(255,255,255,0.08)'; e.target.style.color = '#94a3b8'; }}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Price Badge */}
                    <div style={{
                        marginTop: '12px',
                        display: 'flex', alignItems: 'center', gap: '12px',
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            padding: '6px 14px', borderRadius: '10px',
                            display: 'inline-flex', alignItems: 'baseline', gap: '4px',
                        }}>
                            <span style={{ fontSize: '12px', color: '#d1fae5', fontWeight: 500 }}>From</span>
                            <span style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>
                                ₹{catalog.priceRange.min.toLocaleString()}
                            </span>
                        </div>
                        <span style={{ color: '#64748b', fontSize: '12px' }}>
                            to ₹{catalog.priceRange.max.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)',
                    flexShrink: 0, padding: '0 8px',
                }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                flex: 1, padding: '12px 8px', border: 'none',
                                background: 'transparent', cursor: 'pointer',
                                color: activeTab === tab.id ? '#818cf8' : '#64748b',
                                fontSize: '12px', fontWeight: 700,
                                borderBottom: activeTab === tab.id ? '2px solid #818cf8' : '2px solid transparent',
                                transition: 'all 0.2s',
                                textTransform: 'uppercase', letterSpacing: '0.06em',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                            }}
                            onMouseOver={e => { if (activeTab !== tab.id) e.target.style.color = '#94a3b8'; }}
                            onMouseOut={e => { if (activeTab !== tab.id) e.target.style.color = '#64748b'; }}
                        >
                            <span>{tab.icon}</span> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="detail-scrollbar" style={{
                    flex: 1, overflowY: 'auto', padding: '16px 20px',
                }}>
                    {/* =========== OVERVIEW TAB =========== */}
                    {activeTab === 'overview' && (
                        <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Description */}
                            <p style={{
                                color: '#cbd5e1', fontSize: '13px', lineHeight: '1.7',
                                margin: 0, borderLeft: '3px solid #6366f1',
                                paddingLeft: '12px',
                            }}>
                                {catalog.description}
                            </p>

                            {/* Dimensions */}
                            <div>
                                <h4 style={{
                                    fontSize: '11px', fontWeight: 700, color: '#94a3b8',
                                    textTransform: 'uppercase', letterSpacing: '0.1em',
                                    marginBottom: '8px',
                                }}>
                                    📏 Dimensions
                                </h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                                    {Object.entries(catalog.dimensions).map(([key, val]) => (
                                        <div key={key} style={{
                                            background: 'rgba(255,255,255,0.04)',
                                            border: '1px solid rgba(255,255,255,0.06)',
                                            borderRadius: '10px', padding: '10px', textAlign: 'center',
                                        }}>
                                            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                                                {key}
                                            </div>
                                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>
                                                {val}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Info Row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                <div style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '10px', padding: '10px',
                                }}>
                                    <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>⚖️ Weight</div>
                                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>{catalog.weight}</div>
                                </div>
                                <div style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '10px', padding: '10px',
                                }}>
                                    <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>🛡️ Warranty</div>
                                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#10b981' }}>{catalog.warranty}</div>
                                </div>
                            </div>

                            {/* Variants */}
                            <div>
                                <h4 style={{
                                    fontSize: '11px', fontWeight: 700, color: '#94a3b8',
                                    textTransform: 'uppercase', letterSpacing: '0.1em',
                                    marginBottom: '8px',
                                }}>
                                    🎨 Variants & Pricing
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    {catalog.variants.map((variant, idx) => (
                                        <button
                                            key={idx}
                                            className={`variant-chip ${selectedVariant === idx ? 'active' : ''}`}
                                            onClick={() => setSelectedVariant(idx)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '10px',
                                                padding: '10px 14px', borderRadius: '12px',
                                                border: selectedVariant === idx
                                                    ? '1.5px solid rgba(99,102,241,0.6)'
                                                    : '1px solid rgba(255,255,255,0.06)',
                                                background: selectedVariant === idx
                                                    ? 'rgba(99,102,241,0.1)'
                                                    : 'rgba(255,255,255,0.03)',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                width: '100%',
                                            }}
                                        >
                                            {/* Color swatch */}
                                            <div style={{
                                                width: '24px', height: '24px', borderRadius: '50%',
                                                background: variant.color,
                                                border: '2px solid rgba(255,255,255,0.15)',
                                                flexShrink: 0,
                                            }} />
                                            <div style={{ flex: 1, textAlign: 'left' }}>
                                                <div style={{
                                                    fontSize: '13px', fontWeight: 600,
                                                    color: selectedVariant === idx ? '#c7d2fe' : '#94a3b8',
                                                }}>
                                                    {variant.name}
                                                </div>
                                            </div>
                                            <div style={{
                                                fontSize: '15px', fontWeight: 800,
                                                color: selectedVariant === idx ? '#10b981' : '#64748b',
                                            }}>
                                                ₹{variant.price.toLocaleString()}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tags */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingTop: '4px' }}>
                                {catalog.tags.map(tag => (
                                    <span key={tag} style={{
                                        fontSize: '10px', fontWeight: 600,
                                        color: '#818cf8', background: 'rgba(99,102,241,0.1)',
                                        border: '1px solid rgba(99,102,241,0.2)',
                                        padding: '3px 10px', borderRadius: '20px',
                                        textTransform: 'uppercase', letterSpacing: '0.05em',
                                    }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* =========== MATERIALS TAB =========== */}
                    {activeTab === 'materials' && (
                        <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <h4 style={{
                                fontSize: '13px', fontWeight: 700, color: '#e2e8f0',
                                margin: 0, display: 'flex', alignItems: 'center', gap: '8px',
                            }}>
                                🧱 Material Specifications
                            </h4>

                            {catalog.materials.map((mat, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        background: idx % 2 === 0
                                            ? 'rgba(255,255,255,0.03)'
                                            : 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                        borderRadius: '12px', padding: '14px 16px',
                                        display: 'flex', alignItems: 'flex-start', gap: '12px',
                                        animationDelay: `${idx * 0.08}s`,
                                    }}
                                    className="fade-in-up"
                                >
                                    <div style={{
                                        width: '36px', height: '36px', borderRadius: '10px',
                                        background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '14px', fontWeight: 800, color: '#818cf8',
                                        flexShrink: 0,
                                    }}>
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <div style={{
                                            fontSize: '12px', fontWeight: 700, color: '#818cf8',
                                            textTransform: 'uppercase', letterSpacing: '0.06em',
                                            marginBottom: '2px',
                                        }}>
                                            {mat.name}
                                        </div>
                                        <div style={{
                                            fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5',
                                        }}>
                                            {mat.detail}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Quality badges */}
                            <div style={{
                                marginTop: '8px',
                                padding: '14px',
                                background: 'rgba(16,185,129,0.06)',
                                border: '1px solid rgba(16,185,129,0.15)',
                                borderRadius: '12px',
                            }}>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: '#10b981', marginBottom: '8px' }}>
                                    ✅ Quality Certifications
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {['ISI Certified', 'E1 Grade MDF', 'CARB-2 Compliant', 'Anti-Termite', 'Fire Retardant'].map(cert => (
                                        <span key={cert} style={{
                                            fontSize: '10px', fontWeight: 600,
                                            color: '#6ee7b7', background: 'rgba(16,185,129,0.1)',
                                            padding: '3px 8px', borderRadius: '6px',
                                        }}>
                                            {cert}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Care Instructions */}
                            <div style={{
                                padding: '14px',
                                background: 'rgba(245,158,11,0.06)',
                                border: '1px solid rgba(245,158,11,0.15)',
                                borderRadius: '12px',
                            }}>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b', marginBottom: '8px' }}>
                                    🧹 Care Instructions
                                </div>
                                <ul style={{ margin: 0, paddingLeft: '18px', color: '#94a3b8', fontSize: '12px', lineHeight: '1.8' }}>
                                    <li>Wipe with a soft damp cloth for daily cleaning</li>
                                    <li>Avoid direct sunlight to prevent fading</li>
                                    <li>Use coasters to prevent water marks</li>
                                    <li>Apply furniture polish every 3-6 months</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* =========== BUY TAB =========== */}
                    {activeTab === 'buy' && (
                        <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <p style={{
                                fontSize: '12px', color: '#94a3b8', margin: '0 0 4px 0',
                                lineHeight: '1.6',
                            }}>
                                Compare prices and shop from India's leading furniture stores. Click to view the product on the retailer's website.
                            </p>

                            {catalog.buyLinks.map((link, idx) => (
                                <a
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="buy-card"
                                    style={{
                                        display: 'block',
                                        padding: '16px',
                                        borderRadius: '14px',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        background: 'rgba(255,255,255,0.03)',
                                        textDecoration: 'none',
                                        transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {/* Shimmer overlay */}
                                    <div className="shimmer-bg" style={{
                                        position: 'absolute', inset: 0,
                                        borderRadius: '14px', pointerEvents: 'none',
                                    }} />

                                    <div style={{ position: 'relative', zIndex: 1 }}>
                                        {/* Store header */}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{
                                                    width: '40px', height: '40px', borderRadius: '12px',
                                                    background: `${link.color}20`,
                                                    border: `1.5px solid ${link.color}40`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '20px',
                                                }}>
                                                    {link.logo}
                                                </div>
                                                <div>
                                                    <div style={{
                                                        fontSize: '15px', fontWeight: 800, color: '#f1f5f9',
                                                        letterSpacing: '-0.01em',
                                                    }}>
                                                        {link.store}
                                                    </div>
                                                    <div style={{
                                                        fontSize: '11px', color: '#94a3b8',
                                                    }}>
                                                        {link.name}
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{
                                                fontSize: '20px', fontWeight: 800,
                                                color: '#10b981',
                                                textAlign: 'right',
                                            }}>
                                                {link.price}
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <div style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            background: `${link.color}15`,
                                            border: `1px solid ${link.color}25`,
                                        }}>
                                            <span style={{
                                                fontSize: '11px', fontWeight: 700,
                                                color: link.color, textTransform: 'uppercase',
                                                letterSpacing: '0.08em',
                                            }}>
                                                View on {link.store}
                                            </span>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={link.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                                <polyline points="15 3 21 3 21 9"></polyline>
                                                <line x1="10" y1="14" x2="21" y2="3"></line>
                                            </svg>
                                        </div>
                                    </div>
                                </a>
                            ))}

                            {/* Price comparison note */}
                            <div style={{
                                padding: '12px 14px',
                                background: 'rgba(99,102,241,0.06)',
                                border: '1px solid rgba(99,102,241,0.15)',
                                borderRadius: '10px',
                                marginTop: '4px',
                            }}>
                                <div style={{ fontSize: '11px', color: '#818cf8', fontWeight: 600, marginBottom: '4px' }}>
                                    💡 Shopping Tip
                                </div>
                                <p style={{
                                    fontSize: '11px', color: '#94a3b8', margin: 0, lineHeight: '1.6',
                                }}>
                                    Prices are indicative and may vary. Check each store for the latest prices, offers, EMI options, and delivery charges to your location.
                                </p>
                            </div>

                            {/* Delivery Info */}
                            <div style={{
                                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px',
                            }}>
                                <div style={{
                                    padding: '10px', textAlign: 'center',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '10px',
                                }}>
                                    <div style={{ fontSize: '16px', marginBottom: '4px' }}>🚚</div>
                                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>Free Delivery</div>
                                </div>
                                <div style={{
                                    padding: '10px', textAlign: 'center',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '10px',
                                }}>
                                    <div style={{ fontSize: '16px', marginBottom: '4px' }}>🔄</div>
                                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>Easy Returns</div>
                                </div>
                                <div style={{
                                    padding: '10px', textAlign: 'center',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '10px',
                                }}>
                                    <div style={{ fontSize: '16px', marginBottom: '4px' }}>🛡️</div>
                                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>Warranty</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom CTA bar */}
                <div style={{
                    padding: '12px 20px',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(15,23,42,0.9)',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    flexShrink: 0,
                }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Selected Variant
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>
                            {currentVariant?.name}
                            <span style={{ color: '#10b981', marginLeft: '8px', fontWeight: 800 }}>
                                ₹{currentVariant?.price.toLocaleString()}
                            </span>
                        </div>
                    </div>
                    <a
                        href={catalog.buyLinks[0]?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            padding: '10px 20px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            color: '#fff', textDecoration: 'none',
                            fontSize: '13px', fontWeight: 700,
                            display: 'flex', alignItems: 'center', gap: '6px',
                            transition: 'all 0.2s',
                            cursor: 'pointer',
                            border: 'none',
                            boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
                        }}
                        onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                        onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                        🛒 Shop Now
                    </a>
                </div>
            </div>
        </>
    );
};

export default FurnitureDetailsPanel;
