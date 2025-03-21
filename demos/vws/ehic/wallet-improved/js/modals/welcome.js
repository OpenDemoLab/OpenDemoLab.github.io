// welcome.js - Behandelt het welkomstscherm en PIN-inlog flow
import { screenManager } from '../navigation.js';
import { loadCredentials, displayCredentials } from '../credentials.js';

/**
 * Initialiseert de welkom- en PIN-inlogmodules
 */
export function initWelcomeModule() {
  setupEventListeners();
  setupPinInputHandling();
}

/**
 * Stelt de event listeners in voor de welkom- en PIN-inlogschermen
 */
function setupEventListeners() {
  // Van welkomstscherm naar PIN-inlog
  document.getElementById('next-welcome').addEventListener('click', function() {
    screenManager.showScreen('pin-inlog', false);
  });

  // Van PIN-inlog naar wallet scherm
  document.getElementById('submit-pin').addEventListener('click', function() {
    // PIN validatie kan hier worden toegevoegd
    validatePin();
  });
}

/**
 * Valideert de PIN en gaat naar het wallet scherm als deze correct is
 */
function validatePin() {
  // In de huidige implementatie is er geen echte PIN-validatie,
  // de functie gaat altijd naar het wallet scherm
  
  // Toon het wallet scherm en laad credentials
  screenManager.showScreen('wallet', true);
  
  // Zorg ervoor dat credentials geladen zijn
  loadCredentials();
  displayCredentials();
}

/**
 * Stelt de PIN-invoerhandling in
 */
function setupPinInputHandling() {
  const pinInputs = document.querySelectorAll('.pin-box');
  
  pinInputs.forEach((box, index) => {
    // Als een cijfer wordt ingevoerd, ga naar het volgende veld
    box.addEventListener('input', (e) => {
      if (e.target.value.length === 1 && index < pinInputs.length - 1) {
        pinInputs[index + 1].focus();
      }
      
      // Als de laatste PIN-box is ingevuld, controleer of alle velden zijn ingevuld
      if (index === pinInputs.length - 1 && e.target.value.length === 1) {
        const allFilled = Array.from(pinInputs).every(input => input.value.length === 1);
        
        if (allFilled) {
          // Optioneel: automatisch submitten bij volledige invoer
          // document.getElementById('submit-pin').click();
        }
      }
    });
    
    // Navigatie met pijltjestoetsen
    box.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' && index < pinInputs.length - 1) {
        pinInputs[index + 1].focus();
      } else if (e.key === 'ArrowLeft' && index > 0) {
        pinInputs[index - 1].focus();
      }
    });
  });
}

// Initialiseer de module zodra het script is geladen
initWelcomeModule();