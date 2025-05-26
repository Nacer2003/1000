/**
 * Module de gestion des témoignages
 * Gère le slider de témoignages avec navigation et indicateurs
 */
document.addEventListener('DOMContentLoaded', () => {
  // Éléments DOM
  const slider = document.getElementById('testimonialsSlider');
  const slides = slider.querySelectorAll('.testimonial-card');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  const dots = document.querySelectorAll('.dot');
  
  let currentSlide = 0;
  let autoplayInterval;
  
  // Mise à jour de la position du slider
  const updateSlidePosition = () => {
    // Utiliser translateX avec pourcentage pour un déplacement correct
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Mettre à jour les indicateurs
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  };
  
  // Navigation vers la diapositive précédente
  const goToPrevSlide = () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlidePosition();
    resetAutoplay();
  };
  
  // Navigation vers la diapositive suivante
  const goToNextSlide = () => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlidePosition();
    resetAutoplay();
  };
  
  // Démarrer l'autoplay
  const startAutoplay = () => {
    stopAutoplay();
    autoplayInterval = setInterval(() => {
      goToNextSlide();
    }, 5000);
  };
  
  // Arrêter l'autoplay
  const stopAutoplay = () => {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
    }
  };
  
  // Réinitialiser l'autoplay
  const resetAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };
  
  // Gestionnaires d'événements
  prevBtn.addEventListener('click', goToPrevSlide);
  nextBtn.addEventListener('click', goToNextSlide);
  
  // Gestion des points indicateurs
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide = index;
      updateSlidePosition();
      resetAutoplay();
    });
  });
  
  // Support pour les gestes tactiles
  let touchStartX = 0;
  let touchEndX = 0;
  
  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  const handleSwipe = () => {
    // Détecter le sens du swipe (avec un seuil minimal)
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe gauche (suivant)
      goToNextSlide();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe droit (précédent)
      goToPrevSlide();
    }
  };
  
  // Arrêter l'autoplay si l'utilisateur interagit avec le slider
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);
  
  // Initialiser le slider
  updateSlidePosition();
  startAutoplay();
});