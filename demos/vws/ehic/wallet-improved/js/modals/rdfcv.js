// rdfcv.js - RDFCV (Verifier) en RDFCI (Issuer) modals
import { screenManager } from '../navigation.js';
import { credentials, saveSharedData } from '../credentials.js';
import { resetPinInputs, fieldMapping, createDivider, createModal, createModalContent, createButtonContainer } from '../utils.js';

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
 * Toont de RDFCV modal (voor verificatie/delen van gegevens)
 * @param {Object} data - De data voor verificatie
 */
export function showRdfcvModal(data) {
  // Verberg bottom nav
  hideBottomNav();
  
  // Toon RDFCV modal (reeds in HTML)
  const rdfcvModal = document.getElementById('rdfcv-modal');
  
  // Vul de reden
  document.getElementById('rdfcv-reason').innerText = data.reason || 'Geen reden opgegeven.';

  // Voeg de naam van de verifier toe aan de vraag
  document.getElementById('rdfcv-question-text').innerText = `Wilt u onderstaande gegevens delen met ${data.requester}?`;

  // Verwerk de gevraagde gegevens
  const detailsContainer = document.getElementById('rdfcv-details-container');
  detailsContainer.innerHTML = '';

  // Groepeer de velden per kaart
  populateRdfcvDetailsContainer(detailsContainer, data);

  // Verwerk overeenkomstinformatie
  if (data.a) {
    const agreementText = fieldMapping.a[data.a] || data.a;
    document.getElementById('rdfcv-agreement').innerText = agreementText;
  } else {
    document.getElementById('rdfcv-agreement').innerText = 'Geen overeenkomst gevonden.';
  }

  // Toon de modal
  rdfcvModal.style.display = 'flex';
  
  // Stel event handlers in
  setupRdfcvEventHandlers(data);
}

/**
 * Stelt event handlers in voor de RDFCV modal
 * @param {Object} data - De data voor verificatie
 */
function setupRdfcvEventHandlers(data) {
  const rdfcvModal = document.getElementById('rdfcv-modal');
  const rdfcvAcceptButton = document.getElementById('rdfcv-accept-button');
  const rdfcvStopButton = document.getElementById('rdfcv-stop-button');
  
  // Verwijder bestaande event listeners door nieuwe functies te maken
  const newAcceptButton = rdfcvAcceptButton.cloneNode(true);
  rdfcvAcceptButton.parentNode.replaceChild(newAcceptButton, rdfcvAcceptButton);
  
  const newStopButton = rdfcvStopButton.cloneNode(true);
  rdfcvStopButton.parentNode.replaceChild(newStopButton, rdfcvStopButton);
  
  // Nieuwe event listeners toevoegen
  newAcceptButton.addEventListener('click', () => {
    rdfcvModal.style.display = 'none';
    showPinConfirmationVerifier(data);
  });
  
  newStopButton.addEventListener('click', () => {
    rdfcvModal.style.display = 'none';
    screenManager.showScreen('wallet', true);
    showBottomNav(); // Toon bottom nav weer
  });
}

/**
 * Vult de details container van de RDFCV modal
 * @param {HTMLElement} detailsContainer - De container voor details
 * @param {Object} data - De data voor verificatie
 */
function populateRdfcvDetailsContainer(detailsContainer, data) {
  // Groepeer velden per kaart
  let fieldsByCard = {};

  data.rdfcv.forEach((field) => {
    const fieldName = fieldMapping[field] || field;

    // Zoek bij welke kaart het veld hoort
    let matchingCard = credentials.find(cred => {
      return cred.data && cred.data.hasOwnProperty(fieldName);
    });

    if (!matchingCard) {
      matchingCard = credentials.find(cred => cred.name === fieldName);
    }

    if (matchingCard) {
      const cardName = matchingCard.name;

      if (!fieldsByCard[cardName]) {
        fieldsByCard[cardName] = { data: matchingCard.data, fields: [], showAllFields: false };
      }

      if (matchingCard.name === fieldName) {
        fieldsByCard[cardName].showAllFields = true;
      } else {
        fieldsByCard[cardName].fields.push(fieldName);
      }
    } else {
      console.warn(`Field or card '${fieldName}' not found in credentials.`);
    }
  });

  // Maak kaarten voor elke groep velden
  Object.keys(fieldsByCard).forEach((cardName) => {
    const cardInfo = fieldsByCard[cardName];

    // Maak kaart container
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';

    // Maak kaart header
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';
    cardHeader.textContent = cardName;

    // Stel header achtergrondkleur in op basis van kaartnaam
    switch (cardName) {
      case 'Persoonlijke data':
        cardHeader.style.backgroundColor = '#B9E4E2';
        break;
      case 'Woonadres':
        cardHeader.style.backgroundColor = '#b9e4e2';
        break;
      default:
        cardHeader.style.backgroundColor = '#445580';
    }

    // Maak kaart content container
    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';

    // Voeg header en content toe aan kaart container
    cardContainer.appendChild(cardHeader);
    cardContainer.appendChild(cardContent);

    // Maak kaart titel
    const cardTitleElement = document.createElement('div');
    cardTitleElement.className = 'card-title';
    cardTitleElement.textContent = cardName;
    cardContent.appendChild(cardTitleElement);

    // Maak kaart details
    const cardDetails = document.createElement('div');
    cardDetails.className = 'card-details';

    // Toon de juiste velden op basis van de configuratie
    if (cardInfo.showAllFields) {
      // Toon alle velden
      for (let key in cardInfo.data) {
        if (cardInfo.data.hasOwnProperty(key)) {
          addDetailRow(cardDetails, key, cardInfo.data[key]);
        }
      }
    } else {
      // Toon alleen de specifiek gevraagde velden
      cardInfo.fields.forEach(fieldName => {
        const value = cardInfo.data[fieldName];
        addDetailRow(cardDetails, fieldName, value);
      });
    }

    cardContent.appendChild(cardDetails);
    detailsContainer.appendChild(cardContainer);
  });
}

/**
 * Voegt een detailrij toe aan een container
 * @param {HTMLElement} container - De container voor de rij
 * @param {string} key - De sleutel/naam van het veld
 * @param {string} value - De waarde van het veld
 */
function addDetailRow(container, key, value) {
  const detailRow = document.createElement('div');
  detailRow.className = 'detail-row';

  const labelDiv = document.createElement('div');
  labelDiv.className = 'label';
  labelDiv.textContent = `${key}:`;

  const valueDiv = document.createElement('div');
  valueDiv.className = 'value';
  
  if (key === 'Foto') {
    // Als het veld 'Foto' is, voeg dan de afbeelding toe
    const img = document.createElement('img');
    img.src = value;
    img.alt = 'Foto';
    img.style.width = '100%';
    valueDiv.appendChild(img);
  } else {
    // Voor andere velden, toon de tekstwaarde
    valueDiv.textContent = value || 'Niet beschikbaar';
  }

  detailRow.appendChild(labelDiv);
  detailRow.appendChild(valueDiv);
  container.appendChild(detailRow);
}

/**
 * Toont het PIN bevestigingsscherm voor verificatie
 * @param {Object} data - De data voor verificatie
 */
function showPinConfirmationVerifier(data) {
  // Verberg bottom nav
  hideBottomNav();
  
  // Toon PIN bevestigingsscherm (reeds in HTML)
  const pinConfirmationScreen = document.getElementById('pin-confirmation-screen-verifier');
  pinConfirmationScreen.style.display = 'flex';
  
  // Reset PIN inputs
  resetPinInputs();
  
  // Stel confirm knop in
  const confirmPinBtn = document.getElementById('confirm-pin-verifier');
  
  // Verwijder bestaande event listeners
  const newConfirmBtn = confirmPinBtn.cloneNode(true);
  confirmPinBtn.parentNode.replaceChild(newConfirmBtn, confirmPinBtn);
  
  // Nieuwe event listener toevoegen
  newConfirmBtn.addEventListener('click', () => {
    const timestamp = new Date().toLocaleString();
    
    // Sla de gedeelde data op
    saveSharedData(data, timestamp);
    
    // Verberg PIN scherm
    pinConfirmationScreen.style.display = 'none';
    
    // Toon succes scherm
    showVerifierSuccessScreen(data);
    
    // Reset PIN inputs
    resetPinInputs();
  });
}

/**
 * Toont het success scherm na het delen van gegevens
 * @param {Object} data - De data voor verificatie
 */
function showVerifierSuccessScreen(data) {
  // Verberg bottom nav
  hideBottomNav();
  
  // Toon succes scherm (reeds in HTML)
  const successScreen = document.getElementById('verifier-success-screen');
  document.getElementById('success-message').textContent = "Succes!";
  document.getElementById('verifier-name').textContent = data.requester || 'Onbekende partij';
  
  // Toon het scherm
  successScreen.style.display = 'flex';
  
  // Stel event handlers in
  setupVerifierSuccessEventHandlers();
}

/**
 * Stelt event handlers in voor het succes scherm
 */
function setupVerifierSuccessEventHandlers() {
  const successScreen = document.getElementById('verifier-success-screen');
  const seeActivityBtn = document.getElementById('see-activity-btn');
  const closeSuccessBtn = document.getElementById('close-success-btn');
  
  // Verwijder bestaande event listeners
  const newSeeActivityBtn = seeActivityBtn.cloneNode(true);
  seeActivityBtn.parentNode.replaceChild(newSeeActivityBtn, seeActivityBtn);
  
  const newCloseSuccessBtn = closeSuccessBtn.cloneNode(true);
  closeSuccessBtn.parentNode.replaceChild(newCloseSuccessBtn, closeSuccessBtn);
  
  // Nieuwe event listeners toevoegen
  newSeeActivityBtn.addEventListener('click', () => {
    successScreen.style.display = 'none';
    
    // Importeer showActivities functie via dynamische import
    import('../activities.js').then(module => {
      const { showActivities } = module;
      
      // Toon activiteitenscherm
      screenManager.showScreenWithActiveTab('activities', 'activities-navbar-item');
      showBottomNav(); // Toon bottom nav weer
      showActivities();
    });
  });
  
  newCloseSuccessBtn.addEventListener('click', () => {
    successScreen.style.display = 'none';
    screenManager.showScreen('wallet', true);
    showBottomNav(); // Toon bottom nav weer
  });
}

/**
 * Toont de RDFCI modal (voor uitgeven van credentials)
 * @param {Object} data - De data voor uitgifte
 */
export function showRdfciModal(data) {
  // Verberg bottom nav
  hideBottomNav();
  
  // Voor deze demonstratie maken we een vereenvoudigde versie die uitbreidt op de UI-standaard
  
  // Maak de modal
  const modal = createModal({ id: 'rdfci-modal' });
  
  // Maak de modal content
  const modalContent = createModalContent();
  
  // Titel
  const title = document.createElement('h2');
  title.textContent = `Wilt u de ${data.name} ontvangen?`;
  title.style.textAlign = 'center';
  title.style.color = '#152A62';
  title.style.marginBottom = '15px';
  modalContent.appendChild(title);
  
  // Divider
  modalContent.appendChild(createDivider());
  
  // Uitgever info
  const issuerInfo = document.createElement('p');
  issuerInfo.innerHTML = `Uitgegeven door: <strong>${data.issuedBy}</strong>`;
  issuerInfo.style.textAlign = 'center';
  issuerInfo.style.fontSize = '16px';
  issuerInfo.style.marginBottom = '20px';
  modalContent.appendChild(issuerInfo);
  
  // Divider
  modalContent.appendChild(createDivider());
  
  // Velden container
  const fieldsContainer = document.createElement('div');
  fieldsContainer.style.marginBottom = '20px';
  
  // Voeg velden toe
  for (const key in data) {
    if (key !== 'name' && key !== 'issuedBy' && key !== 'rdfci' && key !== 'type') {
      const fieldRow = document.createElement('div');
      fieldRow.style.display = 'flex';
      fieldRow.style.marginBottom = '10px';
      
      const label = document.createElement('div');
      label.textContent = `${fieldMapping[key] || key}:`;
      label.style.fontWeight = 'bold';
      label.style.width = '50%';
      
      const value = document.createElement('div');
      value.textContent = data[key];
      value.style.width = '50%';
      
      fieldRow.appendChild(label);
      fieldRow.appendChild(value);
      fieldsContainer.appendChild(fieldRow);
    }
  }
  
  modalContent.appendChild(fieldsContainer);
  
  // Divider
  modalContent.appendChild(createDivider());
  
  // Knoppen container
  const buttonContainer = createButtonContainer();
  
  // Annuleren knop
  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Annuleren';
  cancelButton.className = 'stop-button';
  cancelButton.style.width = '48%';
  
  // Annuleren knop event
  cancelButton.addEventListener('click', () => {
    document.body.removeChild(modal);
    screenManager.showScreen('wallet', true);
    showBottomNav(); // Toon bottom nav weer
  });
  
  // Accepteren knop
  const acceptButton = document.createElement('button');
  acceptButton.textContent = 'Accepteren';
  acceptButton.className = 'share-button';
  acceptButton.style.width = '48%';
  
  // Accepteren knop event
  acceptButton.addEventListener('click', () => {
    document.body.removeChild(modal);
    showPinConfirmationIssuer(data);
  });
  
  // Voeg knoppen toe aan container
  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(acceptButton);
  
  // Voeg buttonContainer toe aan modalContent
  modalContent.appendChild(buttonContainer);
  
  // Voeg modalContent toe aan modal
  modal.appendChild(modalContent);
  
  // Voeg modal toe aan body
  document.body.appendChild(modal);
}

/**
 * Toont het PIN bevestigingsscherm voor uitgifte
 * @param {Object} data - De data voor uitgifte
 */
function showPinConfirmationIssuer(data) {
  // Verberg bottom nav
  hideBottomNav();
  
  // Maak de modal
  const modal = createModal({ id: 'pin-confirmation-screen-issuer' });
  
  // Maak de modal content
  const modalContent = createModalContent();
  
  // Titel
  const title = document.createElement('h2');
  title.textContent = 'Voer je pincode in om gegevens te ontvangen';
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
    // Sla het credential op via dynamische import
    import('../credentials.js').then(module => {
      const { addCredential } = module;
      
      // Maak een nieuw object voor de gemapte data
      const mappedData = {};

      // Map de veldnamen
      for (let key in data) {
        if (
          data.hasOwnProperty(key) &&
          key !== 'rdfci' &&
          key !== 'a' &&
          key !== 't' &&
          key !== 'name' &&
          key !== 'issuedBy' &&
          key !== 'reason' &&
          key !== 'verifier' &&
          key !== 'issuer' &&
          key !== 'type' &&
          key !== 'requester'
        ) {
          const fieldName = fieldMapping[key] || key;
          mappedData[fieldName] = data[key];
        }
      }
      
      // Sla het kaartje op met de gemapte data
      addCredential({
        name: data.name || 'Onbekend kaartje',
        issuedBy: data.issuedBy || 'Onbekende uitgever',
        actionTimestamp: new Date().toLocaleString(),
        isShareAction: false,
        data: mappedData
      });
      
      // Verberg PIN modal
      document.body.removeChild(modal);
      
      // Toon succes scherm
      showIssuerSuccessScreen(data);
      
      // Reset PIN inputs
      resetPinInputs();
    });
  });
  
  modalContent.appendChild(confirmButton);
  
  // Voeg content toe aan modal
  modal.appendChild(modalContent);
  
  // Voeg modal toe aan body
  document.body.appendChild(modal);
}

/**
 * Toont het succes scherm na ontvangen van een credential
 * @param {Object} data - De data voor uitgifte
 */
function showIssuerSuccessScreen(data) {
  // Verberg bottom nav
  hideBottomNav();
  
  // Maak de modal
  const modal = createModal({ id: 'issuer-success-screen' });
  
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
  
  // Credential tekst
  const credText = document.createElement('p');
  credText.innerHTML = `<strong>${data.name}</strong>`;
  credText.style.color = '#00847c';
  credText.style.fontSize = '16px';
  credText.style.marginBottom = '10px';
  
  // Uitgever tekst
  const issuedByContainer = document.createElement('p');
  issuedByContainer.innerHTML = `uitgegeven door <strong style="color: #00847c;">${data.issuedBy}</strong>`;
  issuedByContainer.style.color = '#152A62';
  issuedByContainer.style.fontSize = '16px';
  issuedByContainer.style.marginBottom = '10px';
  
  // Opgeslagen tekst
  const savedText = document.createElement('p');
  savedText.textContent = 'is succesvol opgeslagen in je wallet.';
  savedText.style.color = '#152A62';
  savedText.style.fontSize = '16px';
  savedText.style.marginBottom = '30px';
  
  // Voeg alle tekst toe aan container
  textContainer.appendChild(credText);
  textContainer.appendChild(issuedByContainer);
  textContainer.appendChild(savedText);
  
  // Voeg tekstcontainer toe aan content
  modalContent.appendChild(textContainer);
  
  // Divider
  const divider2 = createDivider();
  divider2.style.margin = '0 0 30px 0';
  modalContent.appendChild(divider2);
  
  // Sluiten knop
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Sluiten';
  closeButton.style.backgroundColor = '#2681cc';
  closeButton.style.color = 'white';
  closeButton.style.padding = '10px 20px';
  closeButton.style.borderRadius = '5px';
  closeButton.style.border = 'none';
  closeButton.style.fontSize = '16px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.width = '150px';
  closeButton.style.textAlign = 'center';
  closeButton.style.marginTop = '10px';
  closeButton.style.display = 'block';
  closeButton.style.margin = '10px auto'; // Centreer de knop
  
  // Sluiten knop click event
  closeButton.addEventListener('click', () => {
    document.body.removeChild(modal);
    
    // Update het overzicht van kaartjes via dynamische import
    import('../credentials.js').then(module => {
      module.displayCredentials();
      
      // Ga naar wallet scherm
      screenManager.showScreen('wallet', true);
      showBottomNav(); // Toon bottom nav weer
    });
  });
  
  // Voeg sluiten knop toe aan modal content
  modalContent.appendChild(closeButton);
  
  // Voeg content toe aan modal
  modal.appendChild(modalContent);
  
  // Voeg modal toe aan body
  document.body.appendChild(modal);
}