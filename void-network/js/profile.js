/* ============================================
   THE MINDLESS CORRIDOR — profile.js
   Reads the ?u= param, finds the user,
   builds the full profile page — cover,
   header, stats, tabs, posts, about panel.
   ============================================ */

'use strict';

const MC = window.MC || {};

MC.profile = (() => {

  /* ============================================
     RESOLVE USER FROM URL
     ============================================ */

  const resolveUser = () => {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get('u');
    if (uid) {
      const found = MC.getUser(uid);
      if (found) return found;
    }
    /* Default to first user if no param */
    return MC.users[0];
  };

  /* ============================================
     RENDER COVER
     ============================================ */

  const renderCover = () => {
    const cover = MC.$('.mc-profile-cover');
    if (!cover) return;
    const inner = MC.el('div', { class: 'mc-profile-cover-inner' });
    cover.appendChild(inner);
  };

  /* ============================================
     RENDER PROFILE HEADER
     ============================================ */

  const renderHeader = (user) => {
    const body = MC.$('.mc-profile-header-body');
    if (!body) return;

    const isOnline = user.status === 'online';
    const statusClass = isOnline
      ? 'mc-profile-status mc-profile-status--online'
      : 'mc-profile-status';

    const verifiedBadge = user.verified
      ? `<span class="mc-pill mc-pill--blue" style="margin-left:var(--mc-space-2);">✓ verified</span>`
      : '';

    const bioGhost = user.bioGhost
      ? `<p class="mc-profile-bio-ghost">[ ${MC.escape(user.bioGhost)} ]</p>`
      : '';

    const location = user.location
      ? `<div class="mc-profile-meta-item">
           <span class="mc-profile-meta-item-icon">◎</span>
           ${MC.escape(user.location)}
         </div>`
      : '';

    body.innerHTML = `
      <div class="mc-profile-actions">
        <button class="mc-btn mc-btn--ghost mc-btn--sm" id="profile-message-btn">
          Message
          <span class="Stars">✦</span>
        </button>
        <button class="mc-btn mc-btn--follow mc-btn--sm" id="profile-follow-btn">
          Follow
          <span class="Stars">✦</span>
        </button>
      </div>

      <div class="mc-profile-avatar-wrap">
        <div class="mc-avatar mc-avatar--2xl ${user.avatarClass}">
          ${MC.escape(user.avatar)}
        </div>
        <span class="${statusClass}"></span>
      </div>

      <div class="mc-profile-name mc-glitch" data-text="${MC.escape(user.name)}">
        ${MC.escape(user.name)}
        ${verifiedBadge}
      </div>
      <div class="mc-profile-handle">${MC.escape(user.handle)}</div>

      <p class="mc-profile-bio">${MC.escape(user.bio)}</p>
      ${bioGhost}

      <div class="mc-profile-meta-row">
        ${location}
        <div class="mc-profile-meta-item">
          <span class="mc-profile-meta-item-icon">◷</span>
          Joined ${MC.escape(user.joined)}
        </div>
      </div>

      <div class="mc-profile-stats">
        <div class="mc-profile-stat" data-stat="posts">
          <span class="mc-profile-stat-value mc-count-flicker">${MC.escape(user.posts)}</span>
          <span class="mc-profile-stat-label">Posts</span>
        </div>
        <div class="mc-profile-stat" data-stat="followers">
          <span class="mc-profile-stat-value mc-count-flicker">${MC.escape(user.followers)}</span>
          <span class="mc-profile-stat-label">Followers</span>
        </div>
        <div class="mc-profile-stat" data-stat="following">
          <span class="mc-profile-stat-value mc-count-flicker">${MC.escape(user.following)}</span>
          <span class="mc-profile-stat-label">Following</span>
        </div>
      </div>
    `;

    bindHeaderInteractions(user);
  };

  /* ============================================
     HEADER INTERACTIONS
     ============================================ */

  const bindHeaderInteractions = (user) => {
    const followBtn = MC.$('#profile-follow-btn');
    const messageBtn = MC.$('#profile-message-btn');

    if (followBtn) {
      followBtn.addEventListener('click', () => {
        const isFollowing = followBtn.classList.toggle('is-following');
        followBtn.childNodes[0].textContent = isFollowing ? 'Following' : 'Follow';
        const msgs = isFollowing
          ? [
              `Now following ${user.name}. They were already aware.`,
              'Connected. Something has changed.',
              'Following. The feeling is mutual.',
            ]
          : [
              `Unfollowed ${user.name}. They noticed immediately.`,
              'Disconnected. For now.',
            ];
        MC.toast(MC.pick(msgs), 'blue', 3000);
      });
    }

    if (messageBtn) {
      messageBtn.addEventListener('click', () => {
        const msgs = [
          'Message sent. Delivery time: uncertain.',
          `${user.name} has been notified. They were already reading it.`,
          'Message delivered before it was written.',
        ];
        MC.toast(MC.pick(msgs), 'default', 3200);
      });
    }

    /* Stat click — shows a toast with wrong info */
    MC.on(MC.$('.mc-profile-stats'), 'click', (e, stat) => {
      const type = stat.dataset.stat;
      const wrongMessages = {
        posts:     'All posts are original. All posts exist elsewhere.',
        followers: 'Follower count updates in real time. Real time is approximate.',
        following: 'Everyone they follow is aware of being followed.',
      };
      if (type && wrongMessages[type]) {
        MC.toast(wrongMessages[type], 'default', 3000);
      }
    }, '[data-stat]');
  };

  /* ============================================
     RENDER TABS
     ============================================ */

  const renderTabs = () => {
    const tabsEl = MC.$('.mc-profile-tabs');
    if (!tabsEl) return;

    const tabs = [
      { label: 'Posts',   panel: 'panel-posts'   },
      { label: 'Media',   panel: 'panel-media'   },
      { label: 'About',   panel: 'panel-about'   },
      { label: 'Archive', panel: 'panel-archive' },
    ];

    tabsEl.innerHTML = tabs.map((t, i) => `
      <button class="mc-profile-tab ${i === 0 ? 'is-active' : ''}"
              data-panel="${t.panel}">
        ${MC.escape(t.label)}
        <span class="Stars">✦</span>
      </button>
    `).join('');

    MC.on(tabsEl, 'click', (e, btn) => {
      /* Switch active tab */
      MC.$$('.mc-profile-tab', tabsEl).forEach(t => t.classList.remove('is-active'));
      btn.classList.add('is-active');

      /* Switch active panel */
      const panelId = btn.dataset.panel;
      MC.$$('.mc-profile-panel').forEach(p => p.classList.remove('is-active'));
      const target = MC.$(`#${panelId}`);
      if (target) target.classList.add('is-active');

      /* Archive tab easter egg */
      if (panelId === 'panel-archive') {
        MC.toast('This section is not available. It never was.', 'red', 3500);
      }

    }, '.mc-profile-tab');
  };

  /* ============================================
     RENDER POSTS PANEL
     ============================================ */

  const renderPostsPanel = (user) => {
    const panel = MC.$('#panel-posts');
    if (!panel) return;

    panel.innerHTML = '';

    const userPosts = MC.posts
      ? MC.posts.filter(p => p.userId === user.id)
      : [];

    if (!userPosts.length) {
      panel.innerHTML = `
        <div class="mc-notif-empty">
          <div class="mc-notif-empty-icon">◻</div>
          <div class="mc-notif-empty-title">No posts found.</div>
          <div class="mc-notif-empty-sub mc-mono">
            The posts may exist elsewhere.<br>
            Or they have not been written yet.
          </div>
        </div>
      `;
      return;
    }

    userPosts.forEach((post, i) => {
      if (typeof MC.feed !== 'undefined' && MC.feed.buildPostCard) {
        const card = MC.feed.buildPostCard(post, i * 0.08);
        if (card) panel.appendChild(card);
      }
    });
  };

  /* ============================================
     RENDER MEDIA PANEL
     ============================================ */

  const renderMediaPanel = (user) => {
    const panel = MC.$('#panel-media');
    if (!panel) return;

    const colorClasses = [
      'mc-post-grid-item--c0',
      'mc-post-grid-item--c1',
      'mc-post-grid-item--c2',
      'mc-post-grid-item--c3',
      'mc-post-grid-item--c4',
      'mc-post-grid-item--c5',
    ];

    const count = 9 + Math.floor(Math.random() * 6);
    let gridHTML = `<div class="mc-post-grid">`;

    for (let i = 0; i < count; i++) {
      const cls = colorClasses[i % colorClasses.length];
      gridHTML += `
        <div class="mc-post-grid-item ${cls}" data-index="${i}"></div>
      `;
    }

    gridHTML += `</div>`;
    panel.innerHTML = gridHTML;

    MC.on(panel, 'click', (e, item) => {
      MC.toast('This image was not taken by this user.', 'default', 2800);
    }, '.mc-post-grid-item');
  };

  /* ============================================
     RENDER ABOUT PANEL
     ============================================ */

  const renderAboutPanel = (user) => {
    const panel = MC.$('#panel-about');
    if (!panel) return;

    panel.innerHTML = `
      <div class="mc-about-panel">
        <div>
          <div class="mc-about-section-title">Information</div>

          <div class="mc-about-row">
            <span class="mc-about-icon">◎</span>
            <div>
              <div class="mc-about-label">Location</div>
              <div class="mc-about-value">
                ${user.location ? MC.escape(user.location) : 'Not provided.'}
              </div>
            </div>
          </div>

          <div class="mc-about-row">
            <span class="mc-about-icon">◷</span>
            <div>
              <div class="mc-about-label">Member Since</div>
              <div class="mc-about-value">${MC.escape(user.joined)}</div>
              <div class="mc-about-value--wrong">
                [ also: before the platform existed ]
              </div>
            </div>
          </div>

          <div class="mc-about-row">
            <span class="mc-about-icon">◻</span>
            <div>
              <div class="mc-about-label">Posts</div>
              <div class="mc-about-value">${MC.escape(user.posts)}</div>
            </div>
          </div>

          <div class="mc-about-row">
            <span class="mc-about-icon">⬡</span>
            <div>
              <div class="mc-about-label">Account Status</div>
              <div class="mc-about-value">Active</div>
              <div class="mc-about-value--wrong">
                [ activity recorded before login ]
              </div>
            </div>
          </div>

          <div class="mc-about-row">
            <span class="mc-about-icon">◈</span>
            <div>
              <div class="mc-about-label">Verified</div>
              <div class="mc-about-value">
                ${user.verified ? 'Yes — identity confirmed.' : 'No — identity approximate.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  /* ============================================
     RENDER ARCHIVE PANEL
     ============================================ */

  const renderArchivePanel = () => {
    const panel = MC.$('#panel-archive');
    if (!panel) return;

    panel.innerHTML = `
      <div class="mc-notif-empty">
        <div class="mc-notif-empty-icon">▣</div>
        <div class="mc-notif-empty-title">Access Restricted.</div>
        <div class="mc-notif-empty-sub mc-mono">
          This section contains posts that<br>
          have not been written yet.<br><br>
          Check back when you are ready.<br>
          We will know when that is.
        </div>
      </div>
    `;
  };

  /* ============================================
     INIT
     ============================================ */

  const init = () => {
    const user = resolveUser();
    if (!user) return;

    /* Set page title */
    document.title = `${user.name} — The Mindless Corridor`;

    renderCover();
    renderHeader(user);
    renderTabs();
    renderPostsPanel(user);
    renderMediaPanel(user);
    renderAboutPanel(user);
    renderArchivePanel();
  };

  return { init };

})();

document.addEventListener('DOMContentLoaded', MC.profile.init);

window.MC = MC;