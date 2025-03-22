// details-screen.js - Volledig gecorrigeerde versie
import { screenManager } from '../navigation.js';
import { removeCredential, displayCredentials } from '../credentials.js';
import { createModal, createModalContent } from '../utils.js';

/**
 * Shows the details screen for a credential as a modal
 * @param {Object} credential - The credential to show details for
 * @param {number} index - The index of the credential in the array
 */
export function showDetailsScreen(credential, index) {
  // Verwijder eerst eventuele bestaande modals met dezelfde ID
  const existingModal = document.getElementById('details-modal');
  if (existingModal) {
    document.body.removeChild(existingModal);
  }
  
  // Create the modal container
  const detailsModal = createModal({ id: 'details-modal' });
  detailsModal.style.padding = '20px';
  detailsModal.style.overflowY = 'auto';
  
  // Create the header with back button and delete button
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
    document.body.removeChild(detailsModal);
    
    // Show the current cards screen
    import('./current-cards-screen.js').then(module => {
      module.showCurrentCardsScreen();
    });
  });
  
  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-btn';
  deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
  
  // Only show delete button for non-standard cards
  if (credential.name !== 'Persoonlijke data' && credential.name !== 'Woonadres' && credential.name !== 'Foto') {
    deleteButton.style.display = 'block';
    
    // Delete button event listener
    deleteButton.addEventListener('click', () => {
      // Remove credential
      removeCredential(index);
      
      // Remove the modal
      document.body.removeChild(detailsModal);
      
      // Show the current cards screen with updated credentials
      import('./current-cards-screen.js').then(module => {
        module.showCurrentCardsScreen();
      });
    });
  } else {
    deleteButton.style.display = 'none';
  }
  
  header.appendChild(backButton);
  header.appendChild(deleteButton);
  detailsModal.appendChild(header);
  
  // Create title
  const title = document.createElement('h3');
  title.id = 'details-title';
  title.textContent = credential.name;
  title.style.marginTop = '40px';
  detailsModal.appendChild(title);
  
  // Create divider
  const divider = document.createElement('div');
  divider.className = 'divider';
  detailsModal.appendChild(divider);
  
  // Create details content
  const detailsContent = document.createElement('div');
  detailsContent.id = 'details-content';
  
  // Render specific content based on credential type
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
  
  detailsModal.appendChild(detailsContent);
  
  // Add the modal to the body
  document.body.appendChild(detailsModal);
}