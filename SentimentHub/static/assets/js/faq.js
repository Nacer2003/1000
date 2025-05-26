/**
 * Module de gestion des FAQ
 * Gère l'accordéon des questions fréquentes
 */
document.addEventListener('DOMContentLoaded', () => {
  // Éléments DOM
  const accordionItems = document.querySelectorAll('.accordion-item');
  
  // Fonction pour ouvrir/fermer un élément d'accordéon
  const toggleAccordion = (item) => {
    const isActive = item.classList.contains('active');
    
    // Fermer tous les éléments ouverts
    accordionItems.forEach(item => {
      item.classList.remove('active');
      const content = item.querySelector('.accordion-content');
      content.style.maxHeight = '0';
    });
    
    // Si l'élément cliqué n'était pas actif, l'ouvrir
    if (!isActive) {
      item.classList.add('active');
      const content = item.querySelector('.accordion-content');
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  };
  
  // Gestionnaires d'événements
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    
    header.addEventListener('click', () => {
      toggleAccordion(item);
    });
    
    // Support des touches clavier
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleAccordion(item);
      }
    });
  });
  
  // Ouvrir le premier élément par défaut
  if (accordionItems.length > 0) {
    toggleAccordion(accordionItems[0]);
  }
  
  // Ajuster la hauteur des éléments lors du redimensionnement
  window.addEventListener('resize', () => {
    accordionItems.forEach(item => {
      if (item.classList.contains('active')) {
        const content = item.querySelector('.accordion-content');
        content.style.maxHeight = 'none';
        const height = content.scrollHeight;
        content.style.maxHeight = height + 'px';
      }
    });
  });
  
  // Animation au défilement
  const observeAccordion = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    accordionItems.forEach(item => {
      observer.observe(item);
    });
  };
  
  // Vérifier si IntersectionObserver est supporté
  if ('IntersectionObserver' in window) {
    observeAccordion();
  } else {
    // Fallback pour les navigateurs qui ne supportent pas IntersectionObserver
    accordionItems.forEach(item => {
      item.classList.add('fade-in');
    });
  }
});