// ehic-collect.js - Behandelt de EHIC-kaart ophalen flows (toevoegen en details bekijken)
import { screenManager } from '../navigation.js';
import { credentials, addCredential, saveCredentials } from '../credentials.js';
import { 
  createDivider, 
  createFlipCardContainer, 
  createTechnicalDetailsAccordion,
  createModal,
  createModalContent,
  createButtonContainer
} from '../utils.js';

/**
 * Toont de EHIC kaartdetails
 * @param {Object} credential - Het EHIC credential
 * @param {number} index - De index in de credentials array
 */
export function showEhicDetails(credential, index) {
  // Verberg andere schermen
  document.getElementById('wallet-screen').style.display = 'none';
  document.getElementById('current-cards').style.display = 'none';
  document.querySelector('.bottom-nav').style.display = 'none';

  // Maak de detail view
  const ehic = createModal({ id: 'ehic-details-view' });
  
  // Maak header met terug-knop
  const header = document.createElement('div');
  header.className = 'details-header';
  header.style.position = 'relative';
  header.style.marginBottom = '50px';
  header.style.width = '100%'; // Zorg dat de header de volledige breedte heeft
  header.style.display = 'flex'; // Gebruik flexbox voor layout
  header.style.justifyContent = 'flex-start'; // Lijn items links uit

  const backButton = document.createElement('button');
  backButton.className = 'close-btn';
  backButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
  backButton.style.background = 'none';
  backButton.style.border = 'none';
  backButton.style.fontSize = '24px';
  backButton.style.color = '#4a90e2';
  backButton.style.cursor = 'pointer';
  backButton.style.position = 'absolute';
  backButton.style.left = '0';
  backButton.style.top = '0';

  // Voeg terug-knop event toe
  backButton.addEventListener('click', () => {
    document.body.removeChild(ehic);
    screenManager.showScreen('current-cards', false);
  });

  header.appendChild(backButton);
  ehic.appendChild(header);

  // Maak de modal content
  const modalContent = createModalContent();
  
  // Titel
  const title = document.createElement('h2');
  title.textContent = 'Europese zorgpas';
  title.style.textAlign = 'center';
  title.style.color = '#00847c';
  title.style.marginBottom = '15px';
  modalContent.appendChild(title);

  // Uitgever
  const issuer = document.createElement('p');
  issuer.innerHTML = `Uitgegeven door: <span style="font-weight: bold; color: #00847c;">${credential.issuedBy}</span>`;
  issuer.style.textAlign = 'center';
  issuer.style.color = '#555';
  issuer.style.marginBottom = '20px';
  issuer.style.fontSize = '14px';
  modalContent.appendChild(issuer);

  // Divider
  modalContent.appendChild(createDivider());
  
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
  const accordion = createTechnicalDetailsAccordion(credential);
  modalContent.appendChild(accordion);
  
  // Voeg modalContent toe aan de modal
  ehic.appendChild(modalContent);
  
  // Voeg de modal toe aan de body
  document.body.appendChild(ehic);
}

/**
 * Toont het modal om een EHIC-kaart toe te voegen
 * @param {Object} data - Data voor de EHIC-kaart
 */
export function showEhicCardModal(data) {
  // Verberg huidige scherm
  screenManager.showScreen('add-card', false);
  
  // Maak de modal
  const ehic = createModal({ id: 'ehic-card-modal' });
  
  // Maak de modal content
  const modalContent = createModalContent();
  
  // Titel
  const title = document.createElement('h2');
  title.textContent = 'Europese zorgpas';
  title.style.textAlign = 'center';
  title.style.color = '#00847c';
  title.style.marginBottom = '15px';
  modalContent.appendChild(title);
  
  // Uitgever
  const issuer = document.createElement('p');
  issuer.innerHTML = `Uitgegeven door: <span style="font-weight: bold; color: #00847c;">${data.issuedBy}</span>`;
  issuer.style.textAlign = 'center';
  issuer.style.color = '#555';
  issuer.style.marginBottom = '20px';
  issuer.style.fontSize = '14px';
  modalContent.appendChild(issuer);
  
  // Divider
  modalContent.appendChild(createDivider());
  
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
  const accordion = createTechnicalDetailsAccordion(data);
  modalContent.appendChild(accordion);
  
  // Knoppen container
  const buttonContainer = createButtonContainer();
  
  // Annuleren knop
  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Annuleren';
  cancelButton.style.padding = '10px 20px';
  cancelButton.style.backgroundColor = '#f2f2f2';
  cancelButton.style.color = '#333';
  cancelButton.style.border = 'none';
  cancelButton.style.borderRadius = '5px';
  cancelButton.style.cursor = 'pointer';
  cancelButton.style.width = '48%';
  
  // Annuleren knop click event
  cancelButton.addEventListener('click', () => {
    document.body.removeChild(ehic);
    screenManager.showScreen('wallet', true);
  });
  
  // Opslaan knop
  const saveButton = document.createElement('button');
  saveButton.textContent = 'Opslaan';
  saveButton.style.padding = '10px 20px';
  saveButton.style.backgroundColor = '#2681cc';
  saveButton.style.color = 'white';
  saveButton.style.border = 'none';
  saveButton.style.borderRadius = '5px';
  saveButton.style.cursor = 'pointer';
  saveButton.style.width = '48%';
  
  // Opslaan knop click event
  saveButton.addEventListener('click', () => {
    saveEhicCard(data);
    document.body.removeChild(ehic);
    showEhicSuccessScreen('EHIC pas', data.issuedBy);
  });
  
  // Voeg knoppen toe aan container
  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(saveButton);
  
  // Voeg knoppencontainer toe aan content
  modalContent.appendChild(buttonContainer);
  
  // Voeg content toe aan modal
  ehic.appendChild(modalContent);
  
  // Voeg modal toe aan de body
  document.body.appendChild(ehic);
}

/**
 * Slaat EHIC kaart op in de credentials
 * @param {Object} data - Data voor de EHIC kaart
 */
function saveEhicCard(data) {
  const timestamp = new Date().toLocaleString();
  
  // Maak nieuw credential object
  addCredential({
    name: 'EHIC pas',
    issuedBy: data.issuedBy,
    LEIDissuer: data.LEIDissuer,
    issuedOnBehalfOf: data.issuedOnBehalfOf, 
    LEIDonBehalf: data.LEIDonBehalf,
    actionTimestamp: timestamp,
    isShareAction: false,
    data: {
      'Naam': data['Name'],
      'Voornaam': data['Given name'],
      'Geboortedatum': data['Date of birth'],
      'Persoonlijk identificatienummer': data['Personal identification number'],
      'Identificatienummer instelling': data['Identification number of the institution'],
      'Kaartnummer': data['Identification number of the card'],
      'Vervaldatum': data['Expiry date'],
      'Attestation Trust Type': data['Attestation Trust Type'],
      'Uitgegeven door': data.issuedBy,
      'Organisatie nummer uitgever': data.LEIDissuer,
      'Uitgegeven namens': data.issuedOnBehalfOf,
      'Organisatie nummer namens': data.LEIDonBehalf
    }
  });
  
  // Log deze actie als activiteit voor in de activiteitenlijst
  import('../activities.js').then(module => {
    module.logActivity(
      'EHIC pas ontvangen', 
      `EHIC pas ontvangen van ${data.issuedBy}`, 
      timestamp
    );
  });
}

/**
 * Toont het succes-scherm na het toevoegen van de EHIC kaart
 * @param {string} cardName - De naam van de kaart
 * @param {string} issuedBy - De uitgever van de kaart
 */
export function showEhicSuccessScreen(cardName, issuedBy) {
  // Maak de modal
  const ehic = createModal({ id: 'ehic-success-screen' });
  
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
  
  // Kaart tekst
  const cardText = document.createElement('p');
  cardText.innerHTML = '<strong>De Europese zorgverzekeringspas</strong>';
  cardText.style.color = '#00847c';
  cardText.style.fontSize = '16px';
  cardText.style.marginBottom = '10px';
  
  // Uitgever tekst
  const issuedByContainer = document.createElement('p');
  issuedByContainer.innerHTML = `uitgegeven door <strong style="color: #00847c;">${issuedBy}</strong>`;
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
  textContainer.appendChild(cardText);
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
  closeButton.style.margin = '10px auto'; // Zorg voor centreren door auto margins links en rechts
  
  // Sluiten knop click event
  closeButton.addEventListener('click', () => {
    document.body.removeChild(ehic);
    screenManager.showScreen('wallet', true);
  });
  
  // Voeg sluiten knop toe aan modal content
  modalContent.appendChild(closeButton);
  
  // Voeg content toe aan modal
  ehic.appendChild(modalContent);
  
  // Voeg modal toe aan body
  document.body.appendChild(ehic);
}