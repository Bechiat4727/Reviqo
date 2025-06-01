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

// Save profile
function saveProfile() {
  // Validate required fields
  const shopName = document.getElementById('shopName').value;
  const shopCategory = document.getElementById('shopCategory').value;
  const registerCommerceFile = document.getElementById('registerCommerceUpload').files[0];
  
  if (!shopName) {
    alert('Please enter your shop name');
    return;
  }
  
  if (!shopCategory) {
    alert('Please select a category');
    return;
  }
  
  if (!registerCommerceFile) {
    alert('Please upload your business registration document');
    return;
  }
  
  // Collect form data
  const formData = {
    shopName,
    shopCategory,
    description: document.getElementById('shopDescription').value,
    contactPhone: document.getElementById('contactPhone').value,
    contactEmail: document.getElementById('contactEmail').value,
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    postalCode: document.getElementById('postalCode').value,
    country: document.getElementById('country').value,
    openingHours: getOpeningHours()
  };
  
  // In a real application, you would send this data to your server
  console.log('Form data:', formData);
  
  // Show confirmation modal
  showModal();
}

// Get opening hours data
function getOpeningHours() {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const openingHours = {};
  
  days.forEach(day => {
    const statusToggle = document.querySelector(`.day-status[data-day="${day}"]`);
    const openTime = document.querySelector(`.open-time[data-day="${day}"]`);
    const closeTime = document.querySelector(`.close-time[data-day="${day}"]`);
    
    openingHours[day] = {
      isOpen: statusToggle.checked,
      openTime: openTime.value,
      closeTime: closeTime.value
    };
  });
  
  return openingHours;
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

document.getElementById('saveProfileBtn').addEventListener('click', function(e) {
    e.preventDefault();

    // Collect opening days/hours as arrays/JSON
    let opening_days = [];
    let opening_hours = [];
    let closing_hours = [];
    document.querySelectorAll('.day-row').forEach(row => {
        const day = row.querySelector('.day-name').textContent.trim();
        const isOpen = row.querySelector('.day-status').checked;
        opening_days.push({day: day, open: isOpen});
        opening_hours.push(row.querySelector('.open-time').value);
        closing_hours.push(row.querySelector('.close-time').value);
    });

    // Combine address fields for emplacement
    const emplacement = 
        document.getElementById('address').value + ', ' +
        document.getElementById('city').value + ', ' +
        document.getElementById('country').value;

    // Prepare data
    const data = new FormData();
    data.append('email', document.getElementById('contactEmail').value); // Shopowner email
    data.append('nom', document.getElementById('shopName').value); // Restaurant name
    data.append('emplacement', emplacement);
    data.append('note', null);
    data.append('id_avis', ''); // Optional: set as needed
    data.append('opening_days', JSON.stringify(opening_days));
    data.append('opening_hours', JSON.stringify(opening_hours));
    data.append('closing_hours', JSON.stringify(closing_hours));
    data.append('description', document.getElementById('shopDescription').value);

    fetch('/save_restaurant', {
        method: 'POST',
        body: data
    })
    .then(response => response.text())
    .then(result => {
        if(result === "success") {
            document.getElementById('confirmationModal').style.display = 'block';
        } else {
            alert("Error: " + result);
        }
    });
});

// Modal close logic
document.getElementById('modalCloseBtn').onclick = function() {
    document.getElementById('confirmationModal').style.display = 'none';
};
document.querySelector('.close-modal').onclick = function() {
    document.getElementById('confirmationModal').style.display = 'none';
};