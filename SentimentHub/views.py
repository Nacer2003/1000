import pandas as pd
from django.shortcuts import render
from .models import Review
from .forms import CSVUploadForm
from textblob import TextBlob
from django.shortcuts import render
import csv
import io 
import json
from collections import Counter
import re
from datetime import datetime
import numpy as np
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import os
from django.conf import settings
import requests

def analyze_sentiment(text):
    """Détermine le sentiment d'un texte avec TextBlob."""
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity
    
    if polarity > 0.1:
        sentiment = "Positif"
    elif polarity < -0.1:
        sentiment = "Négatif"
    else:
        sentiment = "Neutre"
    
    return {
        'sentiment': sentiment,
        'polarity': round(polarity, 3),
        'subjectivity': round(subjectivity, 3)
    }

def extract_keywords(texts, min_length=3, max_words=15):
    """Extrait les mots-clés les plus fréquents."""
    stop_words = {
        'le', 'de', 'et', 'à', 'un', 'il', 'être', 'en', 'avoir', 'que', 'pour',
        'dans', 'ce', 'son', 'une', 'sur', 'avec', 'ne', 'se', 'pas', 'tout',
        'plus', 'par', 'du', 'elle', 'au', 'je', 'qui', 'the', 'and', 'or',
        'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are',
        'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
        'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can',
        'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we',
        'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its',
        'our', 'their', 'a', 'an'
    }
    
    all_words = []
    for text in texts:
        words = re.findall(r'\b[a-zA-ZÀ-ÿ]{3,}\b', text.lower())
        words = [word for word in words if word not in stop_words and len(word) >= min_length]
        all_words.extend(words)
    
    word_counts = Counter(all_words)
    return [{'word': word, 'count': count} for word, count in word_counts.most_common(max_words)]


def upload_csv(request):
    if request.method == 'POST':
        csv_file = request.FILES.get('csv_file')
        
        if not csv_file:
            return render(request, 'SentimentHub/upload_csv.html', {
                'error': 'Aucun fichier sélectionné.'
            })
            
        if not csv_file.name.endswith('.csv'):
            return render(request, 'SentimentHub/upload_csv.html', {
                'error': 'Le fichier doit être au format CSV.'
            })

        try:
            # Lire le fichier CSV
            data_set = csv_file.read().decode('UTF-8')
            io_string = io.StringIO(data_set)
            csv_reader = csv.reader(io_string, delimiter=',')
            header = next(csv_reader)

            # Analyser les données
            results = []
            positive_texts = []
            negative_texts = []
            neutral_texts = []
            sentiment_counts = {'Positif': 0, 'Négatif': 0, 'Neutre': 0}
            polarity_scores = []
            subjectivity_scores = []
            
            for row_num, row in enumerate(csv_reader, 1):
                if row and len(row) > 1:
                    # Prendre la deuxième colonne comme texte à analyser
                    text = row[1].strip() if len(row) > 1 else row[0].strip()
                    
                    if text:  # Ignorer les textes vides
                        analysis = analyze_sentiment(text)
                        
                        results.append({
                            'id': row_num,
                            'text': text,
                            'sentiment': analysis['sentiment'],
                            'polarity': analysis['polarity'],
                            'subjectivity': analysis['subjectivity']
                        })
                        
                        # Collecter les données pour les statistiques
                        sentiment_counts[analysis['sentiment']] += 1
                        polarity_scores.append(analysis['polarity'])
                        subjectivity_scores.append(analysis['subjectivity'])
                        
                        # Grouper les textes par sentiment
                        if analysis['sentiment'] == 'Positif':
                            positive_texts.append(text)
                        elif analysis['sentiment'] == 'Négatif':
                            negative_texts.append(text)
                        else:
                            neutral_texts.append(text)

            # Calculer les statistiques
            total_count = len(results)
            if total_count > 0:
                stats = {
                    'total_analyzed': total_count,
                    'positive_count': sentiment_counts['Positif'],
                    'negative_count': sentiment_counts['Négatif'],
                    'neutral_count': sentiment_counts['Neutre'],
                    'positive_percentage': round((sentiment_counts['Positif'] / total_count) * 100, 1),
                    'negative_percentage': round((sentiment_counts['Négatif'] / total_count) * 100, 1),
                    'neutral_percentage': round((sentiment_counts['Neutre'] / total_count) * 100, 1),
                    'avg_polarity': round(np.mean(polarity_scores), 3),
                    'avg_subjectivity': round(np.mean(subjectivity_scores), 3),
                    'polarity_std': round(np.std(polarity_scores), 3),
                    'most_positive': max(polarity_scores) if polarity_scores else 0,
                    'most_negative': min(polarity_scores) if polarity_scores else 0
                }
                
                # Extraire les mots-clés
                keywords = {
                    'positive': extract_keywords(positive_texts),
                    'negative': extract_keywords(negative_texts),
                    'neutral': extract_keywords(neutral_texts)
                }
                
                # Préparer les données pour les graphiques
                chart_data = {
                    'sentiment_distribution': [
                        stats['positive_percentage'],
                        stats['neutral_percentage'], 
                        stats['negative_percentage']
                    ],
                    'sentiment_counts': [
                        stats['positive_count'],
                        stats['neutral_count'],
                        stats['negative_count']
                    ],
                    'polarity_distribution': polarity_scores,
                    'subjectivity_distribution': subjectivity_scores
                }
                
            else:
                return render(request, 'SentimentHub/upload_csv.html', {
                    'error': 'Aucune donnée valide trouvée dans le fichier.'
                })

            # Sauvegarder en session pour le rapport
            request.session['analysis_data'] = {
                'results': results,
                'stats': stats,
                'keywords': keywords,
                'chart_data': chart_data,
                'filename': csv_file.name,
                'analysis_date': datetime.now().isoformat()
            }

            return render(request, 'SentimentHub/upload_csv.html', {
                'results': results,
                'stats': stats,
                'keywords': keywords,
                'chart_data': json.dumps(chart_data),
                'success': True
            })

        except Exception as e:
            return render(request, 'SentimentHub/upload_csv.html', {
                'error': f'Erreur lors du traitement du fichier: {str(e)}'
            })

    return render(request, 'SentimentHub/upload_csv.html')

def rapport(request):
    # Récupérer les données d'analyse de la session
    analysis_data = request.session.get('analysis_data')
    
    if not analysis_data:
        return render(request, 'SentimentHub/rapport.html', {
            'error': 'Aucune analyse disponible. Veuillez d\'abord analyser un fichier CSV.'
        })
    
    return render(request, 'SentimentHub/rapport.html', analysis_data)

def home(request):
    return render(request, 'SentimentHub/home.html')      