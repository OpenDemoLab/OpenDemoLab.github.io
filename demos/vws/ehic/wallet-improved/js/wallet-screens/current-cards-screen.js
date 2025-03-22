// current-cards-screen.js - Volledig gecorrigeerde versie
import { screenManager } from '../navigation.js';
import { displayCredentials } from '../credentials.js';
import { createModal, createModalContent } from '../utils.js';

/**
 * Shows the current cards (My Digital Proofs) screen as a modal
 */
export function showCurrentCardsScreen() {
  // Verwijder eerst eventuele bestaande modals met dezelfde ID
  const existingModal = document.getElementById('current-cards-modal');
  if (existingModal) {
    document.body.removeChild(existingModal);
  }

  // Create the modal container
  const cardsModal = createModal({ id: 'current-cards-modal' });
  cardsModal.style.padding = '20px';
  cardsModal.style.overflowY = 'auto';
  
  // Create the header with back button
  const header = document.createElement('div');
  header.className = 'details-header';
  header.style.position = 'absolute';
  header.style.top = '20px';
  header.style.left = '20px';
  header.style.right = '20px';
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  
  const backButton = document.createElement('button');
  backButton.className = 'close-btn';
  backButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
  
  // Back button event listener
  backButton.addEventListener('click', () => {
    // Remove the modal
    document.body.removeChild(cardsModal);
    
    // Show the wallet screen
    screenManager.showScreen('wallet', true);
  });
  
  header.appendChild(backButton);
  cardsModal.appendChild(header);
  
  // Create title section
  const titleSection = document.createElement('div');
  titleSection.id = 'current-cards-title';
  titleSection.className = 'header-screen';
  titleSection.innerHTML = `
    <h3>Mijn digitale bewijzen</h3>
    <div class="title-divider"></div>
  `;
  cardsModal.appendChild(titleSection);
  
  // Create wallet grid for cards
  const walletGrid = document.createElement('section');
  walletGrid.className = 'wallet-grid';
  walletGrid.id = 'wallet-grid';
  walletGrid.style.width = '100%'; // Zorg dat de kaarten volle breedte hebben
  walletGrid.style.padding = '0 10px'; // Voeg padding toe voor betere layout
  cardsModal.appendChild(walletGrid);
  
  // Add modal to body
  document.body.appendChild(cardsModal);
  
  // Gebruik requestAnimationFrame om te zorgen dat de DOM is bijgewerkt voordat we de displayCredentials aanroepen
  requestAnimationFrame(() => {
    displayCredentials();
  });
}