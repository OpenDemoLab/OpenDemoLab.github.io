// utils.js - Algemene hulpfuncties en constanten

/**
 * Maakt een scheidingslijn element
 * @returns {HTMLElement} - Het scheidingslijn element
 */
export function createDivider() {
    const divider = document.createElement('div');
    divider.className = 'divider';
    divider.style.width = '100%';
    divider.style.height = '1px';
    divider.style.backgroundColor = 'lightgrey';
    divider.style.margin = '10px 0';
    return divider;
  }
  
  /**
   * Converteert een datum formaat van 'dd-mm-yyyy, HH:MM:SS' naar 'yyyy-mm-ddTHH:MM:SS'
   * @param {string} dateString - De te converteren datum string
   * @returns {string} - De geconverteerde datum string
   */
  export function convertToStandardDate(dateString) {
    if (!dateString) return '';
    let [datePart, timePart] = dateString.split(', ');
    let [day, month, year] = datePart.split('-').map(part => part.padStart(2, '0'));
    return `${year}-${month}-${day}T${timePart}`;
  }
  
  /**
   * Reset alle PIN invoervelden
   */
  export function resetPinInputs() {
    const pinInputs = document.querySelectorAll('.pin-box');
    pinInputs.forEach((input) => {
      input.value = '';
    });
  }
  
  /**
   * Veldmapping voor weergavebehoeftes
   */
  export const fieldMapping = {
    gn: 'Voornaam',
    vl: 'Voorletter(s)',
    sn: 'Achternaam',
    bd: 'Geboortedatum',
    bsn: 'Burgerservicenummer (BSN)',
    omv: 'Organisatiemachtiging VOG',
    vog: 'Verklaring Omtrent Gedrag (VOG)',
    VOG: 'Verklaring Omtrent Gedrag (VOG)',
    nat: 'Nationaliteit',
    val: 'Geldigheid paspoort',
    ph: 'Foto',   
    issuedBy: 'Uitgegeven door',
    LEID: 'Organisatie nummer',
    Issued_Date: 'Uitgiftedatum',
    a: {
      '12t': 'Opslag: 12 maanden, gedeeld met derden: nee',
      '60t': 'Opslag: 60 maanden, gedeeld met derden: nee',
      'w': 'Bewaarplicht en datadeling met derden volgens wettelijke richtlijnen'
    }
  };
  
  /**
   * Kaartstijlen mapping
   */
  export const cardStyles = {
    'persoonlijke data': {
      imagePath: '/demo/bdlogo.svg',
      iconColor: null,
      textColor: '#4A6C85'
    },
    'woonadres': {
      imagePath: '/demo/bdlogo.svg',
      iconColor: null,
      textColor: '#4A6C85'
    },
    'foto': {
      imagePath: '/demo/bdlogo.svg',
      iconColor: null,
      textColor: '#4A6C85'
    },
    'ehic pas': {
      imagePath: '/demo/ehic-icon.svg',
      iconColor: null,
      textColor: '#00847c'
    }
  };
  
  /**
   * Maakt een kaart container voor een flipbare kaart
   * @returns {HTMLElement} - Het kaart container element
   */
  export function createFlipCardContainer() {
    // Container voor de flipbare kaart
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-flip-container';
    cardContainer.style.width = '100%';
    cardContainer.style.height = '200px';
    cardContainer.style.perspective = '1000px';
    cardContainer.style.marginBottom = '20px';
    cardContainer.style.cursor = 'pointer';
    
    // Inner container voor de flipbare kaart
    const cardFlipInner = document.createElement('div');
    cardFlipInner.className = 'card-flip-inner';
    cardFlipInner.style.position = 'relative';
    cardFlipInner.style.width = '100%';
    cardFlipInner.style.height = '100%';
    cardFlipInner.style.textAlign = 'center';
    cardFlipInner.style.transition = 'transform 0.8s';
    cardFlipInner.style.transformStyle = 'preserve-3d';
    
    // Voorkant van de kaart
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
    
    // Voeg de afbeelding voor de voorkant toe
    const frontImage = document.createElement('img');
    frontImage.src = '../base/images/ehic-front.png';
    frontImage.alt = 'EHIC Card Front';
    frontImage.style.maxWidth = '100%';
    frontImage.style.maxHeight = '100%';
    frontImage.style.borderRadius = '8px';
    cardFront.appendChild(frontImage);
    
    // Achterkant van de kaart
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
    
    // Voeg de afbeelding voor de achterkant toe
    const backImage = document.createElement('img');
    backImage.src = '../base/images/ehic-back.png';
    backImage.alt = 'EHIC Card Back';
    backImage.style.maxWidth = '100%';
    backImage.style.maxHeight = '100%';
    backImage.style.borderRadius = '8px';
    cardBack.appendChild(backImage);
    
    // Voeg flip functionaliteit toe
    cardContainer.addEventListener('click', () => {
      if (cardFlipInner.style.transform === 'rotateY(180deg)') {
        cardFlipInner.style.transform = 'rotateY(0deg)';
      } else {
        cardFlipInner.style.transform = 'rotateY(180deg)';
      }
    });
    
    // Zet de elementen in elkaar
    cardFlipInner.appendChild(cardFront);
    cardFlipInner.appendChild(cardBack);
    cardContainer.appendChild(cardFlipInner);
    
    return cardContainer;
  }
  
  /**
   * Maakt een accordion element voor technische details
   * @param {Object} data - De data om in het accordion te tonen
   * @returns {HTMLElement} - Het accordion element
   */
  export function createTechnicalDetailsAccordion(data) {
    // Accordion container
    const accordion = document.createElement('div');
    accordion.className = 'accordion';
    accordion.style.width = '100%';
    accordion.style.marginBottom = '20px';
    
    // Accordion knop
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
    
    // Plus/min indicator
    const indicator = document.createElement('span');
    indicator.innerHTML = '+';
    indicator.style.position = 'absolute';
    indicator.style.right = '15px';
    indicator.style.fontSize = '20px';
    accordionBtn.appendChild(indicator);
    
    // Accordion panel
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
    
    // Details content
    const details = document.createElement('div');
    details.style.padding = '10px 0';
    
    // Velden die we uitsluiten
    const excludedKeys = ['rdfci', 'isShareAction', 'actionTimestamp'];
    
    // Maak een rij voor elk veld
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
    
    // Voeg eerst top-level eigenschappen toe
    if (data.name) addDetailRow('name', data.name);
    if (data.issuedBy) addDetailRow('issuedBy', data.issuedBy);
    if (data.LEID) addDetailRow('LEID', data.LEID);
    
    // Voeg dan alle data-eigenschappen toe
    if (data.data) {
      for (let key in data.data) {
        if (!excludedKeys.includes(key)) {
          addDetailRow(key, data.data[key]);
        }
      }
    } else {
      // Als er geen data-object is, voeg alle eigenschappen toe behalve uitgesloten
      for (let key in data) {
        if (!excludedKeys.includes(key) && key !== 'name' && key !== 'issuedBy' && key !== 'LEID') {
          addDetailRow(key, data[key]);
        }
      }
    }
    
    panel.appendChild(details);
    
    // Voeg accordion toggle functionaliteit toe
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
    
    return accordion;
  }
  
  /**
   * Creëert een modal container element
   * @param {Object} options - Opties voor de modal
   * @returns {HTMLElement} - Het modal element
   */
  export function createModal(options = {}) {
    const { id, className = 'modal' } = options;
    
    const modal = document.createElement('div');
    modal.id = id || 'custom-modal-' + Math.random().toString(36).substr(2, 9);
    modal.className = className;
    
    // Basisstijlen
    modal.style.display = 'flex';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'white';
    modal.style.zIndex = '1000';
    modal.style.flexDirection = 'column';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'flex-start';
    modal.style.padding = '0px';
    modal.style.boxSizing = 'border-box';
    modal.style.overflowY = 'auto';
    
    return modal;
  }
  
  /**
   * Creëert een modal content container
   * @returns {HTMLElement} - Het modal content element
   */
  export function createModalContent() {
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // Basisstijlen
    modalContent.style.backgroundColor = 'white';
    modalContent.style.padding = '5px';
    modalContent.style.width = '100%';
    modalContent.style.maxWidth = '400px';
    modalContent.style.display = 'flex';
    modalContent.style.flexDirection = 'column';
    modalContent.style.marginTop = '20px';
    
    return modalContent;
  }
  
  /**
   * Creëert een knoppencontainer voor modals
   * @returns {HTMLElement} - De knoppencontainer
   */
  export function createButtonContainer() {
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-between';
    buttonContainer.style.width = '100%';
    buttonContainer.style.marginTop = '20px';
    
    return buttonContainer;
  }