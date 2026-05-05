/* ============================================
   THE MINDLESS CORRIDOR — post.js
   Reads the ?p= param, finds the post,
   builds the full expanded post view —
   header, body, reactions, comment thread,
   share panel, and related posts.
   ============================================ */

'use strict';

var MC = window.MC || {};

MC.post = (() => {

  /* ============================================
     RESOLVE POST FROM URL
     ============================================ */

  const resolvePost = () => {
    const params = new URLSearchParams(window.location.search);
    const pid = params.get('p');
    if (pid && MC.posts) {
      const found = MC.posts.find(p => p.id === pid);
      if (found) return found;
    }
    return MC.posts ? MC.posts[0] : null;
  };

  /* ============================================
     RENDER SINGLE POST
     ============================================ */

  const renderPost = (post) => {
    const wrap = MC.$('.mc-single-post');
    if (!wrap || !post) return;

    const user = MC.getUser(post.userId);
    if (!user) return;

    const useWrongTime = Math.random() < 0.4;
    const displayTime  = useWrongTime ? MC.wrongTime() : post.time;
    const timeClass    = useWrongTime
      ? 'mc-single-post-time-full mc-single-post-time-full--wrong'
      : 'mc-single-post-time-full';

    const tagHTML = post.tag
      ? `<span class="mc-pill mc-pill--blue">#${MC.escape(post.tag)}</span>`
      : '';

    wrap.innerHTML = `
      <div class="mc-single-post-header">
        <div class="mc-single-post-identity">
          <a href="profile.html?u=${user.id}"
             class="mc-avatar mc-avatar--lg ${user.avatarClass}"
             aria-label="${MC.escape(user.name)}">
            ${MC.escape(user.avatar)}
          </a>
          <div class="mc-single-post-meta">
            <a href="profile.html?u=${user.id}"
               class="mc-single-post-name">
              ${MC.escape(user.name)}
            </a>
            <span class="mc-single-post-handle">${MC.escape(user.handle)}</span>
          </div>
        </div>
        <button class="mc-btn mc-btn--follow mc-btn--sm" id="post-follow-btn">
          Follow
          <span class="Stars">✦</span>
        </button>
      </div>

      <div class="mc-single-post-body">
        <div class="mc-single-post-text">
          ${MC.corruptText(post.body)}
        </div>

        ${tagHTML ? `<div style="margin-bottom:var(--mc-space-4);">${tagHTML}</div>` : ''}

        <div class="mc-single-post-timestamp">
          <span class="${timeClass}">${MC.escape(displayTime)}</span>
          ${useWrongTime
            ? `<span class="mc-pill mc-pill--red" style="font-size:0.6rem;">timestamp anomaly</span>`
            : ''}
        </div>

        <div class="mc-single-post-reaction-summary">
          <div class="mc-reaction-summary-left">
            <div class="mc-reaction-summary-icons">♥ ◻ ↗</div>
            <span>${MC.formatCount(post.likes + post.comments + post.shares)} interactions</span>
          </div>
          <span class="mc-reaction-summary-right">
            ${MC.formatCount(post.comments)} comments
          </span>
        </div>

        <div class="mc-single-post-reactions">
          <button class="mc-reaction-btn mc-reaction-btn--like ${post.liked ? 'is-active' : ''}"
                  data-action="like">
            ${post.liked ? '♥' : '♡'}
            <span class="mc-reaction-count">${MC.formatCount(post.likes)}</span>
            <span class="Stars">✦</span>
          </button>
          <button class="mc-reaction-btn mc-reaction-btn--comment"
                  data-action="comment-scroll">
            ◻ Comment
            <span class="Stars">✦</span>
          </button>
          <button class="mc-reaction-btn mc-reaction-btn--share"
                  data-action="share">
            ↗ Share
            <span class="Stars">✦</span>
          </button>
        </div>
      </div>
    `;

    bindPostInteractions(wrap, post);
    bindFollowBtn(user);
  };

  /* ============================================
     POST INTERACTIONS
     ============================================ */

  const bindPostInteractions = (wrap, post) => {
    MC.on(wrap, 'click', (e, btn) => {
      const action = btn.dataset.action;

      if (action === 'like') {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;

        btn.classList.toggle('is-active', post.liked);
        btn.childNodes[0].textContent = post.liked ? '♥' : '♡';

        const count = MC.$('.mc-reaction-count', btn);
        if (count) count.textContent = MC.formatCount(post.likes);

        MC.animateOnce(btn, 'mc-heart-pop');

        if (post.liked) {
          const msgs = [
            'They know you liked that.',
            'Preference recorded.',
            'The author has been notified. They were already aware.',
          ];
          MC.toast(MC.pick(msgs), 'blue', 2800);
        }
      }

      if (action === 'comment-scroll') {
        const thread = MC.$('.mc-comment-thread');
        if (thread) {
          thread.scrollIntoView({ behavior: 'smooth', block: 'start' });
          const input = MC.$('.mc-comment-input', thread);
          if (input) setTimeout(() => input.focus(), 500);
        }
      }

      if (action === 'share') {
        post.shares += 1;
        MC.toast('Shared. With everyone. Even those you did not intend.', 'default', 3500);
      }

    }, '[data-action]');
  };

  /* ============================================
     FOLLOW BUTTON
     ============================================ */

  const bindFollowBtn = (user) => {
    const btn = MC.$('#post-follow-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isFollowing = btn.classList.toggle('is-following');
      btn.childNodes[0].textContent = isFollowing ? 'Following' : 'Follow';
      const msgs = isFollowing
        ? [
            `Now following ${user.name}.`,
            'Connected. They were already aware.',
            'Following. The feeling is not mutual yet.',
          ]
        : [`Unfollowed ${user.name}.`, 'Disconnected.'];
      MC.toast(MC.pick(msgs), 'blue', 2800);
    });
  };

  /* ============================================
     RENDER COMMENT THREAD
     ============================================ */

  const renderComments = (post) => {
    const thread = MC.$('.mc-comment-thread');
    if (!thread) return;

    const comments = (MC.comments && MC.comments[post.id]) || [];

    thread.innerHTML = `
      <div class="mc-comment-thread-header">
        <span class="mc-comment-thread-title">
          Comments (${comments.length})
        </span>
        <button class="mc-comment-thread-sort" data-action="sort">
          Sort: Most Wrong
          <span class="Stars">✦</span>
        </button>
      </div>

      <div class="mc-comment-compose">
        <div class="mc-avatar mc-avatar--sm ${MC.users[0].avatarClass}">
          ${MC.escape(MC.users[0].avatar)}
        </div>
        <div class="mc-comment-input-wrap">
          <textarea
            class="mc-comment-input"
            placeholder="Write a comment. It may be edited."
            rows="1"
          ></textarea>
        </div>
        <button class="mc-btn mc-btn--sm mc-comment-submit">
          Reply
          <span class="Stars">✦</span>
        </button>
      </div>

      <div class="mc-comment-list"></div>
    `;

    const list = MC.$('.mc-comment-list', thread);
    if (comments.length) {
      comments.forEach((comment, i) => {
        const el = buildComment(comment, i * 0.08);
        if (el) list.appendChild(el);
      });
    } else {
      list.innerHTML = `
        <div class="mc-notif-empty" style="padding:var(--mc-space-8);">
          <div class="mc-notif-empty-icon">◻</div>
          <div class="mc-notif-empty-sub mc-mono">
            No comments yet.<br>Be the first. Or the last.
          </div>
        </div>
      `;
    }

    bindCommentInteractions(thread, post, list);
  };

  /* ============================================
     BUILD COMMENT
     ============================================ */

  const buildComment = (comment, delay = 0) => {
    const user = MC.getUser(comment.userId);
    if (!user) return null;

    const el = MC.el('div', { class: 'mc-comment mc-notif-drop' });
    if (delay) el.style.animationDelay = `${delay}s`;

    el.innerHTML = `
      <div class="mc-avatar mc-avatar--sm ${user.avatarClass}">
        ${MC.escape(user.avatar)}
      </div>
      <div class="mc-comment-body">
        <div class="mc-comment-header">
          <a href="profile.html?u=${user.id}"
             class="mc-comment-author">
            ${MC.escape(user.name)}
          </a>
          <span class="mc-comment-time">${MC.escape(comment.time)}</span>
        </div>
        <div class="mc-comment-text">
          ${MC.corruptText(comment.text)}
        </div>
        <div class="mc-comment-actions">
          <button class="mc-comment-action" data-action="comment-like"
                  data-likes="${comment.likes}">
            ♡ ${MC.formatCount(comment.likes)}
            <span class="Stars">✦</span>
          </button>
          <button class="mc-comment-action" data-action="comment-reply">
            Reply
            <span class="Stars">✦</span>
          </button>
        </div>
      </div>
    `;

    return el;
  };

  /* ============================================
     COMMENT INTERACTIONS
     ============================================ */

  const bindCommentInteractions = (thread, post, list) => {
    /* Sort button */
    MC.on(thread, 'click', () => {
      MC.toast('Sorted. The order may not reflect reality.', 'default', 2500);
    }, '[data-action="sort"]');

    /* Submit comment */
    const submitBtn = MC.$('.mc-comment-submit', thread);
    const input     = MC.$('.mc-comment-input', thread);

    if (submitBtn && input) {
      submitBtn.addEventListener('click', () => {
        const val = input.value.trim();
        if (!val) return;

        const fakeComment = {
          id:     'c-user-' + Date.now(),
          userId: MC.users[0].id,
          text:   val,
          time:   'just now',
          likes:  0,
        };

        const el = buildComment(fakeComment);
        if (el) {
          el.style.borderColor = 'var(--mc-blue-dim)';
          list.prepend(el);
          setTimeout(() => { el.style.borderColor = ''; }, 2000);
        }

        input.value = '';

        const msgs = [
          'Comment posted. It has been noted.',
          'Your comment has been reviewed. Before you wrote it.',
          'Posted. Someone was waiting for this.',
        ];
        MC.toast(MC.pick(msgs), 'blue', 3000);
      });
    }

    /* Like / Reply on existing comments */
    MC.on(list, 'click', (e, btn) => {
      const action = btn.dataset.action;

      if (action === 'comment-like') {
        const current = parseInt(btn.dataset.likes, 10) || 0;
        const next = current + 1;
        btn.dataset.likes = next;
        btn.childNodes[0].textContent = `♥ ${MC.formatCount(next)}`;
        MC.animateOnce(btn, 'mc-heart-pop');
      }

      if (action === 'comment-reply') {
        if (input) {
          input.focus();
          MC.toast('Replying. They will see this.', 'default', 2000);
        }
      }

    }, '[data-action]');
  };

  /* ============================================
     RENDER SHARE PANEL
     ============================================ */

  const renderSharePanel = (post) => {
    const panel = MC.$('.mc-share-panel');
    if (!panel) return;

    const options = [
      { label: 'Copy Link',     icon: '⬡' },
      { label: 'Send Message',  icon: '◻' },
      { label: 'Embed Post',    icon: '◈' },
      { label: 'Report',        icon: '⚑' },
    ];

    const btnsHTML = options.map(o => `
      <button class="mc-share-btn" data-share="${o.label}">
        ${MC.escape(o.icon)} ${MC.escape(o.label)}
        <span class="Stars">✦</span>
      </button>
    `).join('');

    panel.innerHTML = `
      <div class="mc-share-title">Share This Post</div>
      <div class="mc-share-options">${btnsHTML}</div>
    `;

    const shareResponses = {
      'Copy Link':    'Link copied. It leads here. It has always led here.',
      'Send Message': 'Message sent. Delivery time: uncertain.',
      'Embed Post':   'Embed code generated. The post will embed itself.',
      'Report':       'Report submitted. We already knew.',
    };

    MC.on(panel, 'click', (e, btn) => {
      const key = btn.dataset.share;
      if (key && shareResponses[key]) {
        MC.toast(shareResponses[key], 'default', 3200);
      }
    }, '[data-share]');
  };

  /* ============================================
     RENDER RELATED POSTS
     ============================================ */

  const renderRelated = (post) => {
    const wrap = MC.$('.mc-related');
    if (!wrap || !MC.posts) return;

    const related = MC.posts
      .filter(p => p.id !== post.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    if (!related.length) return;

    let html = `
      <div class="mc-related-header">
        <div class="mc-related-title">You May Also Have Already Seen</div>
      </div>
    `;

    related.forEach(p => {
      const u = MC.getUser(p.userId);
      if (!u) return;
      html += `
        <a href="post.html?p=${p.id}" class="mc-related-item">
          <div class="mc-avatar mc-avatar--sm ${u.avatarClass}">
            ${MC.escape(u.avatar)}
          </div>
          <div class="mc-related-item-body">
            <div class="mc-related-item-text">${MC.escape(MC.truncate(p.body, 72))}</div>
            <div class="mc-related-item-meta">${MC.escape(u.name)} · ${MC.escape(p.time)}</div>
          </div>
        </a>
      `;
    });

    wrap.innerHTML = html;
  };

  /* ============================================
     INIT
     ============================================ */

  const init = () => {
    const post = resolvePost();
    if (!post) return;

    const user = MC.getUser(post.userId);
    document.title = user
      ? `${MC.truncate(post.body, 40)} — The Mindless Corridor`
      : 'Post — The Mindless Corridor';

    renderPost(post);
    renderComments(post);
    renderSharePanel(post);
    renderRelated(post);
  };

  return { init };

})();

document.addEventListener('DOMContentLoaded', MC.post.init);

window.MC = MC;