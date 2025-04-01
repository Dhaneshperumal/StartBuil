import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatRelativeTime } from '../utils/helpers';
import '../cssStyles/Navbar.css';

const Navbar = ({ 
  toggleSidebar, 
  notifications = [], 
  unreadCount = 0, 
  notificationsLoading = false,
  onMarkAsRead,
  onRefreshNotifications 
}) => {
  const { user, logout } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleNotifications = () => {
    if (!notificationsOpen && onRefreshNotifications) {
      onRefreshNotifications();
    }
    setNotificationsOpen(!notificationsOpen);
    setUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    setNotificationsOpen(false);
  };

  const handleNotificationClick = (notification) => {
    if (onMarkAsRead && !notification.status.read) {
      onMarkAsRead(notification._id);
    }

    if (notification.relatedTo) {
      const { type, id } = notification.relatedTo;
      
      switch (type) {
        case 'Event':
          navigate(`/events/${id}`);
          break;
        case 'Attraction':
          navigate(`/attractions/${id}`);
          break;
        case 'Tour':
          navigate(`/tours/${id}`);
          break;
        case 'Feedback':
          navigate(`/feedback`);
          break;
        case 'Incident':
          navigate(`/feedback`);
          break;
        case 'TransportationRequest':
          navigate(`/transportation/courtesy`);
          break;
        default:
          break;
      }
    }

    setNotificationsOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-horizontal navbar-dark bg-primary">
      <div className="navbar-container">
        {/* Sidebar toggle button */}
        <button 
          className="sidebar-toggler" 
          onClick={toggleSidebar}
        >
          <i className="fas fa-bars"></i>
        </button>
        
        {/* Brand logo */}
        <Link className="navbar-brand" to="/dashboard">
          <i className="fas fa-city"></i>
          <span>Smart City</span>
        </Link>
        
        {/* Spacer to push items to the right */}
        <div className="navbar-spacer"></div>
        
        {/* Navigation items - always horizontal */}
        <div className="navbar-items">
          {user && (
            <>
              {/* Notifications */}
              <div className="nav-item dropdown notifications-wrapper">
                <button 
                  className="nav-link notifications-btn"
                  onClick={toggleNotifications}
                >
                  <i className="fas fa-bell"></i>
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </button>
                
                <div className={`dropdown-menu notifications-dropdown ${notificationsOpen ? 'show' : ''}`}>
                  <div className="dropdown-header">
                    <span>Notifications</span>
                    <button 
                      className="refresh-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRefreshNotifications();
                      }}
                    >
                      <i className="fas fa-sync-alt"></i>
                    </button>
                  </div>
                  
                  <div className="notifications-list">
                    {notificationsLoading ? (
                      <div className="loading-notifications">
                        <div className="spinner"></div>
                        <p>Loading notifications...</p>
                      </div>
                    ) : notifications.length > 0 ? (
                      notifications.map(notification => (
                        <button
                          key={notification._id}
                          className={`notification-item ${!notification.status.read ? 'unread' : ''}`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="notification-icon">
                            <i className={`fas ${getNotificationIcon(notification.type)}`}></i>
                          </div>
                          <div className="notification-content">
                            <div className="notification-title">{notification.title}</div>
                            <div className="notification-message">{notification.message}</div>
                            <div className="notification-time">
                              {formatRelativeTime(new Date(notification.createdAt))}
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="empty-notifications">
                        <p>No notifications</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="dropdown-footer">
                    <Link to="/notifications">View all notifications</Link>
                  </div>
                </div>
              </div>
              
              {/* User Menu */}
              <div className="nav-item dropdown user-menu-wrapper">
                <button 
                  className="nav-link user-menu-btn"
                  onClick={toggleUserMenu}
                >
                  <span className="user-name">{user.firstName}</span>
                  <div className="user-avatar">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={`${user.firstName} ${user.lastName}`}
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </div>
                    )}
                  </div>
                </button>
                
                <div className={`dropdown-menu user-dropdown ${userMenuOpen ? 'show' : ''}`}>
                  <div className="user-profile">
                    <div className="user-avatar-large">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                      ) : (
                        <div className="avatar-placeholder">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="user-info">
                      <div className="user-fullname">{user.firstName} {user.lastName}</div>
                      <div className="user-email">{user.email}</div>
                      <div className="user-role">{user.roles?.[0] || 'User'}</div>
                    </div>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <Link className="dropdown-item" to="/profile">
                    <i className="fas fa-user"></i> Profile
                  </Link>
                  <Link className="dropdown-item" to="/settings">
                    <i className="fas fa-cog"></i> Settings
                  </Link>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

function getNotificationIcon(type) {
  switch (type) {
    case 'event': return 'fa-calendar-alt';
    case 'transportation': return 'fa-bus';
    case 'news': return 'fa-newspaper';
    case 'feedback': return 'fa-comment-alt';
    case 'incident': return 'fa-exclamation-triangle';
    case 'account': return 'fa-user-circle';
    case 'tour': return 'fa-map-marked-alt';
    default: return 'fa-bell';
  }
}

export default Navbar;