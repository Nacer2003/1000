from django.db import models

class Review(models.Model):
    text = models.TextField()  # Stocke le texte de l'avis
    sentiment = models.CharField(max_length=10)  # Positif, Neutre, Négatif
    created_at = models.DateTimeField(auto_now_add=True)  # Date d'ajout

   
