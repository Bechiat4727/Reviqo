// DOM Elements
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const saveProfileBtn = document.getElementById('saveProfileBtn');
const confirmationModal = document.getElementById('confirmationModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const closeModalBtn = document.querySelector('.close-modal');
const themeOptions = document.querySelectorAll('.theme-option');
const ratingNumbers = document.querySelectorAll('.rating-number');

// File upload elements
const logoUpload = document.getElementById('logoUpload');
const logoPreview = document.getElementById('logoPreview');
const profilePhotoUpload = document.getElementById('profilePhotoUpload');
const profilePhotoPreview = document.getElementById('profilePhotoPreview');

// Initialize the page
function init() {
  setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
  // Tab navigation
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.getAttribute('data-tab');
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId) {
          content.classList.add('active');
        }
      });
    });
  });
  
  // Save profile button
  saveProfileBtn.addEventListener('click', saveProfile);
  
  // Modal close buttons
  modalCloseBtn.addEventListener('click', closeModal);
  closeModalBtn.addEventListener('click', closeModal);
  
  // File uploads
  setupFileUpload(logoUpload, logoPreview);
  setupFileUpload(profilePhotoUpload, profilePhotoPreview);
  
  // Theme options
  themeOptions.forEach(option => {
    option.addEventListener('click', () => {
      themeOptions.forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
    });
  });
  
  // Rating selection
  ratingNumbers.forEach(number => {
    number.addEventListener('click', () => {
      ratingNumbers.forEach(num => num.classList.remove('selected'));
      number.classList.add('selected');
    });
  });
}

// Set up file upload for images
function setupFileUpload(inputElement, previewElement) {
  // Click on preview to trigger file input
  previewElement.addEventListener('click', () => {
    inputElement.click();
  });
  
  // Handle file selection
  inputElement.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        previewElement.innerHTML = '';
        previewElement.style.backgroundImage = `url(${event.target.result})`;
        previewElement.style.backgroundSize = 'cover';
        previewElement.style.backgroundPosition = 'center';
      };
      
      reader.readAsDataURL(file);
    }
  });
}

// Save profile
function saveProfile() {
  // Validate required fields
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  
  if (!firstName) {
    alert('Please enter your first name');
    return;
  }
  
  if (!lastName) {
    alert('Please enter your last name');
    return;
  }
  
  if (!email) {
    alert('Please enter your email address');
    return;
  }
  
  // Collect form data
  const formData = {
    firstName,
    lastName,
    email,
    phone: document.getElementById('phone').value,
    birthdate: document.getElementById('birthdate').value,
    gender: document.getElementById('gender').value,
    language: document.getElementById('language').value,
    notifications: {
      email: document.getElementById('emailNotifications').checked,
      sms: document.getElementById('smsNotifications').checked,
      push: document.getElementById('pushNotifications').checked
    },
    theme: document.querySelector('.theme-option.active').getAttribute('data-theme'),
    impressions: getSelectedImpressions(),
    feedback: document.getElementById('feedbackComments').value,
    rating: getSelectedRating(),
    opening_days: document.getElementById('opening_days').value,
    opening_hours: document.getElementById('opening_hours').value,
    closing_hours: document.getElementById('closing_hours').value
  };
  
  // In a real application, you would send this data to your server
  console.log('Form data:', formData);
  
  // Show confirmation modal
  showModal();
}
setupFileUpload(profilePhotoUpload, profilePhotoPreview);

// Get selected impressions
function getSelectedImpressions() {
  const checkboxes = document.querySelectorAll('input[name="impression"]:checked');
  return Array.from(checkboxes).map(checkbox => checkbox.value);
}

// Get selected rating
function getSelectedRating() {
  const selectedRating = document.querySelector('.rating-number.selected');
  return selectedRating ? selectedRating.getAttribute('data-value') : null;
}

// Show confirmation modal
function showModal() {
  confirmationModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close confirmation modal
function closeModal() {
  confirmationModal.classList.remove('active');
  document.body.style.overflow = '';
}

// Tab switching logic
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', function() {
    // Remove active from all tabs and contents
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
    // Add active to clicked tab and its content
    this.classList.add('active');
    const tabId = this.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');
  });
});

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', init);