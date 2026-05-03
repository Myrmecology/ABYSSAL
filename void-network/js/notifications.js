/* ============================================
   THE MINDLESS CORRIDOR — notifications.js
   Renders the notification feed, filter
   tabs, live incoming alerts, and the
   system message layer.
   ============================================ */

'use strict';

const MC = window.MC || {};

MC.notifications = (() => {

  /* ============================================
     STATE
     ============================================ */

  let activeTab   = 'all';
  let unreadCount = 0;

  /* ============================================
     COUNT UNREAD
     ============================================ */

  const countUnread = () => {
    if (!MC.notifications_data) return 0;
    return MC.notifications_data.filter(n => !n.read).length;
  };

  /* ============================================
     RENDER PAGE HEADER
     ============================================ */

  const renderHeader = () => {
    const wrap = MC.$('.mc-notif-page-header');
    if (!wrap) return;

    unreadCount = countUnread();

    wrap.innerHTML = `
      <div class="mc-notif-page-title">
        Notifications
        ${unreadCount > 0
          ? `<span class="mc-badge" style="position:relative;top:-4px;right:0;margin-left:var(--mc-space-2);">
               ${unreadCount}
             </span>`
          : ''}
      </div>
      <button class="mc-notif-mark-all" data-action="mark-all">
        Mark all as read
        <span class="Stars">✦</span>
      </button>
    `;

    MC.on(wrap, 'click', () => {
      markAllRead();
    }, '[data-action="mark-all"]');
  };

  /* ============================================
     RENDER FILTER TABS
     ============================================ */

  const renderTabs = () => {
    const wrap = MC.$('.mc-notif-tabs');
    if (!wrap) return;

    const systemCount = MC.notifications_data
      ? MC.notifications_data.filter(n => n.type === 'system' && !n.read).length
      : 0;

    const tabs = [
      { id: 'all',     label: 'All',     count: unreadCount },
      { id: 'system',  label: 'System',  count: systemCount },
      { id: 'likes',   label: 'Likes',   count: 0 },
      { id: 'follows', label: 'Follows', count: 0 },
      { id: 'comments',label: 'Comments',count: 0 },
    ];

    wrap.innerHTML = tabs.map(tab => `
      <button class="mc-notif-tab ${tab.id === activeTab ? 'is-active' : ''}"
              data-tab="${tab.id}">
        ${MC.escape(tab.label)}
        ${tab.count > 0
          ? `<span class="mc-notif-tab-count">${tab.count}</span>`
          : ''}
        <span class="Stars">✦</span>
      </button>
    `).join('');

    MC.on(wrap, 'click', (e, btn) => {
      activeTab = btn.dataset.tab;
      MC.$$('.mc-notif-tab', wrap).forEach(t => t.classList.remove('is-active'));
      btn.classList.add('is-active');
      renderList();

      if (activeTab === 'system') {
        MC.toast('System messages are generated automatically. Some are not.', 'red', 3500);
      }
    }, '[data-tab]');
  };

  /* ============================================
     FILTER NOTIFICATIONS BY TAB
     ============================================ */

  const filterByTab = (notifications) => {
    if (activeTab === 'all')      return notifications;
    if (activeTab === 'system')   return notifications.filter(n => n.type === 'system');
    if (activeTab === 'likes')    return notifications.filter(n => n.type === 'like');
    if (activeTab === 'follows')  return notifications.filter(n => n.type === 'follow');
    if (activeTab === 'comments') return notifications.filter(n => n.type === 'comment');
    return notifications;
  };

  /* ============================================
     BUILD NOTIFICATION ITEM
     ============================================ */

  const buildNotifItem = (notif, delay = 0) => {
    const el = MC.el('div', {
      class: `mc-notif-item mc-notif-drop
              ${!notif.read ? 'mc-notif-item--unread' : ''}
              ${notif.type === 'system' ? 'mc-notif-item--system' : ''}`,
      data: { notifId: notif.id },
    });

    if (delay) el.style.animationDelay = `${delay}s`;

    const iconMap = {
      like:    '♥',
      follow:  '◎',
      comment: '◻',
      share:   '↗',
      system:  '⚠',
    };

    const iconTypeClass = `mc-notif-icon-wrap--${notif.type}`;
    const icon = iconMap[notif.type] || '◈';

    const user = notif.userId ? MC.getUser(notif.userId) : null;

    const avatarHTML = user
      ? `<div class="mc-avatar mc-avatar--sm ${user.avatarClass}">
           ${MC.escape(user.avatar)}
         </div>`
      : `<div class="mc-notif-icon-wrap ${iconTypeClass}">${icon}</div>`;

    const textClass = notif.type === 'system'
      ? 'mc-notif-text mc-notif-text--system'
      : 'mc-notif-text';

    const timeClass = notif.timeWrong
      ? 'mc-notif-time mc-notif-time--wrong'
      : 'mc-notif-time';

    const excerptHTML = notif.excerpt
      ? `<div class="mc-notif-excerpt">${MC.escape(notif.excerpt)}</div>`
      : '';

    el.innerHTML = `
      ${avatarHTML}
      <div class="mc-notif-body">
        <div class="${textClass}">${MC.escape(notif.text)}</div>
        <div class="${timeClass} mc-mono">${MC.escape(notif.time)}</div>
        ${excerptHTML}
      </div>
    `;

    el.addEventListener('click', () => {
      notif.read = true;
      el.classList.remove('mc-notif-item--unread');
      el.style.removeProperty('background');
      el.style.removeProperty('--mc-blue-pulse');

      if (notif.type === 'system') {
        const responses = [
          'This message has been acknowledged. It will repeat.',
          'Noted. The system does not require your acknowledgement.',
          'You read it. That was the intention.',
        ];
        MC.toast(MC.pick(responses), 'red', 3200);
      }
    });

    return el;
  };

  /* ============================================
     RENDER NOTIFICATION LIST
     ============================================ */

  const renderList = () => {
    const list = MC.$('.mc-notif-list');
    if (!list) return;

    list.innerHTML = '';

    const data = MC.notifications_data || [];
    const filtered = filterByTab(data);

    if (!filtered.length) {
      list.innerHTML = `
        <div class="mc-notif-empty">
          <div class="mc-notif-empty-icon">◻</div>
          <div class="mc-notif-empty-title">Nothing here.</div>
          <div class="mc-notif-empty-sub mc-mono">
            No notifications in this category.<br>
            This does not mean nothing happened.
          </div>
        </div>
      `;
      return;
    }

    /* Group by read / unread */
    const unread = filtered.filter(n => !n.read);
    const read   = filtered.filter(n =>  n.read);

    if (unread.length) {
      const label = MC.el('div', { class: 'mc-notif-date-group' });
      label.innerHTML = `<div class="mc-notif-date-label">New</div>`;
      list.appendChild(label);
      unread.forEach((n, i) => {
        list.appendChild(buildNotifItem(n, i * 0.06));
      });
    }

    if (read.length) {
      const label = MC.el('div', { class: 'mc-notif-date-group' });
      label.innerHTML = `<div class="mc-notif-date-label">Earlier</div>`;
      list.appendChild(label);
      read.forEach((n, i) => {
        list.appendChild(buildNotifItem(n, i * 0.04));
      });
    }
  };

  /* ============================================
     MARK ALL READ
     ============================================ */

  const markAllRead = () => {
    if (!MC.notifications_data) return;

    MC.notifications_data.forEach(n => { n.read = true; });

    MC.$$('.mc-notif-item--unread').forEach(el => {
      el.classList.remove('mc-notif-item--unread');
    });

    const badge = MC.$('.mc-notif-page-header .mc-badge');
    if (badge) badge.remove();

    unreadCount = 0;

    const msgs = [
      'All notifications marked as read. New ones are already forming.',
      'Cleared. The unread count will return.',
      'Marked as read. We will send more.',
    ];
    MC.toast(MC.pick(msgs), 'blue', 3200);
  };

  /* ============================================
     LIVE INCOMING NOTIFICATION
     Drops a new notification into the list
     after a delay — feels like the site
     is watching and responding
     ============================================ */

  const scheduleLiveNotification = () => {
    const delay = 18000 + Math.random() * 30000;

    setTimeout(() => {
      const livePool = [
        {
          id:       'live-' + Date.now(),
          type:     'system',
          text:     'You have been reading this page for too long. This is fine. Stay.',
          time:     'just now',
          timeWrong: false,
          read:     false,
        },
        {
          id:       'live-' + Date.now(),
          type:     'follow',
          userId:   'u08',
          text:     'Riven Glass is watching your profile. They have always been watching.',
          time:     'just now',
          timeWrong: false,
          read:     false,
        },
        {
          id:       'live-' + Date.now(),
          type:     'like',
          userId:   'u06',
          text:     'Cael Morrow liked a post you have not written yet.',
          time:     'just now',
          timeWrong: true,
          read:     false,
        },
        {
          id:       'live-' + Date.now(),
          type:     'system',
          text:     'Session extended automatically. You did not request this. You did not need to.',
          time:     'just now',
          timeWrong: false,
          read:     false,
        },
      ];

      const incoming = MC.pick(livePool);

      if (MC.notifications_data) {
        MC.notifications_data.unshift(incoming);
      }

      const list = MC.$('.mc-notif-list');
      if (list && activeTab === 'all') {
        const el = buildNotifItem(incoming, 0);
        const firstGroup = MC.$('.mc-notif-date-group', list);
        if (firstGroup) {
          list.insertBefore(el, firstGroup.nextSibling);
        } else {
          list.prepend(el);
        }
      }

      if (MC.ambient && MC.ambient.showAlert) {
        MC.ambient.showAlert('New notification — ' + MC.truncate(incoming.text, 48));
      }

      scheduleLiveNotification();
    }, delay);
  };

  /* ============================================
     INIT
     ============================================ */

  const init = () => {
    document.title = 'Notifications — The Mindless Corridor';

    /* Alias data so it does not conflict with
       the MC.notifications module name */
    MC.notifications_data = MC.notifications_data || MC.notificationsRaw;

    /* Pull from data.js — stored under MC.notifications
       before this module overwrites the key */
    if (!MC.notifications_data && window._MC_notif_data) {
      MC.notifications_data = window._MC_notif_data;
    }

    renderHeader();
    renderTabs();
    renderList();
    scheduleLiveNotification();
  };

  return { init, markAllRead, scheduleLiveNotification };

})();

document.addEventListener('DOMContentLoaded', MC.notifications.init);

window.MC = MC;