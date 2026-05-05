/* ============================================
   THE MINDLESS CORRIDOR — feed.js
   Renders the story rail, compose box,
   feed tabs, post cards, and sidebar.
   Handles all feed interactions.
   ============================================ */

'use strict';

var MC = window.MC || {};

MC.feed = (() => {

  /* ============================================
     STORY RAIL
     ============================================ */

  const renderStoryRail = () => {
    const rail = MC.$('.mc-story-rail');
    if (!rail || !MC.stories) return;

    rail.innerHTML = '';

    MC.stories.forEach(story => {
      const user = MC.getUser(story.userId);
      if (!user) return;

      const item = MC.el('div', { class: 'mc-story-item' });

      const ringClass = story.seen
        ? 'mc-story-ring mc-story-ring--seen'
        : 'mc-story-ring mc-story-ring--unseen';

      item.innerHTML = `
        <div class="${ringClass}">
          <div class="mc-story-avatar-wrap">
            <div class="mc-avatar mc-avatar--sm ${user.avatarClass}"
                 aria-label="${MC.escape(user.name)}">
              ${MC.escape(user.avatar)}
            </div>
          </div>
        </div>
        <span class="mc-story-name mc-truncate">${MC.escape(user.name.split(' ')[0])}</span>
      `;

      item.addEventListener('click', () => {
        story.seen = true;
        const ring = MC.$('.mc-story-ring', item);
        if (ring) {
          ring.classList.remove('mc-story-ring--unseen');
          ring.classList.add('mc-story-ring--seen');
        }
        MC.toast('Story viewed. It was not what you expected.', 'blue');
      });

      rail.appendChild(item);
    });
  };

  /* ============================================
     COMPOSE BOX
     ============================================ */

  const renderCompose = () => {
    const wrap = MC.$('.mc-compose');
    if (!wrap) return;

    const currentUser = MC.users[0];

    wrap.innerHTML = `
      <div class="mc-compose-top">
        <div class="mc-avatar mc-avatar--md ${currentUser.avatarClass}">
          ${MC.escape(currentUser.avatar)}
        </div>
        <textarea
          class="mc-compose-textarea"
          maxlength="280"
          rows="2"
          placeholder="What is almost on your mind?"
        ></textarea>
      </div>
      <div class="mc-compose-bottom">
        <div class="mc-compose-actions">
          <button class="mc-compose-action-btn" title="Image">
            🖼
            <span class="Stars">✦</span>
          </button>
          <button class="mc-compose-action-btn" title="Tag">
            🏷
            <span class="Stars">✦</span>
          </button>
          <button class="mc-compose-action-btn" title="Feeling">
            ◎
            <span class="Stars">✦</span>
          </button>
        </div>
        <div class="mc-flex mc-gap-3">
          <span class="mc-compose-char-count mc-mono">280</span>
          <button class="mc-btn mc-btn--sm mc-compose-submit">
            Post
            <span class="Stars">✦</span>
          </button>
        </div>
      </div>
    `;
  };

  /* ============================================
     FEED TABS
     ============================================ */

  const renderTabs = () => {
    const wrap = MC.$('.mc-feed-tabs');
    if (!wrap) return;

    const tabs = ['For You', 'Following', 'Recent', 'Unsettling'];

    wrap.innerHTML = tabs.map((label, i) => `
      <button class="mc-feed-tab ${i === 0 ? 'is-active' : ''}" data-tab="${i}">
        ${MC.escape(label)}
        <span class="Stars">✦</span>
      </button>
    `).join('');

    MC.on(wrap, 'click', (e, btn) => {
      MC.$$('.mc-feed-tab', wrap).forEach(t => t.classList.remove('is-active'));
      btn.classList.add('is-active');

      const tab = parseInt(btn.dataset.tab, 10);
      if (tab === 3) {
        MC.toast('Content warning: this tab contains the future.', 'red');
      }
    }, '.mc-feed-tab');
  };

  /* ============================================
     BUILD POST CARD
     ============================================ */

  const buildPostCard = (post, delay = 0) => {
    const user = MC.getUser(post.userId);
    if (!user) return null;

    const card = MC.el('article', {
      class: 'mc-post mc-post-arrive',
      data: { postId: post.id, userId: post.userId },
    });

    if (delay) card.style.animationDelay = `${delay}s`;

    const tagHTML = post.tag
      ? `<div class="mc-post-tag">
           <span class="mc-pill mc-pill--ghost">#${MC.escape(post.tag)}</span>
         </div>`
      : '';

    card.innerHTML = `
      <div class="mc-post-header">
        <div class="mc-post-identity">
          <a href="profile.html?u=${user.id}" class="mc-avatar mc-avatar--md ${user.avatarClass}" aria-label="${MC.escape(user.name)}">
            ${MC.escape(user.avatar)}
          </a>
          <div class="mc-post-meta">
            <a href="profile.html?u=${user.id}" class="mc-post-name">${MC.escape(user.name)}</a>
            <span class="mc-post-handle">${MC.escape(user.handle)}</span>
          </div>
        </div>
        <span class="mc-post-time mc-mono">${MC.escape(post.time)}</span>
      </div>

      <div class="mc-post-body">
        ${MC.corruptText(post.body)}
      </div>

      ${tagHTML}

      <div class="mc-post-footer">
        <div class="mc-post-reactions">
          <button class="mc-reaction-btn mc-reaction-btn--like ${post.liked ? 'is-active' : ''}"
                  data-action="like" aria-label="Like">
            ${post.liked ? '♥' : '♡'}
            <span class="mc-reaction-count">${MC.formatCount(post.likes)}</span>
            <span class="Stars">✦</span>
          </button>
          <button class="mc-reaction-btn mc-reaction-btn--comment"
                  data-action="comment" aria-label="Comment">
            ◻
            <span class="mc-reaction-count">${MC.formatCount(post.comments)}</span>
            <span class="Stars">✦</span>
          </button>
          <button class="mc-reaction-btn mc-reaction-btn--share"
                  data-action="share" aria-label="Share">
            ↗
            <span class="mc-reaction-count">${MC.formatCount(post.shares)}</span>
            <span class="Stars">✦</span>
          </button>
        </div>
        <a href="post.html?p=${post.id}" class="mc-mono" style="font-size:var(--mc-text-xs);color:var(--mc-white-ghost);text-decoration:none;">
          View post →
        </a>
      </div>
    `;

    bindPostInteractions(card, post);
    return card;
  };

  /* ============================================
     POST INTERACTIONS
     ============================================ */

  const bindPostInteractions = (card, post) => {
    MC.on(card, 'click', (e, btn) => {
      const action = btn.dataset.action;

      if (action === 'like') {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;

        btn.classList.toggle('is-active', post.liked);
        btn.querySelector('.mc-reaction-icon, span:first-child') ;
        btn.childNodes[0].textContent = post.liked ? '♥' : '♡';

        const count = MC.$('.mc-reaction-count', btn);
        if (count) count.textContent = MC.formatCount(post.likes);

        MC.animateOnce(btn, 'mc-heart-pop');

        if (post.liked) {
          const msgs = [
            'They know you liked that.',
            'Noted.',
            'Your preference has been recorded.',
          ];
          MC.toast(MC.pick(msgs), 'blue', 2500);
        }
      }

      if (action === 'comment') {
        window.location.href = `post.html?p=${post.id}`;
      }

      if (action === 'share') {
        MC.toast('Shared. With everyone. Even those you did not intend.', 'default', 3500);
        const count = MC.$('.mc-reaction-count', btn);
        if (count) {
          post.shares += 1;
          count.textContent = MC.formatCount(post.shares);
        }
      }

    }, '[data-action]');
  };

  /* ============================================
     RENDER FEED
     ============================================ */

  const renderFeed = () => {
    const col = MC.$('.mc-feed-col');
    if (!col || !MC.posts) return;

    MC.posts.forEach((post, i) => {
      const card = buildPostCard(post, i * 0.06);
      if (card) col.appendChild(card);
    });
  };

  /* ============================================
     INJECT USER POST
     Called by ambient.js after compose submit
     ============================================ */

  const injectUserPost = (text) => {
    const col = MC.$('.mc-feed-col');
    if (!col) return;

    const fakePost = {
      id: 'user-' + Date.now(),
      userId: 'u01',
      body: text,
      time: 'just now',
      likes: 0,
      comments: 0,
      shares: 0,
      tag: null,
      liked: false,
    };

    const card = buildPostCard(fakePost, 0);
    if (!card) return;

    card.style.borderColor = 'var(--mc-blue-dim)';

    /* Insert after compose box */
    const compose = MC.$('.mc-compose');
    if (compose && compose.nextSibling) {
      col.insertBefore(card, compose.nextSibling);
    } else {
      col.prepend(card);
    }

    setTimeout(() => {
      card.style.borderColor = '';
    }, 2000);
  };

  /* ============================================
     SIDEBAR — WHO TO FOLLOW
     ============================================ */

  const renderSuggestedUsers = () => {
    const wrap = MC.$('.mc-who-list');
    if (!wrap || !MC.suggested) return;

    MC.suggested.forEach(uid => {
      const user = MC.getUser(uid);
      if (!user) return;

      const item = MC.el('div', { class: 'mc-who-item' });
      item.innerHTML = `
        <div class="mc-avatar mc-avatar--sm ${user.avatarClass}">
          ${MC.escape(user.avatar)}
        </div>
        <div class="mc-who-meta">
          <a href="profile.html?u=${user.id}" class="mc-who-name">${MC.escape(user.name)}</a>
          <span class="mc-who-handle">${MC.escape(user.handle)}</span>
        </div>
        <button class="mc-btn mc-btn--follow mc-btn--sm" data-uid="${user.id}">
          Follow
          <span class="Stars">✦</span>
        </button>
      `;

      const btn = MC.$('button', item);
      btn.addEventListener('click', () => {
        const isFollowing = btn.classList.toggle('is-following');
        btn.childNodes[0].textContent = isFollowing ? 'Following' : 'Follow';
        const msgs = isFollowing
          ? ['Following. They have been notified.', 'Connected.', 'They already knew.']
          : ['Unfollowed. They noticed.', 'Disconnected. For now.'];
        MC.toast(MC.pick(msgs), 'blue', 2800);
      });

      wrap.appendChild(item);
    });
  };

  /* ============================================
     SIDEBAR — TRENDING
     ============================================ */

  const renderTrending = () => {
    const wrap = MC.$('.mc-trending-list');
    if (!wrap || !MC.trending) return;

    MC.trending.forEach(item => {
      const el = MC.el('div', { class: 'mc-trending-item' });
      el.innerHTML = `
        <div class="mc-trending-rank mc-mono">${MC.escape(item.rank)} · Trending</div>
        <div class="mc-trending-tag">${MC.escape(item.tag)}</div>
        <div class="mc-trending-count mc-mono">${MC.escape(item.count)}</div>
      `;
      el.addEventListener('click', () => {
        MC.toast(`${item.tag} — ${item.count}. All posts are monitored.`, 'default', 3000);
      });
      wrap.appendChild(el);
    });
  };

  /* ============================================
     INIT
     ============================================ */

  const init = () => {
    renderStoryRail();
    renderCompose();
    renderTabs();
    renderFeed();
    renderSuggestedUsers();
    renderTrending();
  };

  return { init, injectUserPost, buildPostCard };

})();

document.addEventListener('DOMContentLoaded', MC.feed.init);

window.MC = MC;