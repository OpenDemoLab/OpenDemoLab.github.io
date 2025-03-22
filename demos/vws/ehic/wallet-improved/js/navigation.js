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
    
    // Markeer welke schermen nu modal-based zijn
    this.modalScreens = {
      'welcome': true,
      'pin-inlog': true,
      'current-cards': true,
      'details': true,
      'activities': true
    };
  }
  
  /**
   * Registreert of update een scherm in de screens collectie
   * @param {string} screenId - ID van het scherm
   * @param {HTMLElement} screenElement - Het element van het scherm
   */
  registerScreen(screenId, screenElement) {
    this.screens[screenId] = screenElement;
  }
  
  /**
   * Toont een specifiek scherm en verbergt alle andere
   * @param {string} screenId - ID van het scherm dat getoond moet worden
   * @param {boolean} showNav - Of de navigatiebalk getoond moet worden
   * @returns {ScreenManager} - Voor method chaining
   */
  showScreen(screenId, showNav = false) {
    // Check if screen is modal-based
    if (this.modalScreens[screenId]) {
      // Dynamically import and show the appropriate modal
      switch(screenId) {
        case 'welcome':
          import('./wallet-screens/welcome-screen.js').then(module => module.showWelcomeScreen());
          break;
        case 'pin-inlog':
          import('./wallet-screens/pin-login.js').then(module => module.showPinLoginScreen());
          break;
        case 'current-cards':
          import('./wallet-screens/current-cards-screen.js').then(module => module.showCurrentCardsScreen());
          break;
        case 'activities':
          import('./wallet-screens/activities-screen.js').then(module => module.showActivitiesScreen());
          break;
      }
    } else {
      // For non-modal screens, use the original approach
      
      // Verberg alle schermen
      Object.values(this.screens).forEach(screen => {
        if (screen) screen.style.display = 'none';
      });
      
      // Toon het gewenste scherm
      if (this.screens[screenId]) {
        const screen = this.screens[screenId];
        
        // Bepaal de juiste display-stijl op basis van het scherm
        if (screenId === 'current-cards') {
          screen.style.display = 'flex';
        } else {
          screen.style.display = 'block';
        }
      } else {
        console.warn(`Scherm '${screenId}' is niet gevonden.`);
      }
    }
    
    // Toon of verberg de navigatiebalk
    if (this.bottomNav) {
      this.bottomNav.style.display = showNav ? 'flex' : 'none';
    }
    
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
    // Use the modal approach for details
    import('./wallet-screens/details-screen.js').then(module => {
      module.showDetailsScreen(credential, index);
    });
  }
}

// Maak één instantie van de ScreenManager (singleton pattern)
export const screenManager = new ScreenManager();