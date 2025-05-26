/**
 * Module de navigation
 * Gère le menu mobile, le défilement fluide vers les sections et les liens actifs
 */
document.addEventListener('DOMContentLoaded', () => {
  // Sélection des éléments
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Création dynamique du menu mobile
  const createMobileNav = () => {
    // Créer l'élément de menu mobile
    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    
    // Créer l'overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    
    // Créer le contenu du menu
    mobileNav.innerHTML = `
      <div class="mobile-nav-header">
        <div class="logo">
          <i class="fas fa-smile-beam logo-icon"></i>
          <h3>SentimentHub</h3>
        </div>
        <button class="mobile-nav-close" aria-label="Fermer">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <ul>
        <li><a href="#features" class="mobile-nav-link">Fonctionnalités</a></li>
        <li><a href="#how-it-works" class="mobile-nav-link">Comment ça marche</a></li>
        <li><a href="#demo" class="mobile-nav-link">Démo</a></li>
        <li><a href="#upload" class="mobile-nav-link">Commencer</a></li>
        <li class="mobile-theme-toggle">
          <span>Thème sombre</span>
          <label class="switch">
            <input type="checkbox" id="mobile-theme-switch">
            <span class="slider round"></span>
          </label>
        </li>
      </ul>
    `;
    
    // Ajouter le menu et l'overlay au body
    document.body.appendChild(mobileNav);
    document.body.appendChild(overlay);
    
    // Événement pour ouvrir le menu
    mobileMenuBtn.addEventListener('click', () => {
      mobileNav.classList.add('open');
      overlay.style.display = 'block';
      document.body.style.overflow = 'hidden'; // Empêcher le défilement
    });
    
    // Événement pour fermer le menu
    const closeMenu = () => {
      mobileNav.classList.remove('open');
      overlay.style.display = 'none';
      document.body.style.overflow = ''; // Réactiver le défilement
    };
    
    mobileNav.querySelector('.mobile-nav-close').addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
    
    // Synchroniser l'état du thème
    const mobileThemeSwitch = document.getElementById('mobile-theme-switch');
    mobileThemeSwitch.checked = document.getElementById('theme-switch').checked;
    
    // Écouter les changements de thème sur mobile
    mobileThemeSwitch.addEventListener('change', () => {
      document.getElementById('theme-switch').checked = mobileThemeSwitch.checked;
      document.getElementById('theme-switch').dispatchEvent(new Event('change'));
    });
    
    // Fermer le menu lors du clic sur un lien
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
    
    return { mobileNav, overlay, closeMenu };
  };
  
  const { closeMenu } = createMobileNav();
  
  // Défilement fluide vers les sections
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Calculer la position avec offset pour le header
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - headerHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Mettre à jour les liens actifs au défilement
  const sections = document.querySelectorAll('section[id]');
  
  const highlightActiveLink = () => {
    const scrollPosition = window.scrollY;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Supprimer la classe active de tous les liens
        navLinks.forEach(link => {
          link.classList.remove('active');
        });
        
        // Ajouter la classe active au lien correspondant
        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  };
  
  window.addEventListener('scroll', highlightActiveLink);
  
  // Animation du header au défilement
  let lastScrollTop = 0;
  const header = document.querySelector('header');
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScroll > lastScrollTop && currentScroll > 100) {
      // Défilement vers le bas
      header.style.transform = 'translateY(-100%)';
    } else {
      // Défilement vers le haut
      header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }, { passive: true });
});