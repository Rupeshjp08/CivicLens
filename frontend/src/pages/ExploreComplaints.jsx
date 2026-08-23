import React, { useEffect, useState } from 'react';
import { ThumbsUp, MapPin, Filter, Search, Tag } from 'lucide-react';
import { complaintService } from '../services/complaintService';
import StatusBadge from '../components/StatusBadge';
import PriorityScore from '../components/PriorityScore';
import IssueCluster from '../components/IssueCluster';
import EmptyState from '../components/EmptyState';

export default function ExploreComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedArea, setSelectedArea] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Upvoted track
  const [upvotedItems, setUpvotedItems] = useState({});

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    setLoading(true);
    const res = await complaintService.getComplaints();
    setLoading(false);
    if (res.success && res.data) {
      setComplaints(res.data);
    }
  };

  const handleUpvote = async (id) => {
    const isAlreadyUpvoted = upvotedItems[id];
    
    setComplaints(prev =>
      prev.map(item => {
        const match = item.complaintId === id || item._id === id;
        if (match) {
          const currentCount = item.supportCount || 0;
          return {
            ...item,
            supportCount: isAlreadyUpvoted ? currentCount - 1 : currentCount + 1
          };
        }
        return item;
      })
    );

    setUpvotedItems(prev => ({ ...prev, [id]: !isAlreadyUpvoted }));

    complaintService.upvoteComplaint(id);
  };

  const categories = ['All', 'Pothole', 'Broken Streetlight', 'Garbage Accumulation', 'Water Leakage', 'Damaged Road', 'Other'];
  const statuses = ['All', 'Pending', 'In Review', 'In Progress', 'Resolved'];
  const areas = ['All', 'Sector 1', 'Sector 2', 'Sector 3', 'Sector 4', 'Sector 5'];

  const filteredComplaints = complaints.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStat = selectedStatus === 'All' || item.status === selectedStatus;
    const matchesArea = selectedArea === 'All' || (item.location && item.location.toLowerCase().includes(selectedArea.toLowerCase()));
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.complaintId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesStat && matchesArea && matchesSearch;
  });

  // Group complaints into clusters by category if multiple exist
  const clusteredCategoryMap = {};
  filteredComplaints.forEach(item => {
    if (!clusteredCategoryMap[item.category]) {
      clusteredCategoryMap[item.category] = [];
    }
    clusteredCategoryMap[item.category].push(item);
  });
  
  const largeClusters = Object.entries(clusteredCategoryMap)
    .filter(([cat, items]) => items.length >= 2)
    .slice(0, 2); // Show top 2 clusters

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <div style={{ fontSize: '0.8rem', color: 'var(--brand-blue)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
          MUNICIPAL INCIDENT FEED
        </div>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800 }}>Explore Public Issues & Community Support</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Review community reported concerns. Upvote issues in your sector to raise triage dispatch priority score.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '240px' }}>
            <Search size={18} color="#3B82F6" />
            <input
              type="text"
              className="form-control"
              placeholder="Search by title, landmark, or Complaint ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Filter size={15} color="var(--text-muted)" />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Category:</span>
              <select
                className="form-control"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
              >
                {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Status:</span>
              <select
                className="form-control"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
              >
                {statuses.map((s, i) => <option key={i} value={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Area:</span>
              <select
                className="form-control"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
              >
                {areas.map((a, i) => <option key={i} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Clustered Issues Banner if any */}
      {!loading && largeClusters.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Detected Clustered Municipal Hazards
          </div>
          {largeClusters.map(([cat, items]) => (
            <IssueCluster 
              key={cat} 
              complaints={items} 
              clusterLabel={`${cat} — Multiple Related Reports`} 
            />
          ))}
        </div>
      )}

      {/* Complaint Cards Grid */}
      {loading ? (
        <EmptyState type="loading" title="Fetching live incident feed..." message="Querying municipal database." />
      ) : filteredComplaints.length === 0 ? (
        <EmptyState 
          type="empty" 
          title="No issues found matching filters" 
          message="Adjust search query, area sector, or category dropdowns." 
        />
      ) : (
        <div className="issue-card-grid">
          {filteredComplaints.map((item) => {
            const itemId = item.complaintId || item._id;
            const isUpvoted = upvotedItems[itemId];

            return (
              <div key={itemId} className="panel panel-interactive" style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', padding: '1.5rem' }}>
                {item.image && (
                  <div style={{ height: '170px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className="badge badge-medium font-mono">#{item.complaintId}</span>
                    <StatusBadge type="status" value={item.status} />
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                    {item.description}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Tag size={14} color="#38BDF8" /> <span>{item.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }} className="font-mono">
                    <MapPin size={14} color="#3B82F6" /> <span>{item.location}</span>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <StatusBadge type="priority" value={item.priority} size="sm" />
                    <PriorityScore complaint={item} size="sm" showBreakdown={false} />
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handleUpvote(itemId)}
                    className={`btn ${isUpvoted ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem' }}
                  >
                    <ThumbsUp size={14} />
                    <span>{isUpvoted ? 'Upvoted' : 'Upvote'} ({item.supportCount || 0})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
