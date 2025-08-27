import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
export const WishlistPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const wishlistItems = [
        { id: '1', title: 'User Authentication', description: 'Secure login and registration system', status: 'suggested', source: 'template' },
        { id: '2', title: 'Product Catalog', description: 'Browse and search product listings', status: 'approved', source: 'template' },
        { id: '3', title: 'Shopping Cart', description: 'Add, remove, and manage cart items', status: 'in_review', source: 'user' },
        { id: '4', title: 'Payment Processing', description: 'Secure payment gateway integration', status: 'suggested', source: 'template' },
        { id: '5', title: 'Order Management', description: 'Track and manage customer orders', status: 'draft', source: 'user' }
    ];
    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'var(--success)';
            case 'in_review': return 'var(--warning)';
            case 'suggested': return 'var(--primary-1)';
            case 'rejected': return 'var(--danger)';
            default: return 'var(--text-muted)';
        }
    };
    const filteredItems = wishlistItems.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    return (_jsxs("div", { style: { padding: '24px', maxWidth: '1200px', margin: '0 auto' }, children: [_jsxs("div", { style: { marginBottom: '32px' }, children: [_jsx("h1", { style: { margin: '0 0 8px', fontSize: '28px', fontWeight: '700' }, children: "Wishlist" }), _jsx("p", { style: { color: 'var(--text-muted)', fontSize: '16px', margin: 0 }, children: "Review and manage your project requirements. Approve, edit, or add new items to define your project scope." })] }), _jsxs("div", { style: {
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'center',
                    marginBottom: '24px',
                    flexWrap: 'wrap'
                }, children: [_jsx("input", { type: "text", placeholder: "Search wishlist items...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), style: {
                            padding: '10px 14px',
                            borderRadius: '8px',
                            border: '2px solid var(--glass-border)',
                            background: '#fff',
                            fontSize: '14px',
                            minWidth: '280px',
                            flex: '1',
                            maxWidth: '400px'
                        } }), _jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), style: {
                            padding: '10px 14px',
                            borderRadius: '8px',
                            border: '2px solid var(--glass-border)',
                            background: '#fff',
                            fontSize: '14px'
                        }, children: [_jsx("option", { value: "all", children: "All statuses" }), _jsx("option", { value: "suggested", children: "Suggested" }), _jsx("option", { value: "approved", children: "Approved" }), _jsx("option", { value: "in_review", children: "In Review" }), _jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "rejected", children: "Rejected" })] }), _jsxs("div", { style: { display: 'flex', gap: '8px' }, children: [_jsx("button", { className: "ghost", style: { padding: '10px 16px', fontSize: '14px' }, children: "Seed from Template" }), _jsx("button", { className: "primary", style: { padding: '10px 16px', fontSize: '14px' }, children: "Submit for Review" })] })] }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(380px,1fr))', gap: '16px' }, children: filteredItems.map((item) => (_jsx(GlassCard, { children: _jsxs("div", { style: { padding: '20px' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }, children: [_jsx("h3", { style: { margin: 0, fontSize: '18px', fontWeight: '600', color: 'var(--text)', lineHeight: '1.3' }, children: item.title }), _jsx("span", { style: {
                                            fontSize: '12px',
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            background: `${getStatusColor(item.status)}15`,
                                            color: getStatusColor(item.status),
                                            fontWeight: '500',
                                            whiteSpace: 'nowrap',
                                            marginLeft: '12px'
                                        }, children: item.status.replace('_', ' ') })] }), _jsx("p", { style: {
                                    color: 'var(--text-muted)',
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    margin: '0 0 16px',
                                    minHeight: '42px'
                                }, children: item.description }), _jsx("div", { style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '16px'
                                }, children: _jsx("span", { style: {
                                        fontSize: '12px',
                                        color: 'var(--text-muted)',
                                        background: 'rgba(0,0,0,0.03)',
                                        padding: '2px 6px',
                                        borderRadius: '4px'
                                    }, children: item.source }) }), _jsxs("div", { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' }, children: [item.status !== 'approved' && (_jsx("button", { style: {
                                            padding: '6px 12px',
                                            background: 'var(--success)',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            cursor: 'pointer'
                                        }, children: "Approve" })), item.status !== 'rejected' && (_jsx("button", { style: {
                                            padding: '6px 12px',
                                            background: 'var(--danger)',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            cursor: 'pointer'
                                        }, children: "Reject" })), _jsx("button", { style: {
                                            padding: '6px 12px',
                                            background: 'transparent',
                                            color: 'var(--primary-1)',
                                            border: '1px solid var(--primary-1)',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            cursor: 'pointer'
                                        }, children: "Edit" })] })] }) }, item.id))) }), filteredItems.length === 0 && (_jsxs("div", { style: { textAlign: 'center', padding: '60px 20px' }, children: [_jsx("h3", { style: { color: 'var(--text-muted)', margin: '0 0 8px' }, children: "No items found" }), _jsx("p", { style: { color: 'var(--text-muted)', fontSize: '14px', margin: 0 }, children: searchQuery ? 'Try adjusting your search or filters' : 'Add your first wishlist item to get started' })] }))] }));
};
