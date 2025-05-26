document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const csvFile = document.getElementById('csvFile');
    const uploadArea = document.getElementById('uploadArea');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const removeFile = document.getElementById('removeFile');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resetBtn = document.getElementById('resetBtn');
    const loading = document.getElementById('loading');
    
    // Gestion du thème clair/sombre
    const themeSwitch = document.getElementById('themeSwitch');
    const themeIcon = document.getElementById('themeIcon');
    
    // Vérifier si un thème est déjà enregistré
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    document.body.classList.add(savedTheme);
    themeSwitch.checked = savedTheme === 'dark-theme';
    updateThemeIcon();
    
    themeSwitch.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            localStorage.setItem('theme', 'light-theme');
        }
        updateThemeIcon();
    });
    
    function updateThemeIcon() {
        if (themeSwitch.checked) {
            themeIcon.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeIcon.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
    
    // Fonction pour formater la taille du fichier
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Gestion du téléchargement de fichier
    csvFile.addEventListener('change', handleFileSelect);
    
    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            displayFileInfo(file);
            analyzeBtn.disabled = false;
        }
    }
    
    function displayFileInfo(file) {
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        fileInfo.classList.remove('hidden');
        uploadArea.style.borderColor = 'var(--primary)';
        uploadArea.style.backgroundColor = 'var(--primary-light)';
    }
    
    // Supprimer le fichier
    removeFile.addEventListener('click', function() {
        csvFile.value = '';
        fileInfo.classList.add('hidden');
        uploadArea.style.borderColor = '';
        uploadArea.style.backgroundColor = '';
        analyzeBtn.disabled = true;
    });
    
    // Réinitialiser le formulaire
    resetBtn.addEventListener('click', function() {
        uploadForm.reset();
        fileInfo.classList.add('hidden');
        uploadArea.style.borderColor = '';
        uploadArea.style.backgroundColor = '';
        analyzeBtn.disabled = true;
    });
    
    // Gestion du glisser-déposer
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        uploadArea.classList.add('drag-over');
    }
    
    function unhighlight() {
        uploadArea.classList.remove('drag-over');
    }
    
    uploadArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        
        if (file && file.name.endsWith('.csv')) {
            csvFile.files = dt.files;
            displayFileInfo(file);
            analyzeBtn.disabled = false;
        } else if (file) {
            alert('Veuillez sélectionner un fichier CSV valide.');
        }
    }
    
    // Soumission du formulaire
    uploadForm.addEventListener('submit', function() {
        loading.classList.remove('hidden');
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Analyse en cours...</span>';
    });
    
    // Fonction pour basculer l'affichage du texte complet
    window.toggleText = function(id) {
        const preview = document.getElementById(`preview-${id}`);
        const full = document.getElementById(`full-${id}`);
        const button = preview.nextElementSibling.nextElementSibling;
        
        if (preview.classList.contains('hidden')) {
            preview.classList.remove('hidden');
            full.classList.add('hidden');
            button.textContent = 'Voir plus';
        } else {
            preview.classList.add('hidden');
            full.classList.remove('hidden');
            button.textContent = 'Voir moins';
        }
    };
    
    // Export CSV
    const exportCsvBtn = document.getElementById('exportCsv');
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', function() {
            // Cette fonction serait implémentée côté serveur
            //alert('Fonctionnalité d\'export CSV à implémenter côté serveur.');
        });
    }
    
    // Export PDF
    const exportPdfBtn = document.getElementById('exportPdf');
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', function() {
            // Cette fonction serait implémentée côté serveur
            //alert('Fonctionnalité d\'export PDF à implémenter côté serveur.');
        });
    }
});