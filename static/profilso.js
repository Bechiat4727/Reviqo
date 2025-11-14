// DOM Elements
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const saveProfileBtn = document.getElementById('saveProfileBtn');
const confirmationModal = document.getElementById('confirmationModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const closeModalBtn = document.querySelector('.close-modal');

// File upload elements
const logoUpload = document.getElementById('logoUpload');
const logoPreview = document.getElementById('logoPreview');
const profilePhotoUpload = document.getElementById('profilePhotoUpload');
const profilePhotoPreview = document.getElementById('profilePhotoPreview');
const registerCommerceUpload = document.getElementById('registerCommerceUpload');
const registerCommercePreview = document.getElementById('registerCommercePreview');
const registerCommerceInfo = document.getElementById('registerCommerceInfo');
const taxIdUpload = document.getElementById('taxIdUpload');
const taxIdPreview = document.getElementById('taxIdPreview');
const taxIdInfo = document.getElementById('taxIdInfo');

// Opening hours elements
const dayStatusToggles = document.querySelectorAll('.day-status');
const openTimeInputs = document.querySelectorAll('.open-time');
const closeTimeInputs = document.querySelectorAll('.close-time');

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
      
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Show corresponding content
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId) {
          content.classList.add('active');
          // Initialize map when location tab is selected
          if (tabId === 'location') {
            setTimeout(initializeMap, 100);
          }
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
  setupDocumentUpload(registerCommerceUpload, registerCommercePreview, registerCommerceInfo);
  setupDocumentUpload(taxIdUpload, taxIdPreview, taxIdInfo);
  
  // Opening hours toggles
  dayStatusToggles.forEach(toggle => {
    toggle.addEventListener('change', updateOpeningHoursStatus);
  });
  
  // Initialize opening hours status
  dayStatusToggles.forEach(updateOpeningHoursStatus);
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

// Set up document upload
function setupDocumentUpload(inputElement, previewElement, infoElement) {
  // Click on preview to trigger file input
  previewElement.addEventListener('click', () => {
    inputElement.click();
  });
  
  // Handle file selection
  inputElement.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      // Update preview based on file type
      previewElement.innerHTML = '';
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          previewElement.style.backgroundImage = `url(${event.target.result})`;
          previewElement.style.backgroundSize = 'cover';
          previewElement.style.backgroundPosition = 'center';
        };
        
        reader.readAsDataURL(file);
      } else {
        // For non-image files (like PDFs)
        const icon = document.createElement('i');
        icon.className = 'fas fa-file-pdf';
        icon.style.fontSize = '40px';
        icon.style.color = '#e74c3c';
        
        const fileName = document.createElement('span');
        fileName.textContent = file.name;
        fileName.style.marginTop = '10px';
        
        previewElement.appendChild(icon);
        previewElement.appendChild(fileName);
        previewElement.style.backgroundImage = 'none';
      }
      
      // Update info text
      infoElement.textContent = `File: ${file.name} (${formatFileSize(file.size)})`;
      infoElement.style.color = '#4CAF50';
    }
  });
  
  // Drag and drop functionality
  previewElement.addEventListener('dragover', (e) => {
    e.preventDefault();
    previewElement.style.borderColor = '#ff8144';
    previewElement.style.backgroundColor = 'rgba(255, 129, 68, 0.1)';
  });
  
  previewElement.addEventListener('dragleave', (e) => {
    e.preventDefault();
    previewElement.style.borderColor = '#ddd';
    previewElement.style.backgroundColor = 'transparent';
  });
  
  previewElement.addEventListener('drop', (e) => {
    e.preventDefault();
    previewElement.style.borderColor = '#ddd';
    previewElement.style.backgroundColor = 'transparent';
    
    const file = e.dataTransfer.files[0];
    if (file) {
      // Manually set the file to the input element
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      inputElement.files = dataTransfer.files;
      
      // Trigger change event
      const event = new Event('change', { bubbles: true });
      inputElement.dispatchEvent(event);
    }
  });
}

// Format file size
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
}

// Update opening hours status
function updateOpeningHoursStatus() {
  const day = this.getAttribute('data-day');
  const isOpen = this.checked;
  const statusLabel = this.parentElement.nextElementSibling;
  const timeInputs = document.querySelectorAll(`.time-input[data-day="${day}"]`);
  
  // Update status label
  statusLabel.textContent = isOpen ? 'Open' : 'Closed';
  
  // Enable/disable time inputs
  timeInputs.forEach(input => {
    input.disabled = !isOpen;
  });
}

// Handle location data
function handleLocationData() {
    const address = document.getElementById('address').value || '';
    const city = document.getElementById('city').value || '';
    const country = document.getElementById('country').value || '';
    const latitude = document.getElementById('latitude').value || null;
    const longitude = document.getElementById('longitude').value || null;

    return {
        address: [address, city, country].filter(Boolean).join(', '),
        latitude: latitude,
        longitude: longitude
    };
}

// Save profile
function saveProfile() {
    try {
        // Collect opening days/hours as arrays/JSON
        let opening_days = [];
        let opening_hours = [];
        let closing_hours = [];
        
        document.querySelectorAll('.day-row').forEach(row => {
            const day = row.querySelector('.day-name').textContent.trim();
            const isOpen = row.querySelector('.day-status').checked;
            const openTime = row.querySelector('.open-time').value || '09:00';
            const closeTime = row.querySelector('.close-time').value || '17:00';
            
            opening_days.push({day: day, open: isOpen});
            opening_hours.push(openTime);
            closing_hours.push(closeTime);
        });

        // Get location data
        const locationData = handleLocationData();

        // Create the data object
        const formData = {
            email: document.getElementById('contactEmail').value,
            firstName: document.getElementById('shopName').value,
            description: document.getElementById('shopDescription').value || '',
            category: document.getElementById('shopCategory').value,
            location: locationData,
            opening_days: JSON.stringify(opening_days),
            opening_hours: JSON.stringify(opening_hours),
            closing_hours: JSON.stringify(closing_hours)
        };

        // Send data to backend
        fetch('/save_restaurant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                showModal();
            } else {
                alert(data.message || 'Failed to save profile');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to save profile: ' + error.message);
        });
    } catch (error) {
        console.error('Error in saveProfile:', error);
        alert('An error occurred while saving the profile');
    }
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

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', init);