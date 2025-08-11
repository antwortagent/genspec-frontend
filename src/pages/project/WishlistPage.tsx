import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

export const WishlistPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const wishlistItems = [
    { id: '1', title: 'User Authentication', description: 'Secure login and registration system', status: 'suggested', source: 'template' },
    { id: '2', title: 'Product Catalog', description: 'Browse and search product listings', status: 'approved', source: 'template' },
    { id: '3', title: 'Shopping Cart', description: 'Add, remove, and manage cart items', status: 'in_review', source: 'user' },
    { id: '4', title: 'Payment Processing', description: 'Secure payment gateway integration', status: 'suggested', source: 'template' },
    { id: '5', title: 'Order Management', description: 'Track and manage customer orders', status: 'draft', source: 'user' }
  ];

  const getStatusColor = (status: string) => {
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

  return (
    <div style={{padding:'24px',maxWidth:'1200px',margin:'0 auto'}}>
      {/* Header */}
      <div style={{marginBottom:'32px'}}>
        <h1 style={{margin:'0 0 8px',fontSize:'28px',fontWeight:'700'}}>
          Wishlist
        </h1>
        <p style={{color:'var(--text-muted)',fontSize:'16px',margin:0}}>
          Review and manage your project requirements. Approve, edit, or add new items to define your project scope.
        </p>
      </div>

      {/* Toolbar */}
      <div style={{
        display:'flex',
        gap:'16px',
        alignItems:'center',
        marginBottom:'24px',
        flexWrap:'wrap'
      }}>
        <input 
          type="text"
          placeholder="Search wishlist items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding:'10px 14px',
            borderRadius:'8px',
            border:'2px solid var(--glass-border)',
            background:'#fff',
            fontSize:'14px',
            minWidth:'280px',
            flex:'1',
            maxWidth:'400px'
          }}
        />
        
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding:'10px 14px',
            borderRadius:'8px',
            border:'2px solid var(--glass-border)',
            background:'#fff',
            fontSize:'14px'
          }}
        >
          <option value="all">All statuses</option>
          <option value="suggested">Suggested</option>
          <option value="approved">Approved</option>
          <option value="in_review">In Review</option>
          <option value="draft">Draft</option>
          <option value="rejected">Rejected</option>
        </select>

        <div style={{display:'flex',gap:'8px'}}>
          <button 
            className="ghost"
            style={{padding:'10px 16px',fontSize:'14px'}}
          >
            Seed from Template
          </button>
          <button 
            className="primary"
            style={{padding:'10px 16px',fontSize:'14px'}}
          >
            Submit for Review
          </button>
        </div>
      </div>

      {/* Wishlist items */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(380px,1fr))',gap:'16px'}}>
        {filteredItems.map((item) => (
          <GlassCard key={item.id}>
            <div style={{padding:'20px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}}>
                <h3 style={{margin:0,fontSize:'18px',fontWeight:'600',color:'var(--text)',lineHeight:'1.3'}}>
                  {item.title}
                </h3>
                <span style={{
                  fontSize:'12px',
                  padding:'4px 8px',
                  borderRadius:'12px',
                  background:`${getStatusColor(item.status)}15`,
                  color:getStatusColor(item.status),
                  fontWeight:'500',
                  whiteSpace:'nowrap',
                  marginLeft:'12px'
                }}>
                  {item.status.replace('_', ' ')}
                </span>
              </div>
              
              <p style={{
                color:'var(--text-muted)',
                fontSize:'14px',
                lineHeight:'1.5',
                margin:'0 0 16px',
                minHeight:'42px'
              }}>
                {item.description}
              </p>

              <div style={{
                display:'flex',
                justifyContent:'space-between',
                alignItems:'center',
                marginBottom:'16px'
              }}>
                <span style={{
                  fontSize:'12px',
                  color:'var(--text-muted)',
                  background:'rgba(0,0,0,0.03)',
                  padding:'2px 6px',
                  borderRadius:'4px'
                }}>
                  {item.source}
                </span>
              </div>

              <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                {item.status !== 'approved' && (
                  <button 
                    style={{
                      padding:'6px 12px',
                      background:'var(--success)',
                      color:'#fff',
                      border:'none',
                      borderRadius:'6px',
                      fontSize:'12px',
                      fontWeight:'500',
                      cursor:'pointer'
                    }}
                  >
                    Approve
                  </button>
                )}
                {item.status !== 'rejected' && (
                  <button 
                    style={{
                      padding:'6px 12px',
                      background:'var(--danger)',
                      color:'#fff',
                      border:'none',
                      borderRadius:'6px',
                      fontSize:'12px',
                      fontWeight:'500',
                      cursor:'pointer'
                    }}
                  >
                    Reject
                  </button>
                )}
                <button 
                  style={{
                    padding:'6px 12px',
                    background:'transparent',
                    color:'var(--primary-1)',
                    border:'1px solid var(--primary-1)',
                    borderRadius:'6px',
                    fontSize:'12px',
                    fontWeight:'500',
                    cursor:'pointer'
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div style={{textAlign:'center',padding:'60px 20px'}}>
          <h3 style={{color:'var(--text-muted)',margin:'0 0 8px'}}>
            No items found
          </h3>
          <p style={{color:'var(--text-muted)',fontSize:'14px',margin:0}}>
            {searchQuery ? 'Try adjusting your search or filters' : 'Add your first wishlist item to get started'}
          </p>
        </div>
      )}
    </div>
  );
};
