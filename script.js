/* =====================================================
   NEXT GENIUS GROWTH — script.js
   Commun à toutes les pages (index, services, apropos, contact)
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  injectAIWidget();
  initPopup();
  initRevealAnimations();
  initCounters();
  initServiceFloatingCard();
  initBurgerMenu();
});

/* =====================================================
   2. POPUP (uniquement si présente sur la page)
   ===================================================== */
function initPopup(){
  const popupOverlay = document.getElementById('popupOverlay');
  if(!popupOverlay) return;

  const closeBtn = document.getElementById('popupClose');
  const form = document.getElementById('popupForm');

  closeBtn?.addEventListener('click', closePopup);
  popupOverlay.addEventListener('click', (e) => {
    if(e.target === popupOverlay) closePopup();
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closePopup();
  });
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.textContent = 'Merci, à bientôt !';
    setTimeout(closePopup, 1400);
  });

  // Si pas de préchargeur sur cette page (services/apropos/contact),
  // on ouvre la popup après un court délai d'arrivée sur la page.
  if(!document.getElementById('preloader')){
    setTimeout(openPopup, 6000);
  }
}
function openPopup(){
  document.getElementById('popupOverlay')?.classList.add('open');
}
function closePopup(){
  document.getElementById('popupOverlay')?.classList.remove('open');
}

/* =====================================================
   3. ASSISTANT IA — injecté automatiquement sur CHAQUE page
   ===================================================== */
function injectAIWidget(){
  if(document.getElementById('aiToggle')) return;

  const holder = document.createElement('div');
  holder.innerHTML = `
    <button id="aiToggle" class="ai-toggle" aria-label="Ouvrir l'assistant IA">
      <span class="ping"></span>
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2a4 4 0 0 0-4 4v1a4 4 0 0 0-2 3.46V13a4 4 0 0 0 2 3.46V17a4 4 0 0 0 8 0v-.54A4 4 0 0 0 18 13v-2.54A4 4 0 0 0 16 7V6a4 4 0 0 0-4-4z"/>
        <circle cx="9.5" cy="10.5" r=".5" fill="#fff"/>
        <circle cx="14.5" cy="10.5" r=".5" fill="#fff"/>
      </svg>
    </button>
    <div id="aiChat" class="ai-chat">
      <div class="ai-chat-head">
        <img src="assets/logo.png" alt="IA">
        <div>
          <strong>Assistant Next Genius</strong>
          <span>En ligne</span>
        </div>
        <button id="aiChatClose" class="ai-chat-close" aria-label="Fermer le chat">✕</button>
      </div>
      <div id="aiChatBody" class="ai-chat-body">
        <div class="ai-msg bot">Bonjour 👋 Je suis l'assistant IA de Next Genius Growth, présent sur toutes nos pages. Comment puis-je vous aider aujourd'hui ?</div>
      </div>
      <form id="aiChatForm" class="ai-chat-foot">
        <input id="aiChatInput" type="text" placeholder="Écrivez votre message..." autocomplete="off">
        <button type="submit" aria-label="Envoyer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/></svg>
        </button>
      </form>
    </div>
  `;
  document.body.appendChild(holder);

  const aiToggle = document.getElementById('aiToggle');
  const aiChat = document.getElementById('aiChat');
  const aiChatClose = document.getElementById('aiChatClose');
  const aiChatBody = document.getElementById('aiChatBody');
  const aiChatForm = document.getElementById('aiChatForm');
  const aiChatInput = document.getElementById('aiChatInput');

  const botReplies = [
    "Bonne question ! Un membre de notre équipe peut vous donner tous les détails, voulez-vous qu'on planifie un appel ?",
    "Nous pouvons certainement vous aider sur ce point. Pouvez-vous préciser votre secteur d'activité ?",
    "Nos offres démarrent avec un audit gratuit de 30 minutes. Souhaitez-vous réserver un créneau ?",
    "Je note votre demande. Un expert Next Genius Growth vous recontactera très vite au +225 01 05 50 63 77.",
    "Excellent choix ! Voulez-vous que je vous envoie plus d'informations à goldgeniusgeneration@gmail.com ?"
  ];

  function toggleChat(){ aiChat.classList.toggle('open'); }
  aiToggle.addEventListener('click', toggleChat);
  aiChatClose.addEventListener('click', toggleChat);

  function addMessage(text, sender){
    const msg = document.createElement('div');
    msg.className = 'ai-msg ' + sender;
    msg.textContent = text;
    aiChatBody.appendChild(msg);
    aiChatBody.scrollTop = aiChatBody.scrollHeight;
  }
  function showTyping(){
    const typing = document.createElement('div');
    typing.className = 'ai-typing';
    typing.id = 'aiTyping';
    typing.innerHTML = '<span></span><span></span><span></span>';
    aiChatBody.appendChild(typing);
    aiChatBody.scrollTop = aiChatBody.scrollHeight;
  }
  function removeTyping(){
    document.getElementById('aiTyping')?.remove();
  }

  aiChatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = aiChatInput.value.trim();
    if(!value) return;
    addMessage(value, 'user');
    aiChatInput.value = '';
    showTyping();
    setTimeout(() => {
      removeTyping();
      const reply = botReplies[Math.floor(Math.random() * botReplies.length)];
      addMessage(reply, 'bot');
    }, 1100 + Math.random() * 700);
  });
}

/* =====================================================
   4. ANIMATIONS AU DÉFILEMENT (reveal on scroll)
   ===================================================== */
function initRevealAnimations(){
  const items = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom');
  if(!items.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  items.forEach(el => obs.observe(el));
}

/* =====================================================
   5. COMPTEURS ANIMÉS (statistiques)
   ===================================================== */
function initCounters(){
  const counters = document.querySelectorAll('.counter');
  if(!counters.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => obs.observe(c));
}
function animateCounter(el){
  const target = parseInt(el.dataset.target, 10) || 0;
  const suffix = el.dataset.suffix || '';
  const duration = 1500;
  const start = performance.now();

  function step(now){
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if(p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* =====================================================
   6. FENÊTRE FLOTTANTE — page Services uniquement
   ===================================================== */
function initServiceFloatingCard(){
  const card = document.getElementById('floatingServiceCard');
  if(!card) return;
  const tab = document.getElementById('floatingServiceTab');
  const closeBtn = document.getElementById('floatingServiceClose');

  setTimeout(() => card.classList.add('open'), 2200);

  closeBtn?.addEventListener('click', () => {
    card.classList.remove('open');
    setTimeout(() => tab?.classList.add('show'), 300);
  });
  tab?.addEventListener('click', () => {
    tab.classList.remove('show');
    card.classList.add('open');
  });
}

/* =====================================================
   7. MENU BURGER (mobile)
   ===================================================== */
function initBurgerMenu(){
  const burger = document.querySelector('.burger');
  const links = document.querySelector('.nav-links');
  if(!burger || !links) return;
  burger.addEventListener('click', () => {
    links.classList.toggle('mobile-open');
  });
}
