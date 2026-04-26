/* ============================================
   ABYSSAL — shop.js
   Shop data, cart logic, checkout theater
   ============================================ */

(function () {

  // --- Full product catalog ---
  window.AbyssalShopData = [

    // --- DIGITAL GOODS ---
    {
      id: 'dg-001', category: 'digital',
      name: 'Coordinates to Nowhere',
      desc: 'A set of GPS coordinates that appear on no known map. Verified by three sources who no longer respond to messages.',
      price: '∅ 14.00', icon: '📍',
      stock: 'low'
    },
    {
      id: 'dg-002', category: 'digital',
      name: 'Things You Cannot Unread',
      desc: 'A 47-page PDF. Contents undisclosed. Several buyers have requested we stop sending follow-up emails. We have not stopped.',
      price: '∅ 9.00', icon: '📄',
      stock: 'available'
    },
    {
      id: 'dg-003', category: 'digital',
      name: 'Encrypted Archive — Contents Unknown',
      desc: 'A 2.3GB encrypted file. No password included. Buyers report the password arriving on its own. Eventually.',
      price: '∅ 22.00', icon: '🗄️',
      stock: 'available'
    },
    {
      id: 'dg-004', category: 'digital',
      name: 'Nightmare Soundtrack Vol. 1',
      desc: 'Recorded inside a lucid dream. The artist has not released a Vol. 2. The artist does not sleep anymore.',
      price: '∅ 11.00', icon: '🎵',
      stock: 'available'
    },
    {
      id: 'dg-005', category: 'digital',
      name: 'Frequency 00.0',
      desc: 'A single audio file, 63 minutes long. Do not listen with headphones. Do not listen alone. Do not listen more than once.',
      price: '∅ 18.00', icon: '📻',
      stock: 'low'
    },
    {
      id: 'dg-006', category: 'digital',
      name: 'The Last Search Query',
      desc: 'A text file containing the final search query of 12 individuals. Context not provided. Context not necessary.',
      price: '∅ 7.00', icon: '🔍',
      stock: 'available'
    },
    {
      id: 'dg-007', category: 'digital',
      name: 'Someone Else\'s Deleted Memories',
      desc: 'Recovered from a hard drive wiped 47 times. Something always remains. Sold as-is.',
      price: '∅ 33.00', icon: '💾',
      stock: 'available'
    },
    {
      id: 'dg-008', category: 'digital',
      name: 'A Phone Number That Calls Back',
      desc: 'Do not call it. Simply possess it. It will call you at 3:00am on a date it chooses.',
      price: '∅ 41.00', icon: '☎️',
      stock: 'low'
    },
    {
      id: 'dg-009', category: 'digital',
      name: 'QR Code That Changes',
      desc: 'Scan it now. Scan it tomorrow. It will never point to the same place twice. We do not know where it points.',
      price: '∅ 16.00', icon: '⬛',
      stock: 'available'
    },
    {
      id: 'dg-010', category: 'digital',
      name: 'IP Addresses You Should Not Visit',
      desc: 'A list of 9 IP addresses. Annotated. The annotations are not ours. We do not know whose they are.',
      price: '∅ 28.00', icon: '🌐',
      stock: 'available'
    },

    // --- PHYSICAL CURIOSITIES ---
    {
      id: 'ph-001', category: 'curiosities',
      name: 'Bottled Fog',
      desc: 'Collected at 3:47am from a location we are not permitted to name. The fog does not dissipate. It waits.',
      price: '∅ 38.00', icon: '🫙',
      stock: 'available'
    },
    {
      id: 'ph-002', category: 'curiosities',
      name: 'Ash from a Book That Burned Itself',
      desc: 'No accelerant was used. No source of ignition was present. The book burned. We collected what remained.',
      price: '∅ 24.00', icon: '🏺',
      stock: 'low'
    },
    {
      id: 'ph-003', category: 'curiosities',
      name: 'A Jar of Preserved Silence',
      desc: 'Sealed in an anechoic chamber at exactly midnight. Open it only once. Silence, once released, does not return.',
      price: '∅ 52.00', icon: '🫙',
      stock: 'available'
    },
    {
      id: 'ph-004', category: 'curiosities',
      name: 'Water from a Well With No Bottom',
      desc: '4oz. Do not drink. Do not pour it out. Simply keep it. It will tell you what to do next.',
      price: '∅ 19.00', icon: '💧',
      stock: 'low'
    },
    {
      id: 'ph-005', category: 'curiosities',
      name: 'Teeth — Origin Unknown',
      desc: 'A collection of 7. Not human. Not quite not human. Kept in a cloth pouch that smells like rain.',
      price: '∅ 44.00', icon: '🦷',
      stock: 'available'
    },
    {
      id: 'ph-006', category: 'curiosities',
      name: 'Soil from a Grave Marked Tomorrow',
      desc: 'The headstone was already there. The date had not yet passed when this was collected.',
      price: '∅ 31.00', icon: '⚱️',
      stock: 'available'
    },
    {
      id: 'ph-007', category: 'curiosities',
      name: 'A Candle That Rekindles',
      desc: 'Blow it out. Leave the room. Return. We take no responsibility for what you find when you return.',
      price: '∅ 27.00', icon: '🕯️',
      stock: 'available'
    },
    {
      id: 'ph-008', category: 'curiosities',
      name: 'Sand from a Beach With No Shore',
      desc: 'Described by the collector as: "I could see the water. I could not reach it. I walked for six hours."',
      price: '∅ 17.00', icon: '⏳',
      stock: 'available'
    },
    {
      id: 'ph-009', category: 'curiosities',
      name: 'A Stone That Is Always Warm',
      desc: 'No radioactivity detected. No explanation offered. The warmth is consistent. The warmth is deliberate.',
      price: '∅ 36.00', icon: '🪨',
      stock: 'low'
    },
    {
      id: 'ph-010', category: 'curiosities',
      name: 'Mirror That Arrived on Its Own',
      desc: 'Found outside our facility. No shipping label. No sender. It reflects accurately except for one detail we will not specify.',
      price: '∅ 89.00', icon: '🪞',
      stock: 'low'
    },

    // --- ARCANE INSTRUMENTS ---
    {
      id: 'ar-001', category: 'arcane',
      name: 'Compass That Doesn\'t Point North',
      desc: 'It points consistently. Just not north. We have followed it. We did not reach a place we could describe.',
      price: '∅ 63.00', icon: '🧭',
      stock: 'available'
    },
    {
      id: 'ar-002', category: 'arcane',
      name: 'Clock Running Counterclockwise',
      desc: 'Keeps perfect time. Backwards. Owners report a growing sense that they are early for something.',
      price: '∅ 77.00', icon: '🕰️',
      stock: 'available'
    },
    {
      id: 'ar-003', category: 'arcane',
      name: 'Key With No Known Lock',
      desc: 'Ornate. Heavy. Cold to the touch regardless of ambient temperature. You will know the lock when you see it.',
      price: '∅ 55.00', icon: '🗝️',
      stock: 'available'
    },
    {
      id: 'ar-004', category: 'arcane',
      name: 'Wax Seals — Unknown Origin',
      desc: 'Set of 6. Symbols have no recorded origin. Three symbologists refused to comment after examination.',
      price: '∅ 29.00', icon: '🔮',
      stock: 'available'
    },
    {
      id: 'ar-005', category: 'arcane',
      name: 'Hourglass — Sand Flows Both Ways',
      desc: 'Simultaneously. The mechanism has been examined by two engineers. Both retired shortly after.',
      price: '∅ 112.00', icon: '⌛',
      stock: 'low'
    },
    {
      id: 'ar-006', category: 'arcane',
      name: 'Pendulum That Anticipates',
      desc: 'Swings before you touch it. Stops before you tell it to. Do not ask it questions you do not want answered.',
      price: '∅ 84.00', icon: '🕹️',
      stock: 'available'
    },
    {
      id: 'ar-007', category: 'arcane',
      name: 'A Skeleton Key Made of Bone',
      desc: 'Unidentified species. Carved, not cast. The carving is too fine for any tool we could find evidence of.',
      price: '∅ 96.00', icon: '🦴',
      stock: 'low'
    },
    {
      id: 'ar-008', category: 'arcane',
      name: 'Prism That Casts No Light',
      desc: 'Hold it to any light source. Nothing passes through. Somehow, you can still see it perfectly.',
      price: '∅ 48.00', icon: '🔷',
      stock: 'available'
    },

    // --- MEDIA & DOCUMENTS ---
    {
      id: 'md-001', category: 'media',
      name: 'VHS — "Do Not Watch Alone"',
      desc: 'Label handwritten. Content unknown. Runtime appears to change depending on when you begin watching.',
      price: '∅ 23.00', icon: '📼',
      stock: 'available'
    },
    {
      id: 'md-002', category: 'media',
      name: 'Letters Found in an Abandoned Building',
      desc: 'Bundle of 11. Addressed to no one. Written in second person. The details are specific. The details may concern you.',
      price: '∅ 34.00', icon: '✉️',
      stock: 'available'
    },
    {
      id: 'md-003', category: 'media',
      name: 'Journal With Future Dates',
      desc: 'Entries dated up to 14 months from now. The handwriting changes on page 38. So does the tone.',
      price: '∅ 67.00', icon: '📓',
      stock: 'low'
    },
    {
      id: 'md-004', category: 'media',
      name: 'Cassette — "Frequency 00.0 (Original)"',
      desc: 'The source recording. Predates the digital version by an unknown amount of time. The tape is warm.',
      price: '∅ 45.00', icon: '📼',
      stock: 'low'
    },
    {
      id: 'md-005', category: 'media',
      name: 'Polaroid — Subject Unknown',
      desc: 'The figure in the photograph is not identifiable. The location is not identifiable. The date on the back is not a real date.',
      price: '∅ 21.00', icon: '📷',
      stock: 'available'
    },
    {
      id: 'md-006', category: 'media',
      name: 'Map of a Building That Was Never Built',
      desc: 'Architectural blueprints. Stamped APPROVED. No record of permit. No record of architect. The building does not exist.',
      price: '∅ 39.00', icon: '🗺️',
      stock: 'available'
    },
    {
      id: 'md-007', category: 'media',
      name: 'Manuscript — Author Redacted',
      desc: '312 pages. Every instance of the author\'s name has been removed. By the author. Before submission.',
      price: '∅ 58.00', icon: '📜',
      stock: 'available'
    },

    // --- TECH & DATA ---
    {
      id: 'td-001', category: 'tech',
      name: 'Hard Drive — Wiped 47 Times',
      desc: 'Something remains. We have not looked at what remains. That is your decision to make, not ours.',
      price: '∅ 73.00', icon: '💿',
      stock: 'available'
    },
    {
      id: 'td-002', category: 'tech',
      name: 'USB Drive — Do Not Plug In',
      desc: 'Contents verified as non-malicious by a technician who has since moved away and changed their name.',
      price: '∅ 31.00', icon: '🖥️',
      stock: 'available'
    },
    {
      id: 'td-003', category: 'tech',
      name: 'Signal Detector — Pre-calibrated',
      desc: 'Calibrated to a specific frequency we will not disclose. It has been going off constantly since calibration.',
      price: '∅ 88.00', icon: '📡',
      stock: 'low'
    },
    {
      id: 'td-004', category: 'tech',
      name: 'Router — One Previous Owner',
      desc: 'Logs have been cleared. The logs have come back. We cleared them again. They came back with more entries.',
      price: '∅ 42.00', icon: '📶',
      stock: 'available'
    },
    {
      id: 'td-005', category: 'tech',
      name: 'Camera — Always Recording',
      desc: 'The off switch functions correctly in all tested conditions except one we are not able to reproduce on demand.',
      price: '∅ 119.00', icon: '📸',
      stock: 'available'
    }
  ];

  // --- Cart state ---
  const cart = [];

  // --- Cart UI elements ---
  let cartSidebar   = null;
  let cartItemsEl   = null;
  let cartCountEl   = null;
  let cartTotalEl   = null;
  let checkoutModal = null;

  // --- Render cart items ---
  function renderCart() {
    if (!cartItemsEl) return;
    cartItemsEl.innerHTML = '';

    if (cart.length === 0) {
      cartItemsEl.innerHTML = `
        <p class="cart-empty-msg">
          YOUR CART IS EMPTY<br><br>
          the void awaits your selections
        </p>`;
      if (cartTotalEl) cartTotalEl.textContent = '∅ 0.00';
      return;
    }

    let total = 0;
    cart.forEach((item, idx) => {
      const price = parseFloat(item.price.replace('∅ ', ''));
      total += price;

      const el = document.createElement('div');
      el.classList.add('cart-item');
      el.innerHTML = `
        <span class="cart-item-name">${item.icon} ${item.name}</span>
        <span class="cart-item-price">${item.price}</span>
        <button class="cart-close" data-idx="${idx}" style="font-size:0.9rem;">✕</button>
      `;
      el.querySelector('[data-idx]').addEventListener('click', () => {
        cart.splice(idx, 1);
        renderCart();
        updateCartCount();
        if (window.AbyssalAudio) window.AbyssalAudio.playGlitch();
      });
      cartItemsEl.appendChild(el);
    });

    if (cartTotalEl) {
      cartTotalEl.textContent = '∅ ' + total.toFixed(2);
    }
  }

  // --- Update cart count badge ---
  function updateCartCount() {
    if (!cartCountEl) return;
    cartCountEl.textContent = cart.length;
    cartCountEl.classList.remove('bump');
    void cartCountEl.offsetWidth;
    cartCountEl.classList.add('bump');
  }

  // --- Add to cart ---
  function addToCart(item) {
    cart.push(item);
    renderCart();
    updateCartCount();
    if (window.AbyssalAudio) window.AbyssalAudio.playCartAdd();
    if (window.AbyssalEffects) {
      const btn = document.querySelector(`[data-id="${item.id}"]`);
      if (btn) {
        const r = btn.getBoundingClientRect();
        window.AbyssalEffects.spawnParticleBurst(
          r.left + r.width  / 2,
          r.top  + r.height / 2,
          14
        );
      }
    }
  }

  // --- Build shop grid ---
  function buildShopGrid(filter = 'all') {
    const grid = document.getElementById('shop-grid');
    if (!grid) return;

    grid.innerHTML = '';
    const items = filter === 'all'
      ? window.AbyssalShopData
      : window.AbyssalShopData.filter(i => i.category === filter);

    items.forEach(item => {
      const card = document.createElement('div');
      card.classList.add('shop-card');
      if (item.stock === 'low')  card.classList.add('low-stock');
      if (item.stock === 'void') card.classList.add('sold-out');

      card.innerHTML = `
        <div class="card-image-area">
          <span class="card-icon">${item.icon}</span>
        </div>
        <div class="card-body">
          <div class="card-category">${item.category.toUpperCase()}</div>
          <div class="card-title">${item.name}</div>
          <div class="card-desc">${item.desc}</div>
          <div class="card-footer">
            <span class="card-price-tag">${item.price}</span>
            <button
              class="add-to-cart-btn"
              data-id="${item.id}"
            >ACQUIRE</button>
          </div>
        </div>
      `;

      card.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(item);
      });

      card.addEventListener('mouseenter', () => {
        if (window.AbyssalAudio) window.AbyssalAudio.playHover();
      });

      grid.appendChild(card);
    });
  }

  // --- Filter buttons ---
  function initFilterBar() {
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        buildShopGrid(btn.dataset.filter);
        if (window.AbyssalAudio) window.AbyssalAudio.playGlitch();
      });
    });
  }

  // --- Cart sidebar toggle ---
  function initCartSidebar() {
    cartSidebar  = document.getElementById('cart-sidebar');
    cartItemsEl  = document.getElementById('cart-items');
    cartCountEl  = document.getElementById('cart-count');
    cartTotalEl  = document.getElementById('cart-total-price');
    const toggle = document.getElementById('cart-toggle');
    const close  = document.getElementById('cart-close');

    if (toggle) {
      toggle.addEventListener('click', () => {
        cartSidebar.classList.toggle('open');
        if (window.AbyssalAudio) window.AbyssalAudio.playGlitch();
      });
    }
    if (close) {
      close.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
      });
    }

    renderCart();
  }

  // --- Checkout modal ---
  function initCheckout() {
    checkoutModal   = document.getElementById('checkout-modal');
    const checkoutBtn = document.getElementById('checkout-btn');
    const closeBtn    = document.getElementById('checkout-modal-close');

    const messages = [
      'YOUR ORDER HAS BEEN RECEIVED.\n\nWe know where to send it.',
      'TRANSACTION COMPLETE.\n\nYou will not remember placing this order. That is normal.',
      'ACQUISITION CONFIRMED.\n\nExpect delivery between now and when you least expect it.',
      'ORDER LOGGED.\n\nThis purchase has been added to your permanent record.',
      'PAYMENT PROCESSED.\n\nThe void thanks you for your contribution.',
    ];

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        if (window.AbyssalAudio) window.AbyssalAudio.playCheckout();

        const msg = messages[Math.floor(Math.random() * messages.length)];
        const el  = document.getElementById('checkout-modal-msg');
        if (el) el.textContent = msg;

        if (checkoutModal) checkoutModal.classList.add('active');
        cartSidebar.classList.remove('open');

        // Clear cart after dramatic pause
        setTimeout(() => {
          cart.length = 0;
          renderCart();
          updateCartCount();
        }, 1200);
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (checkoutModal) checkoutModal.classList.remove('active');
      });
    }
  }

  // --- Boot ---
  function init() {
    buildShopGrid();
    initFilterBar();
    initCartSidebar();
    initCheckout();
  }

  window.addEventListener('DOMContentLoaded', init);

})();