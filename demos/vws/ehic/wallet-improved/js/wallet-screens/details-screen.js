// details-screen.js - Volledig gecorrigeerde versie
import { screenManager } from '../navigation.js';
import { removeCredential, displayCredentials } from '../credentials.js';
import { createModal, createModalContent, createDivider } from '../utils.js';

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
  
  // Check if this is an EHIC card
  if (credential.name === 'EHIC pas') {
    showEhicDetailsScreen(credential, index);
    return;
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

/**
 * Shows the EHIC card details in a specialized modal
 * @param {Object} credential - The EHIC credential to show
 * @param {number} index - The index of the credential in the array
 */
function showEhicDetailsScreen(credential, index) {
  // Create the modal container
  const detailsModal = createModal({ id: 'ehic-details-modal' });
  detailsModal.style.padding = '20px';
  detailsModal.style.overflowY = 'auto';
  
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
    document.body.removeChild(detailsModal);
    
    // Show the current cards screen
    import('./current-cards-screen.js').then(module => {
      module.showCurrentCardsScreen();
    });
  });
  
  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-btn';
  deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
  
  // Show delete button for EHIC card
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
  
  header.appendChild(backButton);
  header.appendChild(deleteButton);
  detailsModal.appendChild(header);
  
  // Add title
  const title = document.createElement('h2');
  title.textContent = 'Europese zorgpas';
  title.style.textAlign = 'center';
  title.style.color = '#00847c';
  title.style.marginTop = '40px';
  title.style.marginBottom = '15px';
  detailsModal.appendChild(title);

  // Add issuer
  const issuer = document.createElement('p');
  issuer.innerHTML = `Uitgegeven door: <span style="font-weight: bold; color: #00847c;">${credential.issuedBy}</span>`;
  issuer.style.textAlign = 'center';
  issuer.style.color = '#555';
  issuer.style.marginBottom = '20px';
  issuer.style.fontSize = '14px';
  detailsModal.appendChild(issuer);

  // Add divider
  const divider1 = document.createElement('div');
  divider1.className = 'divider';
  detailsModal.appendChild(divider1);

  // Create the card container with flip functionality
  const cardContainer = document.createElement('div');
  cardContainer.className = 'card-flip-container';
  cardContainer.style.width = '100%';
  cardContainer.style.minHeight = '200px';
  cardContainer.style.perspective = '1000px';
  cardContainer.style.marginBottom = '20px';
  cardContainer.style.cursor = 'pointer';

  // Create the flip inner container
  const cardFlipInner = document.createElement('div');
  cardFlipInner.className = 'card-flip-inner';
  cardFlipInner.style.position = 'relative';
  cardFlipInner.style.width = '100%';
  cardFlipInner.style.height = '100%';
  cardFlipInner.style.textAlign = 'center';
  cardFlipInner.style.transition = 'transform 0.8s';
  cardFlipInner.style.transformStyle = 'preserve-3d';

  // Create the front of the card
  const cardFront = document.createElement('div');
  cardFront.className = 'card-front';
  cardFront.style.position = 'absolute';
  cardFront.style.width = '100%';
  cardFront.style.height = '100%';
  cardFront.style.backfaceVisibility = 'hidden';
  cardFront.style.border = 'none';
  cardFront.style.borderRadius = '10px';
  cardFront.style.padding = '10px';
  cardFront.style.boxSizing = 'border-box';
  cardFront.style.display = 'flex';
  cardFront.style.justifyContent = 'center';
  cardFront.style.alignItems = 'center';

  // Add the front image
  const frontImage = document.createElement('img');
  frontImage.src = '../base/images/ehic-front.png';
  frontImage.alt = 'EHIC Card Front';
  frontImage.style.maxWidth = '100%';
  frontImage.style.maxHeight = '100%';
  frontImage.style.borderRadius = '8px';
  cardFront.appendChild(frontImage);

  // Create the back of the card
  const cardBack = document.createElement('div');
  cardBack.className = 'card-back';
  cardBack.style.position = 'absolute';
  cardBack.style.width = '100%';
  cardBack.style.height = '100%';
  cardBack.style.backfaceVisibility = 'hidden';
  cardBack.style.transform = 'rotateY(180deg)';
  cardBack.style.border = 'none';
  cardBack.style.borderRadius = '10px';
  cardBack.style.padding = '10px';
  cardBack.style.boxSizing = 'border-box';
  cardBack.style.display = 'flex';
  cardBack.style.justifyContent = 'center';
  cardBack.style.alignItems = 'center';

  // Add the back image
  const backImage = document.createElement('img');
  backImage.src = '../base/images/ehic-back.png';
  backImage.alt = 'EHIC Card Back';
  backImage.style.maxWidth = '100%';
  backImage.style.maxHeight = '100%';
  backImage.style.borderRadius = '8px';
  cardBack.appendChild(backImage);

  // Add the front and back to the flip inner container
  cardFlipInner.appendChild(cardFront);
  cardFlipInner.appendChild(cardBack);
  cardContainer.appendChild(cardFlipInner);
  detailsModal.appendChild(cardContainer);

  // Add click event to flip the card
  cardContainer.addEventListener('click', () => {
    if (cardFlipInner.style.transform === 'rotateY(180deg)') {
      cardFlipInner.style.transform = 'rotateY(0deg)';
    } else {
      cardFlipInner.style.transform = 'rotateY(180deg)';
    }
  });

  // Add instructions
  const flipInstruction = document.createElement('p');
  flipInstruction.textContent = 'Klik op de kaart om deze om te draaien';
  flipInstruction.style.textAlign = 'center';
  flipInstruction.style.color = '#777';
  flipInstruction.style.fontSize = '14px';
  flipInstruction.style.marginBottom = '20px';
  detailsModal.appendChild(flipInstruction);

  // Add another divider
  const divider2 = document.createElement('div');
  divider2.className = 'divider';
  detailsModal.appendChild(divider2);

  // Create an accordion for technical details
  const accordion = document.createElement('div');
  accordion.className = 'accordion';
  accordion.style.width = '100%';
  accordion.style.marginBottom = '20px';

  // Create the accordion button
  const accordionBtn = document.createElement('button');
  accordionBtn.className = 'accordion-btn';
  accordionBtn.textContent = 'Technische gegevens';
  accordionBtn.style.backgroundColor = '#eee';
  accordionBtn.style.color = '#444';
  accordionBtn.style.cursor = 'pointer';
  accordionBtn.style.padding = '12px';
  accordionBtn.style.width = '100%';
  accordionBtn.style.textAlign = 'left';
  accordionBtn.style.border = 'none';
  accordionBtn.style.outline = 'none';
  accordionBtn.style.fontSize = '16px';
  accordionBtn.style.transition = '0.4s';
  accordionBtn.style.borderRadius = '5px';
  accordionBtn.style.position = 'relative';

  // Add a plus/minus indicator
  const indicator = document.createElement('span');
  indicator.innerHTML = '+';
  indicator.style.position = 'absolute';
  indicator.style.right = '15px';
  indicator.style.fontSize = '20px';
  accordionBtn.appendChild(indicator);

  // Create the accordion panel
  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.style.padding = '0 8px';
  panel.style.backgroundColor = '#f9f9f9';
  panel.style.maxHeight = '0';
  panel.style.overflow = 'hidden';
  panel.style.transition = 'max-height 0.2s ease-out';
  panel.style.borderRadius = '0 0 5px 5px';
  panel.style.width = '100%';
  panel.style.fontSize = 'small';

  // Add technical details content
  const details = document.createElement('div');
  details.style.padding = '10px 0';

  // Include all data fields, only exclude a few specific ones
  const excludedKeys = ['rdfci', 'isShareAction', 'actionTimestamp'];

  // Add all data fields to the technical details
  // First add the top-level properties (name, issuedBy, LEID)
  const addDetailRow = (key, value) => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.marginBottom = '8px';
    row.style.flexWrap = 'wrap';

    const label = document.createElement('div');
    label.style.fontWeight = 'bold';
    label.style.width = '45%';
    label.style.padding = '0 5px 0 0';
    label.style.wordWrap = 'break-word';
    label.style.overflowWrap = 'break-word';
    label.textContent = key + ':';

    const valueElement = document.createElement('div');
    valueElement.style.width = '55%';
    valueElement.style.wordWrap = 'break-word';
    valueElement.style.overflowWrap = 'break-word';
    valueElement.textContent = value;

    row.appendChild(label);
    row.appendChild(valueElement);
    details.appendChild(row);
  };

  // Add top-level properties first
  if (credential.name) addDetailRow('name', credential.name);
  if (credential.issuedBy) addDetailRow('issuedBy', credential.issuedBy);
  if (credential.LEID) addDetailRow('LEID', credential.LEID);
  
  // Then add all data properties
  if (credential.data) {
    for (let key in credential.data) {
      if (!excludedKeys.includes(key)) {
        addDetailRow(key, credential.data[key]);
      }
    }
  }

  panel.appendChild(details);

  // Add accordion toggle functionality
  accordionBtn.addEventListener('click', function() {
    this.classList.toggle('active');

    if (panel.style.maxHeight && panel.style.maxHeight !== '0px') {
      panel.style.maxHeight = '0';
      indicator.innerHTML = '+';
    } else {
      panel.style.maxHeight = panel.scrollHeight + 200 + 'px';
      indicator.innerHTML = '-';
    }
  });

  accordion.appendChild(accordionBtn);
  accordion.appendChild(panel);
  detailsModal.appendChild(accordion);
  
  // Add the modal to the body
  document.body.appendChild(detailsModal);
}