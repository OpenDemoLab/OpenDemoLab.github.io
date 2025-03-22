// activities.js - Functionaliteit voor activiteitenlijst
import { credentials } from './credentials.js';
import { convertToStandardDate } from './utils.js';

/**
 * Toont de activiteiten in de activiteitenlijst
 */
export function showActivities() {
  // Choose the correct list element based on the current DOM structure
  // This supports both the original HTML and new modal approach
  let activitiesList;
  
  // Try to find the activities list in the new modal first
  const activitiesModal = document.getElementById('activities-modal');
  if (activitiesModal) {
    activitiesList = activitiesModal.querySelector('#activities-list');
  } 
  
  // If not found, try to find it in the original HTML structure
  if (!activitiesList) {
    activitiesList = document.getElementById('activities-list');
  }
  
  // If we still don't have a list element, return early
  if (!activitiesList) {
    console.error('Activities list element not found');
    return;
  }
  
  // Clear the list
  activitiesList.innerHTML = '';

  // Filter credentials voor activiteiten (alleen deelacties en specifieke activiteiten)
  const filteredActivities = credentials.filter(cred => {
    if (!cred.actionTimestamp) return false;
    if (cred.isShareAction || cred.isActivity) return true;
    return false;
  });

  // Sorteer op datum (nieuwste eerst)
  filteredActivities.sort((a, b) => {
    let dateA = Date.parse(convertToStandardDate(a.actionTimestamp));
    let dateB = Date.parse(convertToStandardDate(b.actionTimestamp));
    return dateB - dateA;
  });

  // Voeg activiteiten toe aan de lijst
  filteredActivities.forEach((cred) => {
    let activityItem = document.createElement('li');
  
    if (cred.isShareAction) {
      activityItem.innerHTML = `
        <strong style="color: #152A62;">${cred.name}</strong><br>
        <span style="color: #152A62;">Gegevens gedeeld</span><br>
        <span style="color: #152A62;">${cred.actionTimestamp}</span>
      `;
    } else if (cred.isActivity) {
      activityItem.innerHTML = `
        <strong style="color: #152A62;">${cred.name}</strong><br>
        <span style="color: #152A62;">${cred.description || ''}</span><br>
        <span style="color: #152A62;">${cred.actionTimestamp}</span>
      `;
    }
  
    // Voeg een divider toe
    const divider = document.createElement('div');
    divider.className = 'activity-divider';
  
    activitiesList.appendChild(activityItem);
    activitiesList.appendChild(divider);
  });
}

/**
 * Log een activiteit naar de activiteitenlijst
 * @param {string} name - Naam van de activiteit
 * @param {string} description - Beschrijving van de activiteit
 * @param {string} timestamp - Tijdstempel van de activiteit
 */
export function logActivity(name, description, timestamp = new Date().toLocaleString()) {
  credentials.push({
    name: name,
    description: description,
    actionTimestamp: timestamp,
    isActivity: true
  });
  
  // Laad saveCredentials via dynamische import
  import('./credentials.js').then(module => {
    module.saveCredentials();
  });
}