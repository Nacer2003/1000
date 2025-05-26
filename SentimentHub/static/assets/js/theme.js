/**
 * Module de gestion du thème (clair/sombre)
 * Gère le basculement entre les thèmes et sauvegarde la préférence utilisateur
 */
document.addEventListener('DOMContentLoaded', () => {
  const themeSwitch = document.getElementById('theme-switch') || document.getElementById('themeSwitch');
  const body = document.body;
  
  // Fonction pour définir le thème
  const setTheme = (isDark) => {
    if (isDark) {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
      if (themeSwitch) themeSwitch.checked = true;
    } else {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
      if (themeSwitch) themeSwitch.checked = false;
    }
    
    // Synchroniser avec tous les autres switches sur la page
    const allSwitches = document.querySelectorAll('#theme-switch, #themeSwitch, #mobile-theme-switch');
    allSwitches.forEach(switchEl => {
      if (switchEl !== themeSwitch) {
        switchEl.checked = isDark;
      }
    });
    
    // Mettre à jour l'icône si elle existe
    updateThemeIcon(isDark);
  };
  
  // Fonction pour mettre à jour l'icône du thème
  const updateThemeIcon = (isDark) => {
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
      if (isDark) {
        themeIcon.innerHTML = '<i class="fas fa-sun"></i>';
      } else {
        themeIcon.innerHTML = '<i class="fas fa-moon"></i>';
      }
    }
  };
  
  // Récupérer la préférence de thème enregistrée
  const savedTheme = localStorage.getItem('theme');
  
  // Appliquer le thème sauvegardé ou utiliser la préférence du système
  if (savedTheme) {
    setTheme(savedTheme === 'dark');
  } else {
    // Utiliser la préférence du système si disponible
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark);
  }
  
  // Écouteur d'événement pour le changement de thème
  if (themeSwitch) {
    themeSwitch.addEventListener('change', () => {
      const isDark = themeSwitch.checked;
      setTheme(isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      console.log('Thème changé :', isDark ? 'dark' : 'light');
    });
  }
  
  // Écouter les changements de préférence du système
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Ne mettre à jour que si l'utilisateur n'a pas de préférence explicite
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches);
    }
  });
  
  // Synchroniser avec les autres switches s'ils existent
  const allSwitches = document.querySelectorAll('#theme-switch, #themeSwitch, #mobile-theme-switch');
  allSwitches.forEach(switchEl => {
    if (switchEl !== themeSwitch) {
      switchEl.addEventListener('change', () => {
        const isDark = switchEl.checked;
        setTheme(isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      });
    }
  });
});
  // Synchronisation asynchrone avec les autres pages ouvertes
  const syncThemeAcrossPages = () => {
    const currentTheme = localStorage.getItem("theme")
    if (currentTheme) {
      const isDark = currentTheme === "dark"
      setTheme(isDark)
    }
  }

  // Vérifier périodiquement les changements de thème
  setInterval(syncThemeAcrossPages, 1000)

  // Synchronisation immédiate au focus de la page
  window.addEventListener("focus", syncThemeAcrossPages)
  window.addEventListener("pageshow", syncThemeAcrossPages)