import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, AlertTriangle, ShieldCheck, Check, Clock, ExternalLink } from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { useAuth } from '../context/AuthContext';

function formatTimeAgo(dateStr) {
  if (!dateStr) return 'Just now';
  const diffSec = Math.floor((new Date() - new Date(dateStr)) / 1000);
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}

export default function NotificationDropdown() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const userId = user?.id || (user?.role === 'OFFICER' ? 'off-1' : 'cit-1');
  const role = user?.role || 'CITIZEN';

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications(userId, role);
      if (res && res.success) {
        setNotifications(res.data || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.warn('Notifications fetch error:', err);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchNotifications();

    // 25-second lightweight polling
    const interval = setInterval(fetchNotifications, 25000);
    return () => clearInterval(interval);
  }, [user, userId, role]);

  // Handle outside click to close popover
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      await notificationService.markAsRead(notif._id, userId, role);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    }
    setOpen(false);

    if (notif.complaintId) {
      const targetPath = role === 'OFFICER' || role === 'ADMIN'
        ? `/officer/complaints/${notif.complaintId}`
        : `/citizen/complaints/${notif.complaintId}`;
      navigate(targetPath);
    }
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead(userId, role);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="btn btn-ghost btn-icon"
        aria-label="Toggle notifications"
        style={{ position: 'relative', cursor: 'pointer' }}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 2,
              right: 2,
              minWidth: 16,
              height: 16,
              padding: '0 4px',
              borderRadius: '9999px',
              background: '#EF4444',
              color: '#FFFFFF',
              fontSize: '0.68rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid #FFFFFF',
              boxShadow: '0 2px 5px rgba(239, 68, 68, 0.4)'
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '340px',
            maxWidth: 'calc(100vw - 2rem)',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            boxShadow: '0 12px 32px rgba(15, 23, 42, 0.12)',
            zIndex: 1050,
            overflow: 'hidden',
            animation: 'fadeIn 150ms ease-out'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '0.85rem 1.1rem',
              borderBottom: '1px solid #F1F5F9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#F8FAFC'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A' }}>Notifications</span>
              {unreadCount > 0 && (
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    background: 'rgba(22, 163, 74, 0.12)',
                    color: '#16A34A',
                    padding: '0.1rem 0.5rem',
                    borderRadius: '9999px'
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#16A34A',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List Content */}
          <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748B' }}>
                <CheckCircle2 size={24} color="#16A34A" style={{ margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>You're all caught up!</div>
                <div style={{ fontSize: '0.78rem', marginTop: '0.15rem' }}>No new notifications at this time.</div>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleNotificationClick(item)}
                  style={{
                    padding: '0.85rem 1.1rem',
                    borderBottom: '1px solid #F1F5F9',
                    background: item.isRead ? '#FFFFFF' : 'rgba(22, 163, 74, 0.04)',
                    cursor: 'pointer',
                    transition: 'background 150ms ease',
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'flex-start'
                  }}
                >
                  {/* Status Indicator Icon */}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: item.type === 'COMPLAINT_RESOLVED'
                        ? 'rgba(22, 163, 74, 0.12)'
                        : item.type === 'COMPLAINT_ASSIGNED'
                        ? 'rgba(249, 115, 22, 0.12)'
                        : 'rgba(37, 99, 235, 0.12)',
                      color: item.type === 'COMPLAINT_RESOLVED'
                        ? '#16A34A'
                        : item.type === 'COMPLAINT_ASSIGNED'
                        ? '#F97316'
                        : '#2563EB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '0.1rem'
                    }}
                  >
                    {item.type === 'COMPLAINT_RESOLVED' ? (
                      <CheckCircle2 size={15} />
                    ) : item.type === 'COMPLAINT_ASSIGNED' ? (
                      <AlertTriangle size={15} />
                    ) : (
                      <Bell size={15} />
                    )}
                  </div>

                  {/* Body */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        {!item.isRead && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A' }} />}
                        <span>{item.title}</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{formatTimeAgo(item.createdAt)}</span>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0, lineHeight: 1.45 }}>
                      {item.message}
                    </p>

                    {item.complaintId && (
                      <div style={{ fontSize: '0.74rem', color: '#16A34A', fontWeight: 700, marginTop: '0.3rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                        <span>View #{item.complaintId}</span>
                        <ExternalLink size={11} />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
