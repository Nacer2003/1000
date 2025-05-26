/**
 * Module de gestion des uploads de fichiers CSV
 * Gère le drag & drop, la prévisualisation et les options d'analyse
 */
document.addEventListener('DOMContentLoaded', () => {
  // Éléments DOM
  const uploadArea = document.getElementById('uploadArea');
  const fileUpload = document.getElementById('file-upload');
  const uploadPreview = document.getElementById('uploadPreview');
  const uploadProgress = document.getElementById('uploadProgress');
  const fileName = document.getElementById('fileName');
  const fileSize = document.getElementById('fileSize');
  const removeFile = document.getElementById('removeFile');
  const textColumn = document.getElementById('textColumn');
  const dateColumn = document.getElementById('dateColumn');
  const startAnalysis = document.getElementById('startAnalysis');
  const progressBar = document.getElementById('progressBar');
  const progressStatus = document.getElementById('progressStatus');
  
  let currentFile = null;
  let headers = [];
  
  // Fonctions utilitaires
  const formatSize = (bytes) => {
    if (bytes < 1024) {
      return bytes + ' bytes';
    } else if (bytes < 1048576) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else {
      return (bytes / 1048576).toFixed(1) + ' MB';
    }
  };
  
  const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const content = event.target.result;
          const lines = content.split('\n');
          
          if (lines.length === 0) {
            reject('Le fichier CSV est vide');
            return;
          }
          
          // Détecter le séparateur (virgule, point-virgule ou tabulation)
          let separator = ',';
          const firstLine = lines[0];
          
          if (firstLine.includes(';')) {
            separator = ';';
          } else if (firstLine.includes('\t')) {
            separator = '\t';
          }
          
          // Extraire les en-têtes
          const headers = firstLine.split(separator).map(header => header.trim().replace(/^"|"$/g, ''));
          
          // Extraire quelques lignes pour prévisualisation
          const previewData = lines.slice(1, 6).map(line => {
            return line.split(separator).map(cell => cell.trim().replace(/^"|"$/g, ''));
          });
          
          resolve({ headers, previewData });
        } catch (error) {
          reject('Erreur lors de la lecture du fichier: ' + error.message);
        }
      };
      
      reader.onerror = () => {
        reject('Erreur lors de la lecture du fichier');
      };
      
      reader.readAsText(file);
    });
  };
  
  const handleFileSelection = async (file) => {
    // Vérifier le type de fichier
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Veuillez sélectionner un fichier CSV valide');
      return;
    }
    
    try {
      currentFile = file;
      fileName.textContent = file.name;
      fileSize.textContent = formatSize(file.size);
      
      // Analyser les en-têtes pour les sélecteurs de colonnes
      const { headers: csvHeaders } = await parseCSV(file);
      headers = csvHeaders;
      
      // Mettre à jour les options de colonnes
      textColumn.innerHTML = '<option value="">Sélectionnez une colonne</option>';
      dateColumn.innerHTML = '<option value="">Aucune</option>';
      
      headers.forEach((header, index) => {
        const textOption = document.createElement('option');
        textOption.value = index;
        textOption.textContent = header;
        textColumn.appendChild(textOption);
        
        const dateOption = document.createElement('option');
        dateOption.value = index;
        dateOption.textContent = header;
        dateColumn.appendChild(dateOption);
      });
      
      // Afficher la prévisualisation
      uploadArea.classList.add('hidden');
      uploadPreview.classList.add('visible');
    } catch (error) {
      alert(error);
    }
  };
  
  // Gestionnaires d'événements
  fileUpload.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  });
  
  // Drag & Drop
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
    }, false);
  });
  
  uploadArea.addEventListener('dragenter', () => {
    uploadArea.classList.add('highlight');
  });
  
  uploadArea.addEventListener('dragover', () => {
    uploadArea.classList.add('highlight');
  });
  
  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('highlight');
  });
  
  uploadArea.addEventListener('drop', (e) => {
    uploadArea.classList.remove('highlight');
    const files = e.dataTransfer.files;
    
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  });
  
  // Clic sur la zone d'upload
  uploadArea.addEventListener('click', () => {
    fileUpload.click();
  });
  
  // Supprimer le fichier
  removeFile.addEventListener('click', () => {
    currentFile = null;
    fileUpload.value = '';
    uploadPreview.classList.remove('visible');
    uploadArea.classList.remove('hidden');
  });
  
  // Lancer l'analyse
  startAnalysis.addEventListener('click', () => {
    if (!currentFile) {
      alert('Veuillez d\'abord sélectionner un fichier CSV');}
    
    const selectedTextColumn = textColumn.value;
    
    if (!selectedTextColumn) {
      alert('Veuillez sélectionner une colonne de texte à analyser');
      return;
    }
    
    // Simuler l'analyse
    uploadPreview.classList.remove('visible');
    uploadProgress.classList.add('visible');
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Simuler un délai de finalisation
        setTimeout(() => {
          uploadProgress.classList.remove('visible');
          
          // Rediriger vers la démo avec les résultats
          window.location.href = '#demo';
          
          // Réinitialiser pour une nouvelle analyse
          currentFile = null;
          fileUpload.value = '';
          uploadArea.classList.remove('hidden');
          
          // Simuler le chargement de nouvelles données
          document.dispatchEvent(new CustomEvent('data-analyzed'));
          
          alert('Analyse terminée ! Consultez les résultats dans la section démo.');
        }, 500);
      }
      
      progressBar.style.width = `${progress}%`;
      progressStatus.textContent = `Analyse en cours... (${Math.round(progress)}%)`;
    }, 200);
  });
});
