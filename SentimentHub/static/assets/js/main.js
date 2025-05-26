/**
 * Module principal
 * Initialise les fonctionnalités globales et coordonne les autres modules
 */
document.addEventListener('DOMContentLoaded', () => {
  // Animation au défilement
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('[data-aos]');
    
    // Créer un observateur d'intersection si disponible
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Récupérer le délai s'il existe
            const delay = entry.target.getAttribute('data-aos-delay') || 0;
            
            // Appliquer l'animation après le délai
            setTimeout(() => {
              entry.target.classList.add('animated');
            }, delay);
            
            // Arrêter d'observer une fois animé
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      
      // Observer chaque élément
      elements.forEach(element => {
        observer.observe(element);
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas IntersectionObserver
      elements.forEach(element => {
        element.classList.add('animated');
      });
    }
  };
  
  // Gestion du modal export
  const exportModalInit = () => {
    const modal = document.getElementById('exportModal');
    
    // Fermer avec la touche Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
      }
    });
  };
  
  // Initialisation des effets visuels
  const initVisualEffects = () => {
    // Animation pour les sections lors du défilement
    const sections = document.querySelectorAll('section');
    
    if ('IntersectionObserver' in window) {
      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
            sectionObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      
      sections.forEach(section => {
        section.classList.add('section-hidden');
        sectionObserver.observe(section);
      });
    }
    
    // Effet de parallaxe sur l'en-tête
    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY;
      
      if (scrollPosition > 0) {
        const header = document.querySelector('header');
        const waveContainer = document.querySelector('.wave-container');
        
        // Effet de parallaxe sur les vagues
        if (waveContainer) {
          waveContainer.style.transform = `translateY(${scrollPosition * 0.1}px)`;
        }
      }
    });
  };
  
  // Afficher l'année en cours dans le pied de page
  const updateFooterYear = () => {
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
      element.textContent = currentYear;
    });
  };
  
  // Mise à jour des liens sociaux
  const updateSocialLinks = () => {
    const socialLinks = document.querySelectorAll('.social-links a');
    
    // Ajouter les attributs de sécurité et d'accessibilité
    socialLinks.forEach(link => {
      // Ouvrir dans un nouvel onglet
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      
      // S'assurer que l'aria-label est défini si l'icône est l'unique contenu
      if (!link.hasAttribute('aria-label') && !link.textContent.trim()) {
        const iconClass = link.querySelector('i')?.className || '';
        let network = '';
        
        if (iconClass.includes('twitter')) network = 'Twitter';
        else if (iconClass.includes('facebook')) network = 'Facebook';
        else if (iconClass.includes('linkedin')) network = 'LinkedIn';
        else if (iconClass.includes('instagram')) network = 'Instagram';
        else if (iconClass.includes('github')) network = 'GitHub';
        else if (iconClass.includes('envelope')) network = 'Email';
        
        if (network) {
          link.setAttribute('aria-label', network);
        }
      }
    });
  };
  
  // Fonction utilitaire pour les transitions fluides de couleur
  const setupTransitions = () => {
    // Assurer que les transitions sont appliquées après le chargement initial
    document.body.classList.add('transitions-enabled');
  };
  
  // Initialiser toutes les fonctionnalités
  const init = () => {
    // Animer les éléments au défilement
    animateOnScroll();
    
    // Initialiser le modal d'export
    exportModalInit();
    
    // Initialiser les effets visuels
    initVisualEffects();
    
    // Mettre à jour l'année dans le pied de page
    updateFooterYear();
    
    // Mettre à jour les liens sociaux
    updateSocialLinks();
    
    // Configurer les transitions
    setupTransitions();
    
    // Ajouter une classe pour indiquer que tout est chargé
    document.body.classList.add('content-loaded');
    
    console.log('SentimentHub initialisé avec succès !');
  };
  
  // Démarrer l'initialisation
  init();
  
  // Styles CSS pour les animations (ajoutés dynamiquement)
  const addAnimationStyles = () => {
    const styleSheet = document.createElement('style');
    styleSheet.innerHTML = `
      /* Animations pour les éléments avec data-aos */
      [data-aos] {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
      }
      
      [data-aos].animated {
        opacity: 1;
        transform: translateY(0);
      }
      
      /* Animation des sections */
      .section-hidden {
        opacity: 0;
        transform: translateY(50px);
        transition: opacity 1s ease, transform 1s ease;
      }
      
      .section-visible {
        opacity: 1;
        transform: translateY(0);
      }
      
      /* Animation de fade in */
      .fade-in {
        animation: fadeIn 0.5s ease forwards;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(styleSheet);
  };
  
  // Ajouter les styles d'animation
  addAnimationStyles();
});