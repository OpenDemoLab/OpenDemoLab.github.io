// main.js - Het startpunt van de Wallet App
import { screenManager } from './navigation.js';
import { loadCredentials, displayCredentials } from './credentials.js';
import { initQrScanner } from './qr-scanner.js';
import { createWalletScreen, showWalletScreen } from './wallet-screens/wallet-screen.js';

// Initialiseer de app wanneer de DOM geladen is
document.addEventListener('DOMContentLoaded', () => {
  // Initialiseer de app
  initApp();
});

function initApp() {
  // Initialiseer QR-scanner
  initQrScanner();
  
  // Initialiseer het wallet scherm
  createWalletScreen();
  
  // Laad opgeslagen credentials
  loadCredentials();
  
  // Controleer of we direct naar het hoofdscherm moeten gaan
  if (window.location.hash === '#main') {
    showWalletScreen(true);
  } else {
    // Standaard: toon welkomstscherm als modal
    import('./wallet-screens/welcome-screen.js').then(module => {
      module.showWelcomeScreen();
    });
  }
  
  // Stel navigatiebalk event listeners in
  setupNavigationEvents();
}

function setupNavigationEvents() {
  // Overzicht knop in navigatiebalk
  document.getElementById('overview-navbar-item').addEventListener('click', () => {
    screenManager.showScreenWithActiveTab('wallet', 'overview-navbar-item');
    // Zorg ervoor dat het wallet scherm up-to-date is
    showWalletScreen(true);
  });
  
  // Activiteiten knop in navigatiebalk
  document.getElementById('activities-navbar-item').addEventListener('click', () => {
    screenManager.showScreenWithActiveTab('activities', 'activities-navbar-item');
    // Laad activiteiten met dynamische import
    import('./wallet-screens/activities-screen.js').then(module => {
      module.showActivitiesScreen();
    });
  });
}