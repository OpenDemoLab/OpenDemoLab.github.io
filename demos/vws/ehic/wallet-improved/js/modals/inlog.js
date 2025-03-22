// inlog.js - Behandelt de inlog flows (bevestigen, PIN invoer en succes)
import { screenManager } from '../navigation.js';
import { saveSharedData } from '../credentials.js';
import { 
  resetPinInputs, 
  createDivider, 
  createModal, 
  createModalContent, 
  createButtonContainer,
  fieldMapping
} from '../utils.js';

/**
 * Verbergt de navigatiebalk onderaan
 */
function hideBottomNav() {
  const bottomNav = document.querySelector('.bottom-nav');
  if (bottomNav) {
    bottomNav.style.display = 'none';
  }
}

/**
 * Toont de navigatiebalk onderaan
 */
function showBottomNav() {
  const bottomNav = document.querySelector('.bottom-nav');
  if (bottomNav) {
    bottomNav.style.display = 'flex';
  }
}

/**
 * Toont het inlog-bevestigingsscherm
 * @param {Object} data - De data voor inlogverificatie
 */
export function showLoginConfirmationModal(data) {
  // Verberg bottom nav
  hideBottomNav();
  
  // Maak een nieuwe modal voor login verificatie
  const loginModal = createModal({ id: 'login-confirmation-modal' });
  
  // Maak de modal content
  const modalContent = createModalContent();
  modalContent.style.padding = '20px';
  
  // Titel
  const title = document.createElement('h2');
  title.textContent = 'U gaat inloggen bij';
  title.style.textAlign = 'center';
  title.style.color = '#000000';
  title.style.marginBottom = '15px';
  modalContent.appendChild(title);
  
  // Divider
  const divider1 = createDivider();
  modalContent.appendChild(divider1);
  
  // Requester (middenin)
  const requesterContainer = document.createElement('div');
  requesterContainer.style.textAlign = 'center';
  requesterContainer.style.marginBottom = '20px';
  
  const requesterName = document.createElement('h3');
  requesterName.textContent = data.requester;
  requesterName.style.color = '#00847c';
  requesterName.style.fontSize = '24px';
  requesterName.style.marginBottom = '15px';
  requesterContainer.appendChild(requesterName);
  
  // Logo op basis van requester
  const logoContainer = document.createElement('div');
  logoContainer.style.marginBottom = '15px';
  logoContainer.style.textAlign = 'center';
  
  // Kies logo op basis van requester
  let logoUrl = '';
  switch (data.requester.toLowerCase()) {
    case 'mijn zorgverzekeraar':
      logoUrl = 'images/logo-mijnzorgverzekeraar.svg';
      break;
    case 'belastingdienst':
      logoUrl = 'images/logo-belastingdienst.svg';
      break;
    case 'gemeente':
      logoUrl = 'images/logo-gemeente.svg';
      break;
    default:
      logoUrl = 'images/logo-default.svg';
      break;
  }
  
  // Maak een img element voor het logo
  const logoImg = document.createElement('img');
  logoImg.src = logoUrl;
  logoImg.alt = `Logo ${data.requester}`;
  logoImg.style.height = '60px';
  logoImg.style.maxWidth = '80%';
  logoContainer.appendChild(logoImg);
  requesterContainer.appendChild(logoContainer);
  
  modalContent.appendChild(requesterContainer);
  
  // Divider
  const divider2 = createDivider();
  modalContent.appendChild(divider2);
  
  // Gegevens sectie
  const dataSection = document.createElement('p');
  dataSection.textContent = 'U deelt hierbij de volgende gegevens ter identificatie:';
  dataSection.style.marginBottom = '10px';
  modalContent.appendChild(dataSection);
  
  // Bullet lijst met gevraagde velden
  const dataList = document.createElement('ul');
  dataList.style.paddingLeft = '20px';
  dataList.style.marginBottom = '20px';
  
  // Verwerk de gevraagde gegevens
  data.rdfcv.forEach(field => {
    const fieldName = fieldMapping[field] || field;
    const listItem = document.createElement('li');
    listItem.textContent = fieldName;
    listItem.style.marginBottom = '5px';
    dataList.appendChild(listItem);
  });
  
  modalContent.appendChild(dataList);
  
  // Divider
  const divider3 = createDivider();
  modalContent.appendChild(divider3);
  
  // Knoppen container
  const buttonContainer = createButtonContainer();
  
  // Stoppen knop
  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Stoppen';
  cancelButton.className = 'stop-button';
  cancelButton.style.width = '48%';
  
  // Annuleren knop event
  cancelButton.addEventListener('click', () => {
    document.body.removeChild(loginModal);
    screenManager.showScreen('wallet', true);
    showBottomNav(); // Toon bottom nav weer
  });
  
  // Akkoord knop
  const acceptButton = document.createElement('button');
  acceptButton.textContent = 'Akkoord';
  acceptButton.className = 'share-button';
  acceptButton.style.width = '48%';
  
  // Akkoord knop event
  acceptButton.addEventListener('click', () => {
    document.body.removeChild(loginModal);
    showLoginPinConfirmation(data);
  });
  
  // Voeg knoppen toe aan container
  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(acceptButton);
  
  // Voeg knoppencontainer toe aan modalContent
  modalContent.appendChild(buttonContainer);
  
  // Voeg modalContent toe aan modal
  loginModal.appendChild(modalContent);
  
  // Voeg de modal toe aan de body
  document.body.appendChild(loginModal);
}

/**
 * Toont het PIN bevestigingsscherm voor inloggen
 * @param {Object} data - De data voor inlogverificatie
 */
function showLoginPinConfirmation(data) {
  // Verberg bottom nav
  hideBottomNav();
  
  // Maak de modal
  const pinModal = createModal({ id: 'login-pin-confirmation-screen' });
  
  // Maak de modal content
  const modalContent = createModalContent();
  modalContent.style.padding = '20px';
  
  // Titel
  const title = document.createElement('h2');
  title.textContent = 'Voer pincode in ter bevestiging';
  title.style.textAlign = 'center';
  title.style.color = '#000000';
  title.style.marginBottom = '30px';
  title.style.marginTop = '10px';
  modalContent.appendChild(title);
  
  // PIN input container
  const pinInputContainer = document.createElement('div');
  pinInputContainer.className = 'pin-input';
  pinInputContainer.style.display = 'flex';
  pinInputContainer.style.gap = '10px';
  pinInputContainer.style.marginBottom = '30px';
  pinInputContainer.style.marginTop = '20px';
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
    pinInput.style.border = '1px solid #2681cc';
    pinInput.style.borderRadius = '5px';
    pinInput.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
    pinInput.style.backgroundColor = '#f8f8f8';
    
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
  confirmButton.className = 'share-button'; // Gebruik dezelfde class als andere knoppen in de flow
  
  // Alleen de noodzakelijke aanvullingen voor positionering
  confirmButton.style.width = '48%';
  confirmButton.style.margin = '0 auto';
  confirmButton.style.display = 'block';
  
  // Specifieke padding en margin
  confirmButton.style.padding = '16px 20px';
  confirmButton.style.marginTop = '30px';
  
  // Bevestig knop click event
  confirmButton.addEventListener('click', () => {
    const timestamp = new Date().toLocaleString();
    
    // Sla de logindata op als een deelactie
    saveLoginData(data, timestamp);
    
    // Verberg PIN modal
    document.body.removeChild(pinModal);
    
    // Toon succes scherm
    showLoginSuccessScreen(data);
    
    // Reset PIN inputs
    resetPinInputs();
  });
  
  modalContent.appendChild(confirmButton);
  
  // Voeg content toe aan modal
  pinModal.appendChild(modalContent);
  
  // Voeg modal toe aan body
  document.body.appendChild(pinModal);
}

/**
 * Slaat de login-actie op in de credentials lijst
 * @param {Object} data - Data van de inlog-actie
 * @param {string} timestamp - Tijdstip van inloggen
 */
function saveLoginData(data, timestamp) {
  // Log inlogactie als activiteit, maar gebruik NIET saveSharedData
  // omdat dit een dubbele activiteit zou veroorzaken
  import('../activities.js').then(module => {
    module.logActivity(
      `Ingelogd bij ${data.requester}`, 
      `Ingelogd bij ${data.requester}`, 
      timestamp
    );
  });
}

/**
 * Toont het succes-scherm na inloggen
 * @param {Object} data - De data voor inlogverificatie
 */
function showLoginSuccessScreen(data) {
  // Verberg bottom nav
  hideBottomNav();
  
  // Maak de modal
  const loginSuccess = createModal({ id: 'login-success-screen' });
  
  // Maak de modal content
  const modalContent = createModalContent();
  
  // Titel
  const title = document.createElement('h2');
  title.textContent = 'Inloggen geslaagd';
  title.style.textAlign = 'center';
  title.style.color = '#000000';
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
  
  // Tekst inloggen
  const loginText = document.createElement('p');
  loginText.textContent = `U bent succesvol ingelogd bij`;
  loginText.style.color = '#152A62';
  loginText.style.fontSize = '16px';
  loginText.style.marginBottom = '10px';
  
  // Verifier naam
  const verifierNameElement = document.createElement('p');
  verifierNameElement.innerHTML = `<strong>${data.requester}</strong>`;
  verifierNameElement.style.color = '#00847c';
  verifierNameElement.style.fontSize = '18px';
  verifierNameElement.style.marginBottom = '30px';
  
  // Voeg tekst toe aan container
  textContainer.appendChild(loginText);
  textContainer.appendChild(verifierNameElement);
  
  // Voeg tekstcontainer toe aan content
  modalContent.appendChild(textContainer);
  
  // Divider
  const divider2 = createDivider();
  divider2.style.margin = '0 0 30px 0';
  modalContent.appendChild(divider2);
  
  // Instructietekst
  const instructionText = document.createElement('p');
  instructionText.textContent = 'U kunt nu doorgaan in het desbetreffende scherm.';
  instructionText.style.textAlign = 'center';
  instructionText.style.color = '#152A62';
  instructionText.style.fontSize = '14px';
  instructionText.style.marginBottom = '20px';
  modalContent.appendChild(instructionText);
  
  // Divider
  const divider3 = createDivider();
  divider3.style.margin = '0 0 30px 0';
  modalContent.appendChild(divider3);
  
  // Knoppen container
  const buttonContainer = createButtonContainer();
  
  // "Bekijk activiteit" knop
  const activityButton = document.createElement('button');
  activityButton.textContent = 'Zie Activiteit';
  activityButton.className = 'stop-button';
  activityButton.style.width = '48%';
  
  // Activiteitenknop event
  activityButton.addEventListener('click', () => {
    document.body.removeChild(loginSuccess);
    
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
    document.body.removeChild(loginSuccess);
    screenManager.showScreen('wallet', true);
    showBottomNav(); // Toon bottom nav weer
  });
  
  // Voeg knoppen toe aan container
  buttonContainer.appendChild(activityButton);
  buttonContainer.appendChild(closeButton);
  
  // Voeg buttonContainer toe aan content
  modalContent.appendChild(buttonContainer);
  
  // Voeg content toe aan modal
  loginSuccess.appendChild(modalContent);
  
  // Voeg modal toe aan body
  document.body.appendChild(loginSuccess);
}