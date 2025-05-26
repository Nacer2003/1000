/**
 * Module de visualisation des données
 * Gère les graphiques, tableaux et visualisations de l'analyse de sentiment
 */
document.addEventListener('DOMContentLoaded', () => {
  // Éléments DOM
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const loadDemoData = document.getElementById('loadDemoData');
  const exportDemoData = document.getElementById('exportDemoData');
  const exportModal = document.getElementById('exportModal');
  const closeExportModal = document.getElementById('closeExportModal');
  const cancelExport = document.getElementById('cancelExport');
  const confirmExport = document.getElementById('confirmExport');
  
  // Configuration initiale des graphiques
  let sentimentChart = null;
  let wordcloudChart = null;
  
  // Données de démonstration
  const demoDataSets = [
    {
      name: 'Feedback clients Q1 2025',
      sentiments: {
        positive: 65,
        neutral: 23,
        negative: 12
      },
      trend: {
        positive: 5,
        neutral: 0,
        negative: -3
      },
      comments: [
        { date: '2025-01-15', text: 'Le service client est exceptionnel, j\'ai eu une réponse rapide à mon problème.', sentiment: 'positive', score: 0.89 },
        { date: '2025-01-22', text: 'Produit conforme à mes attentes, livraison dans les délais.', sentiment: 'positive', score: 0.72 },
        { date: '2025-02-05', text: 'Qualité correcte mais le prix est un peu élevé par rapport à la concurrence.', sentiment: 'neutral', score: 0.12 },
        { date: '2025-02-18', text: 'Interface utilisateur intuitive, facile à prendre en main.', sentiment: 'positive', score: 0.83 },
        { date: '2025-03-03', text: 'Déçu par la durabilité du produit qui s\'est cassé après deux semaines d\'utilisation.', sentiment: 'negative', score: -0.75 }
      ],
      keywords: {
        positive: ['exceptionnel', 'rapide', 'conforme', 'qualité', 'intuitive', 'facile'],
        negative: ['déçu', 'cassé', 'élevé', 'problème']
      }
    },
    {
      name: 'Commentaires produits Q2 2025',
      sentiments: {
        positive: 52,
        neutral: 33,
        negative: 15
      },
      trend: {
        positive: -3,
        neutral: 8,
        negative: -5
      },
      comments: [
        { date: '2025-04-10', text: 'Design élégant et fonctionnel, c\'est exactement ce que je recherchais.', sentiment: 'positive', score: 0.91 },
        { date: '2025-04-27', text: 'La batterie se décharge assez rapidement mais sinon le produit est acceptable.', sentiment: 'neutral', score: -0.05 },
        { date: '2025-05-15', text: 'Installation compliquée, les instructions ne sont pas claires du tout.', sentiment: 'negative', score: -0.68 },
        { date: '2025-05-29', text: 'Bon rapport qualité-prix, je suis satisfait de mon achat.', sentiment: 'positive', score: 0.76 },
        { date: '2025-06-12', text: 'Produit moyen, rien d\'extraordinaire mais fait le travail.', sentiment: 'neutral', score: 0.23 }
      ],
      keywords: {
        positive: ['élégant', 'fonctionnel', 'satisfait', 'qualité-prix'],
        negative: ['compliquée', 'décharge', 'pas claires']
      }
    },
    {
      name: 'Enquête satisfaction Q3 2025',
      sentiments: {
        positive: 71,
        neutral: 18,
        negative: 11
      },
      trend: {
        positive: 8,
        neutral: -7,
        negative: -1
      },
      comments: [
        { date: '2025-07-05', text: 'Excellente expérience utilisateur, l\'application est fluide et responsive.', sentiment: 'positive', score: 0.95 },
        { date: '2025-07-21', text: 'Support technique réactif et efficace, problème résolu en moins de 24h.', sentiment: 'positive', score: 0.88 },
        { date: '2025-08-09', text: 'Fonctionnalités basiques présentes, mais manque d\'options avancées.', sentiment: 'neutral', score: 0.18 },
        { date: '2025-08-25', text: 'Temps de chargement parfois lent sur mobile.', sentiment: 'negative', score: -0.42 },
        { date: '2025-09-14', text: 'Interface claire et agréable, prise en main immédiate.', sentiment: 'positive', score: 0.81 }
      ],
      keywords: {
        positive: ['excellente', 'fluide', 'réactif', 'efficace', 'claire', 'agréable'],
        negative: ['lent', 'manque']
      }
    }
  ];
  
  let currentDataSetIndex = 0;
  
  // Fonctions de visualisation
  const initCharts = () => {
    // Initialiser le graphique de sentiments
    const sentimentCtx = document.getElementById('sentimentChart').getContext('2d');
    
    sentimentChart = new Chart(sentimentCtx, {
      type: 'doughnut',
      data: {
        labels: ['Positif', 'Neutre', 'Négatif'],
        datasets: [{
          data: [65, 23, 12],
          backgroundColor: [
            'rgba(76, 175, 80, 0.8)',  // vert
            'rgba(33, 150, 243, 0.8)', // bleu
            'rgba(244, 67, 54, 0.8)'   // rouge
          ],
          borderColor: [
            'rgba(76, 175, 80, 1)',
            'rgba(33, 150, 243, 1)',
            'rgba(244, 67, 54, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                family: 'Poppins',
                size: 14
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}%`;
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true
        }
      }
    });
    
    // Initialiser le nuage de mots-clés
    createWordCloud(demoDataSets[0].keywords);
  };
  
  const createWordCloud = (keywords) => {
    const wordcloudContainer = document.getElementById('wordcloud');
    wordcloudContainer.innerHTML = '';
    
    // Préparer les données pour le nuage de mots
    const allWords = [];
    
    keywords.positive.forEach(word => {
      allWords.push({
        text: word,
        size: 15 + Math.random() * 25,
        color: 'rgba(76, 175, 80, 0.9)'
      });
    });
    
    keywords.negative.forEach(word => {
      allWords.push({
        text: word,
        size: 15 + Math.random() * 15,
        color: 'rgba(244, 67, 54, 0.9)'
      });
    });
    
    // Dimensions du conteneur
    const width = wordcloudContainer.offsetWidth;
    const height = 300;
    
    // Créer le layout du nuage de mots
    d3.layout.cloud()
    .size([width, height])
    .words(words)
    .padding(5)
    .rotate(0)
    .font("Impact")
    .fontSize(function(d) { return d.size; })
    .on("end", draw)
    .start();
    
    // Fonction pour dessiner le nuage de mots
    function draw(words) {
      d3.select('#wordcloud').append('svg')
        .attr('width', layout.size()[0])
        .attr('height', layout.size()[1])
        .append('g')
        .attr('transform', `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`)
        .selectAll('text')
        .data(words)
        .enter().append('text')
        .style('font-size', d => `${d.size}px`)
        .style('font-family', 'Poppins')
        .style('fill', d => d.color)
        .attr('text-anchor', 'middle')
        .attr('transform', d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
        .text(d => d.text);
    }
  };
  
  const updateTableData = (comments) => {
    const tableBody = document.getElementById('sentimentTableBody');
    tableBody.innerHTML = '';
    
    comments.forEach(comment => {
      const row = document.createElement('tr');
      
      // Date
      const dateCell = document.createElement('td');
      dateCell.textContent = comment.date;
      row.appendChild(dateCell);
      
      // Commentaire
      const textCell = document.createElement('td');
      textCell.textContent = comment.text;
      row.appendChild(textCell);
      
      // Sentiment
      const sentimentCell = document.createElement('td');
      sentimentCell.textContent = comment.sentiment === 'positive' ? 'Positif' : 
                                  comment.sentiment === 'negative' ? 'Négatif' : 'Neutre';
      sentimentCell.className = comment.sentiment;
      row.appendChild(sentimentCell);
      
      // Score
      const scoreCell = document.createElement('td');
      scoreCell.textContent = comment.score.toFixed(2);
      scoreCell.className = comment.sentiment;
      row.appendChild(scoreCell);
      
      tableBody.appendChild(row);
    });
  };
  
  const updateKeywords = (keywords) => {
    const positiveKeywords = document.getElementById('positiveKeywords');
    const negativeKeywords = document.getElementById('negativeKeywords');
    
    positiveKeywords.innerHTML = '';
    negativeKeywords.innerHTML = '';
    
    keywords.positive.forEach(keyword => {
      const li = document.createElement('li');
      li.textContent = keyword;
      positiveKeywords.appendChild(li);
    });
    
    keywords.negative.forEach(keyword => {
      const li = document.createElement('li');
      li.textContent = keyword;
      negativeKeywords.appendChild(li);
    });
  };
  
  const updateStatCards = (data) => {
    // Mettre à jour les cartes de statistiques
    document.querySelector('.stat-card.positive .stat-value').textContent = `${data.sentiments.positive}%`;
    document.querySelector('.stat-card.neutral .stat-value').textContent = `${data.sentiments.neutral}%`;
    document.querySelector('.stat-card.negative .stat-value').textContent = `${data.sentiments.negative}%`;
    
    // Mettre à jour les tendances
    const positiveChange = document.querySelector('.stat-card.positive .stat-change');
    const neutralChange = document.querySelector('.stat-card.neutral .stat-change');
    const negativeChange = document.querySelector('.stat-card.negative .stat-change');
    
    positiveChange.innerHTML = data.trend.positive > 0 ? 
      `<i class="fas fa-arrow-up"></i> +${data.trend.positive}% vs période précédente` :
      data.trend.positive < 0 ?
        `<i class="fas fa-arrow-down"></i> ${data.trend.positive}% vs période précédente` :
        `<i class="fas fa-equals"></i> 0% vs période précédente`;
        
    neutralChange.innerHTML = data.trend.neutral > 0 ? 
      `<i class="fas fa-arrow-up"></i> +${data.trend.neutral}% vs période précédente` :
      data.trend.neutral < 0 ?
        `<i class="fas fa-arrow-down"></i> ${data.trend.neutral}% vs période précédente` :
        `<i class="fas fa-equals"></i> 0% vs période précédente`;
        
    negativeChange.innerHTML = data.trend.negative > 0 ? 
      `<i class="fas fa-arrow-up"></i> +${data.trend.negative}% vs période précédente` :
      data.trend.negative < 0 ?
        `<i class="fas fa-arrow-down"></i> ${data.trend.negative}% vs période précédente` :
        `<i class="fas fa-equals"></i> 0% vs période précédente`;
  };
  
  const updateDataVisualization = (dataSet) => {
    // Mettre à jour le graphique de sentiments
    sentimentChart.data.datasets[0].data = [
      dataSet.sentiments.positive,
      dataSet.sentiments.neutral,
      dataSet.sentiments.negative
    ];
    sentimentChart.update();
    
    // Mettre à jour le tableau de données
    updateTableData(dataSet.comments);
    
    // Mettre à jour le nuage de mots-clés
    createWordCloud(dataSet.keywords);
    
    // Mettre à jour les mots-clés
    updateKeywords(dataSet.keywords);
    
    // Mettre à jour les cartes de statistiques
    updateStatCards(dataSet);
    
    // Ajouter une animation
    const demoContainer = document.querySelector('.demo-container');
    demoContainer.classList.add('fade-in');
    setTimeout(() => {
      demoContainer.classList.remove('fade-in');
    }, 500);
  };
  
  // Gestionnaires d'événements
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Enlever la classe active de tous les boutons et contenus
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Ajouter la classe active au bouton cliqué
      button.classList.add('active');
      
      // Afficher le contenu correspondant
      const tabId = button.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
  
  loadDemoData.addEventListener('click', () => {
    // Passer au jeu de données suivant
    currentDataSetIndex = (currentDataSetIndex + 1) % demoDataSets.length;
    updateDataVisualization(demoDataSets[currentDataSetIndex]);
  });
  
  exportDemoData.addEventListener('click', () => {
    exportModal.style.display = 'block';
  });
  
  closeExportModal.addEventListener('click', () => {
    exportModal.style.display = 'none';
  });
  
  cancelExport.addEventListener('click', () => {
    exportModal.style.display = 'none';
  });
  
  confirmExport.addEventListener('click', () => {
    const format = document.querySelector('input[name="exportFormat"]:checked').value;
    
    // Simuler l'export
    alert(`Export au format ${format.toUpperCase()} effectué avec succès !`);
    exportModal.style.display = 'none';
  });
  
  // Fermer la modal si clic à l'extérieur
  window.addEventListener('click', (e) => {
    if (e.target === exportModal) {
      exportModal.style.display = 'none';
    }
  });
  
  // Initialiser les visualisations
  initCharts();
  updateTableData(demoDataSets[0].comments);
  updateKeywords(demoDataSets[0].keywords);
  
  // Écouter l'événement d'analyse terminée
  document.addEventListener('data-analyzed', () => {
    // Charger de nouvelles données aléatoires
    currentDataSetIndex = Math.floor(Math.random() * demoDataSets.length);
    updateDataVisualization(demoDataSets[currentDataSetIndex]);
    
    // Afficher l'onglet Vue d'ensemble
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    document.querySelector('.tab-btn[data-tab="overview"]').classList.add('active');
    document.getElementById('overview').classList.add('active');
  });
});