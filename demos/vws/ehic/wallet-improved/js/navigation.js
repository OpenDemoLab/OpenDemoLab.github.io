// navigation.js - Schermwisselingen en navigatie

/**
 * ScreenManager beheert het tonen en verbergen van schermen in de applicatie
 */
class ScreenManager {
    constructor() {
      // Registreer alle schermen in de applicatie
      this.screens = {
        'welcome': document.getElementById('welcome-screen'),
        'pin-inlog': document.getElementById('pin-inlog-screen'),
        'wallet': document.getElementById('wallet-screen'),
        'current-cards': document.getElementById('current-cards'),
        'details': document.getElementById('details'),
        'activities': document.getElementById('activities-section'),
        'add-card': document.getElementById('add-card-screen')
      };
      
      // Navigatiebalk onderaan
      this.bottomNav = document.querySelector('.bottom-nav');
    }
    
    /**
     * Toont een specifiek scherm en verbergt alle andere
     * @param {string} screenId - ID van het scherm dat getoond moet worden
     * @param {boolean} showNav - Of de navigatiebalk getoond moet worden
     * @returns {ScreenManager} - Voor method chaining
     */
    showScreen(screenId, showNav = false) {
      // Verberg alle schermen
      Object.values(this.screens).forEach(screen => {
        if (screen) screen.style.display = 'none';
      });
      
      // Toon het gewenste scherm
      if (this.screens[screenId]) {
        const screen = this.screens[screenId];
        
        // Bepaal de juiste display-stijl op basis van het scherm
        if (screenId === 'pin-inlog' || screenId === 'current-cards') {
          screen.style.display = 'flex';
        } else {
          screen.style.display = 'block';
        }
      } else {
        console.warn(`Scherm '${screenId}' is niet gevonden.`);
      }
      
      // Toon of verberg de navigatiebalk
      this.bottomNav.style.display = showNav ? 'flex' : 'none';
      
      return this;
    }
    
    /**
     * Toont een scherm en stelt de actieve tab in de navigatiebalk in
     * @param {string} screenId - ID van het scherm dat getoond moet worden
     * @param {string} activeTabId - ID van de tab die actief gemaakt moet worden
     * @returns {ScreenManager} - Voor method chaining
     */
    showScreenWithActiveTab(screenId, activeTabId) {
      this.showScreen(screenId, true);
      
      // Zet alle tabs op inactief
      document.querySelectorAll('.nav-item').forEach(item => 
        item.classList.remove('active')
      );
      
      // Zet de gewenste tab op actief
      const activeTab = document.getElementById(activeTabId);
      if (activeTab) activeTab.classList.add('active');
      
      return this;
    }
    
    /**
     * Toont kaartdetails
     * @param {Object} credential - Het credential object om te tonen
     * @param {number} index - Index van het credential in de array
     */
    showDetails(credential, index) {
      // Krijg de detailsView
      const detailsView = this.screens['details'];
      
      // Verberg andere relevante schermen
      this.showScreen('details', false);
      
      // Stel detailsview in
      document.getElementById('details-title').textContent = credential.name;
      const detailsContent = document.getElementById('details-content');
      detailsContent.innerHTML = '';
      
      // Render specifieke content op basis van het type credential
      if (credential.name === 'Foto') {
        detailsContent.innerHTML += `<img src="${credential.data['Foto']}" alt="Pasfoto" style="width: 100%; max-width: 300px; height: auto; margin-bottom: 20px;">`;
        detailsContent.innerHTML += `<div class="details-row">
                                    <div class="details-label">Lengte:</div>
                                    <div class="details-value">${credential.data['Lengte']}</div>
                                  </div>`;
      } else if (credential.data) {
        for (const key in credential.data) {
          if (credential.data.hasOwnProperty(key)) {
            detailsContent.innerHTML += `
              <div class="details-row">
                <div class="details-label">${key}:</div>
                <div class="details-value">${credential.data[key]}</div>
              </div>`;
          }
        }
      } else {
        detailsContent.innerHTML = '<p>Geen details beschikbaar.</p>';
      }
      
      // Setup event handlers voor detailview
      this.setupDetailsHandlers(credential, index);
    }
    
    /**
     * Stelt event handlers in voor de details view
     * @private
     */
    setupDetailsHandlers(credential, index) {
      // Import removeCredential en displayCredentials direct (geen require)
      import('./credentials.js').then(module => {
        const { removeCredential, displayCredentials } = module;
        
        // Close button
        document.getElementById('close-details').onclick = () => {
          this.showScreen('current-cards', false);
        };
        
        // Delete button - alleen voor niet-standaard kaarten
        const deleteBtn = document.getElementById('delete-details');
        if (credential.name !== 'Persoonlijke data' && credential.name !== 'Woonadres' && credential.name !== 'Foto') {
          deleteBtn.style.display = 'block';
          deleteBtn.onclick = () => {
            removeCredential(index);
            this.showScreen('current-cards', false);
            
            // Herlaad credentials in de UI
            displayCredentials();
          };
        } else {
          deleteBtn.style.display = 'none';
        }
      });
    }
  }
  
  // Maak één instantie van de ScreenManager (singleton pattern)
  export const screenManager = new ScreenManager();