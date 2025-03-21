// ehic-share.js - Behandelt de EHIC kaart delen flow inclusief PIN bevestiging
import { screenManager } from '../navigation.js';
import { credentials, addCredential, saveCredentials } from '../credentials.js';
import { 
  createDivider, 
  createFlipCardContainer, 
  createTechnicalDetailsAccordion,
  createModal,
  createModalContent,
  createButtonContainer,
  resetPinInputs,
  fieldMapping
} from '../utils.js';

/**
 * Toont de modal voor het delen van de EHIC kaart
 * @param {Object} data - Data van de deelactie
 */
export function showEhicShareModal(data) {
  // Zoek de EHIC kaart in credentials
  const ehicCard = credentials.find(cred => cred.name === 'EHIC pas');
  if (!ehicCard) {
    console.error("EHIC kaart niet gevonden in credentials");
    return;
  }
  
  // Verberg huidige scherm
  screenManager.showScreen('add-card', false);
  
  // Maak de deelmodal
  const ehic = createModal({ id: 'ehic-share-modal' });
  
  // Maak de modal content
  const modalContent = createModalContent();
  
  // Vraagtitel
  const title = document.createElement('h3');
  title.textContent = "Wilt u onderstaande gegevens delen?";
  title.style.textAlign = 'center';
  title.style.color = '#000000';
  title.style.marginBottom = '15px';
  modalContent.appendChild(title);
  
  // Divider
  modalContent.appendChild(createDivider());
  
  // EHIC kaart titel
  const cardTitle = document.createElement('p');
  cardTitle.innerHTML = '<strong>Europese zorgpas</strong>';
  cardTitle.style.textAlign = 'center';
  cardTitle.style.color = '#00847c';
  cardTitle.style.marginBottom = '10px';
  modalContent.appendChild(cardTitle);
  
  // Flipbare kaart
  const cardContainer = createFlipCardContainer();
  modalContent.appendChild(cardContainer);
  
  // Instructie voor draaien
  const flipInstruction = document.createElement('p');
  flipInstruction.textContent = 'Klik op de kaart om deze om te draaien';
  flipInstruction.style.textAlign = 'center';
  flipInstruction.style.color = '#777';
  flipInstruction.style.fontSize = '14px';
  flipInstruction.style.marginBottom = '20px';
  modalContent.appendChild(flipInstruction);
  
  // Divider
  modalContent.appendChild(createDivider());
  
  // Technische details accordion
  const accordion = createTechnicalDetailsAccordion(ehicCard);
  modalContent.appendChild(accordion);
  
  // Divider
  modalContent.appendChild(createDivider());
  
  // Vragende partij en reden container
  const dataContainer = document.createElement('div');
  dataContainer.style.marginTop = '15px';
  dataContainer.style.marginBottom = '15px';
  dataContainer.style.color = '#000000';
  
  // Rij voor vragende partij
  const requesterRow = document.createElement('div');
  requesterRow.style.display = 'flex';
  requesterRow.style.alignItems = 'flex-start';
  requesterRow.style.marginBottom = '5px';
  
  const requesterLabel = document.createElement('div');
  requesterLabel.innerHTML = '<strong>Vragende partij:</strong>';
  requesterLabel.style.width = '150px';
  requesterLabel.style.color = '#000000';
  requesterLabel.style.flexShrink = '0';
  
  const requesterValue = document.createElement('div');
  requesterValue.textContent = data.requester;
  requesterValue.style.color = '#000000';
  
  requesterRow.appendChild(requesterLabel);
  requesterRow.appendChild(requesterValue);
  
  // Rij voor reden
  const reasonRow = document.createElement('div');
  reasonRow.style.display = 'flex';
  reasonRow.style.alignItems = 'flex-start';
  
  const reasonLabel = document.createElement('div');
  reasonLabel.innerHTML = '<strong>Reden:</strong>';
  reasonLabel.style.width = '150px';
  reasonLabel.style.color = '#000000';
  reasonLabel.style.flexShrink = '0';
  
  const reasonValue = document.createElement('div');
  reasonValue.textContent = data.reason || 'Geen reden opgegeven';
  reasonValue.style.color = '#000000';
  
  reasonRow.appendChild(reasonLabel);
  reasonRow.appendChild(reasonValue);
  
  // Voeg rijen toe aan dataContainer
  dataContainer.appendChild(requesterRow);
  dataContainer.appendChild(reasonRow);
  
  // Voeg dataContainer toe aan modalContent
  modalContent.appendChild(dataContainer);
  
  // Divider
  modalContent.appendChild(createDivider());
  
  // Overeenkomst sectie
  const agreementTitle = document.createElement('p');
  agreementTitle.innerHTML = '<strong>Overeenkomst</strong>';
  agreementTitle.style.color = '#000000';
  modalContent.appendChild(agreementTitle);
  
  const agreementText = document.createElement('p');
  if (data.a) {
    agreementText.textContent = fieldMapping.a[data.a] || data.a;
  } else {
    agreementText.textContent = 'Geen overeenkomst gevonden.';
  }
  agreementText.style.color = '#000000';
  agreementText.style.marginBottom = '20px';
  modalContent.appendChild(agreementText);
  
  // Knoppen container
  const buttonContainer = createButtonContainer();
  
  // Stoppen knop
  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Stoppen';
  cancelButton.className = 'stop-button';
  cancelButton.style.width = '48%';
  
  // Stoppen knop click event
  cancelButton.addEventListener('click', () => {
    document.body.removeChild(ehic);
    screenManager.showScreen('wallet', true);
  });
  
  // Akkoord knop
  const acceptButton = document.createElement('button');
  acceptButton.textContent = 'Akkoord';
  acceptButton.className = 'share-button';
  acceptButton.style.width = '48%';
  
  // Akkoord knop click event
  acceptButton.addEventListener('click', () => {
    document.body.removeChild(ehic);
    showPinConfirmationForEhic(data);
  });
  
  // Voeg knoppen toe aan buttonContainer
  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(acceptButton);
  
  // Voeg buttonContainer toe aan modalContent
  modalContent.appendChild(buttonContainer);
  
  // Voeg modalContent toe aan modal
  ehic.appendChild(modalContent);
  
  // Voeg de modal toe aan de body
  document.body.appendChild(ehic);
}

/**
 * Slaat de EHIC deelactie op in de credentials lijst
 * @param {Object} data - De deeldata
 * @param {string} timestamp - Tijdstempel voor de actie
 */
function saveEhicSharedData(data, timestamp = new Date().toLocaleString()) {
  // Voeg de deelactie toe aan de credentials array
  addCredential({
    name: data.requester || 'Onbekende partij',
    reason: data.reason || 'Geen reden opgegeven',
    sharedData: ["EHIC pas"],
    agreement: data.a ? (fieldMapping.a[data.a] || data.a) : 'Geen overeenkomst',
    actionTimestamp: timestamp,
    isShareAction: true
  });
  
  // Log dat de deelactie is opgeslagen
  console.log("EHIC delingsactie opgeslagen:", credentials);
}

/**
 * Toont het succes-scherm na het delen van de EHIC-kaart
 * @param {string} verifierName - Naam van de vragende partij
 */
export function showEhicShareSuccessScreen(verifierName) {
  // Maak de success modal
  const ehicSuccess = createModal({ id: 'ehic-share-success-screen' });
  
  // Maak de modal content
  const modalContent = createModalContent();
  
  // Titel
  const title = document.createElement('h2');
  title.textContent = 'Succes!';
  title.style.textAlign = 'center';
  title.style.color = '#152A62';
  title.style.marginBottom = '15px';
  modalContent.appendChild(title);
  
  // Divider
  const divider1 = createDivider();
  divider1.style.margin = '10px 0 20px 0';
  modalContent.appendChild(divider1);
  
  // Tekstcontainer
  const textContainer = document.createElement('div');
  textContainer.style.textAlign = 'center';
  textContainer.style.marginBottom = '20px';
  textContainer.style.width = '100%';
  
  // Tekst delen gegevens
  const shareText = document.createElement('p');
  shareText.textContent = `Je hebt de gegevens gedeeld met`;
  shareText.style.color = '#152A62';
  shareText.style.fontSize = '16px';
  shareText.style.marginBottom = '10px';
  
  // Verifier naam
  const verifierNameElement = document.createElement('p');
  verifierNameElement.innerHTML = `<strong>${verifierName}</strong>`;
  verifierNameElement.style.color = '#00847c';
  verifierNameElement.style.fontSize = '18px';
  verifierNameElement.style.marginBottom = '30px';
  
  // Voeg tekst toe aan container
  textContainer.appendChild(shareText);
  textContainer.appendChild(verifierNameElement);
  
  // Voeg tekstcontainer toe aan content
  modalContent.appendChild(textContainer);
  
  // Divider
  const divider2 = createDivider();
  divider2.style.margin = '0 0 30px 0';
  modalContent.appendChild(divider2);
  
  // Knoppen container
  const buttonContainer = createButtonContainer();
  
  // "Bekijk activiteit" knop
  const activityButton = document.createElement('button');
  activityButton.textContent = 'Zie Activiteit';
  activityButton.className = 'stop-button';
  activityButton.style.width = '48%';
  
  // Activiteitenknop event
  activityButton.addEventListener('click', () => {
    document.body.removeChild(ehicSuccess);
    
    // Import showActivities functie via dynamische import
    import('../activities.js').then(module => {
      const { showActivities } = module;
      
      // Toon activiteitenscherm
      screenManager.showScreenWithActiveTab('activities', 'activities-navbar-item');
      showActivities(); // Update activiteitenlijst
    });
  });
  
  // Sluiten knop
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Sluiten';
  closeButton.className = 'share-button';
  closeButton.style.width = '48%';
  
  // Sluiten knop event
  closeButton.addEventListener('click', () => {
    document.body.removeChild(ehicSuccess);
    screenManager.showScreen('wallet', true);
  });
  
  // Voeg knoppen toe aan container
  buttonContainer.appendChild(activityButton);
  buttonContainer.appendChild(closeButton);
  
  // Voeg buttonContainer toe aan content
  modalContent.appendChild(buttonContainer);
  
  // Voeg content toe aan modal
  ehicSuccess.appendChild(modalContent);
  
  // Voeg modal toe aan body
  document.body.appendChild(ehicSuccess);
}

/**
 * Toont het PIN bevestigingsscherm voor EHIC delen
 * @param {Object} data - De deeldata
 */
function showPinConfirmationForEhic(data) {
  // Maak de PIN bevestigingsmodal
  const pinModal = createModal({ id: 'pin-confirmation-screen-ehic', className: 'modal' });
  
  // Maak de modal content
  const modalContent = createModalContent();
  
  // Titel
  const title = document.createElement('h2');
  title.textContent = 'Voer je pincode in om gegevens te delen';
  title.style.textAlign = 'center';
  title.style.marginBottom = '20px';
  modalContent.appendChild(title);
  
  // PIN input container
  const pinInputContainer = document.createElement('div');
  pinInputContainer.className = 'pin-input';
  pinInputContainer.style.display = 'flex';
  pinInputContainer.style.gap = '10px';
  pinInputContainer.style.marginBottom = '20px';
  pinInputContainer.style.justifyContent = 'center';
  
  // Maak 6 PIN invoervelden
  for (let i = 0; i < 6; i++) {
    const pinInput = document.createElement('input');
    pinInput.type = 'password';
    pinInput.maxLength = 1;
    pinInput.className = 'pin-box';
    pinInput.inputMode = 'numeric';
    pinInput.style.textAlign = 'center';
    pinInput.style.fontSize = '24px';
    pinInput.style.padding = '10px';
    pinInput.style.width = '45px';
    pinInput.style.height = '50px';
    pinInput.style.border = '1px solid #ccc';
    pinInput.style.borderRadius = '5px';
    
    // Voeg event listener toe om naar volgende veld te gaan bij invoer
    pinInput.addEventListener('input', (e) => {
      if (e.target.value.length === 1 && i < 5) {
        pinInputContainer.children[i + 1].focus();
      }
    });
    
    // Voeg event listener toe voor pijltjestoetsen
    pinInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' && i < 5) {
        pinInputContainer.children[i + 1].focus();
      } else if (e.key === 'ArrowLeft' && i > 0) {
        pinInputContainer.children[i - 1].focus();
      }
    });
    
    pinInputContainer.appendChild(pinInput);
  }
  
  modalContent.appendChild(pinInputContainer);
  
  // Bevestig knop
  const confirmButton = document.createElement('button');
  confirmButton.textContent = 'Bevestig';
  confirmButton.className = 'confirm-pin';
  confirmButton.style.backgroundColor = '#2681cc';
  confirmButton.style.color = 'white';
  confirmButton.style.padding = '15px';
  confirmButton.style.border = 'none';
  confirmButton.style.borderRadius = '5px';
  confirmButton.style.cursor = 'pointer';
  confirmButton.style.minWidth = '250px';
  confirmButton.style.textAlign = 'center';
  confirmButton.style.margin = '0 auto';
  confirmButton.style.display = 'block';
  confirmButton.style.fontSize = '14px';
  confirmButton.style.fontWeight = 'bold';
  
  // Bevestig knop click event
  confirmButton.addEventListener('click', () => {
    // Sla de EHIC deelactie op
    saveEhicSharedData(data);
    
    // Verberg PIN modal
    document.body.removeChild(pinModal);
    
    // Toon succes scherm
    showEhicShareSuccessScreen(data.requester);
    
    // Reset PIN inputs
    resetPinInputs();
  });
  
  modalContent.appendChild(confirmButton);
  
  // Voeg content toe aan modal
  pinModal.appendChild(modalContent);
  
  // Voeg modal toe aan body
  document.body.appendChild(pinModal);
}