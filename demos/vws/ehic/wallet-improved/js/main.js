// main.js - Het startpunt van de Wallet App
import { screenManager } from './navigation.js';
import { loadCredentials, displayCredentials } from './credentials.js';
import { initQrScanner } from './qr-scanner.js';
import './modals/welcome.js';  // Importeer alleen voor de event listeners

// Initialiseer de app wanneer de DOM geladen is
document.addEventListener('DOMContentLoaded', () => {
  // Initialiseer de app
  initApp();
});

function initApp() {
  // Initialiseer QR-scanner
  initQrScanner();
  
  // Laad opgeslagen credentials
  loadCredentials();
  
  // Controleer of we direct naar het hoofdscherm moeten gaan
  if (window.location.hash === '#main') {
    screenManager.showScreen('wallet', true);
    displayCredentials();
  } else {
    // Standaard: toon welkomstscherm
    screenManager.showScreen('welcome', false);
  }
  
  // Stel navigatiebalk event listeners in
  setupNavigationEvents();
}

function setupNavigationEvents() {
  // Overzicht knop in navigatiebalk
  document.getElementById('overview-navbar-item').addEventListener('click', () => {
    screenManager.showScreenWithActiveTab('wallet', 'overview-navbar-item');
  });
  
  // Activiteiten knop in navigatiebalk
  document.getElementById('activities-navbar-item').addEventListener('click', () => {
    screenManager.showScreenWithActiveTab('activities', 'activities-navbar-item');
    // Laad activiteiten met dynamische import
    import('./activities.js').then(module => {
      module.showActivities();
    });
  });

  // Back button van het activiteiten scherm
  document.getElementById('back-activities-btn').addEventListener('click', function() {
    screenManager.showScreen('wallet', true);
    
    // Zet de overview tab actief
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.getElementById('overview-navbar-item').classList.add('active');
  });
  
  // Mijn digitale bewijzen button
  document.getElementById('open-current-cards').addEventListener('click', function() {
    screenManager.showScreen('current-cards', false);
    displayCredentials();
  });
  
  // Sluit huidige kaarten scherm
  document.getElementById('close-current-cards').addEventListener('click', function() {
    screenManager.showScreen('wallet', true);
  });
  
  // QR scan knop
  document.getElementById('qr-scan-button').addEventListener('click', () => {
    screenManager.showScreen('add-card', false);
    import('./qr-scanner.js').then(module => {
      module.startQrScan();
    });
  });
}