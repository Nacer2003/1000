class Chatbot {
    constructor() {
        this.container = document.getElementById('chatContainer');
        this.messages = document.getElementById('chatMessages');
        this.input = document.getElementById('userInput');
        this.sendButton = document.getElementById('sendMessage');
        this.toggleButton = document.getElementById('toggleChat');
        
        this.setupEventListeners();
        this.adjustTextareaHeight();
    }

    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        this.input.addEventListener('input', () => this.adjustTextareaHeight());
        this.toggleButton.addEventListener('click', () => this.toggleChat());
    }

    adjustTextareaHeight() {
        this.input.style.height = 'auto';
        this.input.style.height = (this.input.scrollHeight) + 'px';
    }

    toggleChat() {
        this.container.classList.toggle('minimized');
        const icon = this.toggleButton.querySelector('i');
        icon.classList.toggle('fa-minus');
        icon.classList.toggle('fa-plus');
    }

    async sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;

        // Afficher le message de l'utilisateur
        this.addMessage(message, 'user');
        this.input.value = '';
        this.adjustTextareaHeight();

        // Afficher l'indicateur de frappe
        this.showTypingIndicator();

        try {
            const response = await this.callOpenAI(message);
            this.removeTypingIndicator();
            
            if (response) {
                this.addMessage(response, 'bot');
            } else {
                throw new Error('Réponse vide de l'API');
                )
            }
        } catch (error) {
            this.removeTypingIndicator();
            this.showError(error.message);
        }

        this.messages.scrollTop = this.messages.scrollHeight;
    }

    addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const icon = document.createElement('i');
        icon.className = type === 'user' ? 'fas fa-user' : 'fas fa-robot';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        messageDiv.appendChild(icon);
        messageDiv.appendChild(messageContent);
        this.messages.appendChild(messageDiv);
    }

    showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'message bot typing-indicator';
        indicator.innerHTML = `
            <i class="fas fa-robot"></i>
            <div class="message-content">
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        this.messages.appendChild(indicator);
    }

    removeTypingIndicator() {
        const indicator = this.messages.querySelector('.typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = `Erreur: ${message}`;
        this.messages.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    async callOpenAI(message) {
        const API_KEY = 'VOTRE_CLE_API_OPENAI';
        const API_URL = 'https://api.openai.com/v1/chat/completions';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{
                        role: "user",
                        content: message
                    }],
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error('Erreur de communication avec l'API');
                )
            }

            const data = await response.json();
            return data.choices[0].message.content.trim();
        } catch (error) {
            throw new Error('Erreur lors de l'appel à l'API OpenAI');
        }
    }
}

// Initialiser le chatbot
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});