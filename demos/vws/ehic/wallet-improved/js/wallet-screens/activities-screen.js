// activities-screen.js - Volledig gecorrigeerde versie
import { screenManager } from '../navigation.js';
import { showActivities } from '../activities.js';
import { createModal, createModalContent } from '../utils.js';

/**
 * Shows the activities screen as a modal
 */
export function showActivitiesScreen() {
  // Verwijder eerst eventuele bestaande modals met dezelfde ID
  const existingModal = document.getElementById('activities-modal');
  if (existingModal) {
    document.body.removeChild(existingModal);
  }
  
  // Create the modal container
  const activitiesModal = createModal({ id: 'activities-modal' });
  activitiesModal.style.padding = '5px';
  activitiesModal.style.overflowY = 'auto';
  
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
    document.body.removeChild(activitiesModal);
    
    // Show the wallet screen
    screenManager.showScreen('wallet', true);
    
    // Set the overview tab active
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.getElementById('overview-navbar-item').classList.add('active');
  });
  
  header.appendChild(backButton);
  activitiesModal.appendChild(header);
  
  // Create title section
  const title = document.createElement('h3');
  title.textContent = 'Activiteiten';
  title.style.marginTop = '60px';
  title.style.marginBottom = '20px';
  title.style.marginLeft = '20px';
  title.style.color = '#152A62';
  activitiesModal.appendChild(title);
  
  // Create title divider
  const titleDivider = document.createElement('div');
  titleDivider.className = 'title-divider';
  activitiesModal.appendChild(titleDivider);
  
  // Create activities list
  const activitiesList = document.createElement('ul');
  activitiesList.id = 'activities-list';
  activitiesList.style.listStyleType = 'none'; // Verwijder bulletpoints
  activitiesModal.appendChild(activitiesList);
  
  // Add the modal to the body
  document.body.appendChild(activitiesModal);
  
  // Gebruik requestAnimationFrame om te zorgen dat de DOM is bijgewerkt voordat we de showActivities aanroepen
  requestAnimationFrame(() => {
    showActivities();
  });
}