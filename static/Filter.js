// Sample data for establishments
let establishments = [];

function init() {
  fetch('/api/restaurants')
    .then(response => response.json())
    .then(data => {
      establishments = data.restaurants;
      renderItems(filterItems());
      setupEventListeners();
    });
}

// DOM Elements
const filterSidebar = document.getElementById('filterSidebar');
const filterBtn = document.getElementById('filterBtn');
const closeFilterBtn = document.getElementById('closeFilterBtn');
const overlay = document.getElementById('overlay');
const itemsGrid = document.getElementById('itemsGrid');
const noResults = document.getElementById('noResults');
const searchInput = document.getElementById('searchInput');
const categoryTabs = document.querySelectorAll('.tab');
const applyFiltersBtn = document.getElementById('applyFilters');
const resetFiltersBtn = document.getElementById('resetFilters');
const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
const ratingCheckboxes = document.querySelectorAll('input[name="rating"]');
const nearbyToggle = document.getElementById('nearbyToggle');

// Current filter state
let currentFilters = {
  categories: Array.from(categoryCheckboxes).map(cb => cb.value),
  ratings: Array.from(ratingCheckboxes).map(cb => parseInt(cb.value)),
  nearby: false,
  searchTerm: '',
  activeTab: 'all'
};

// Initialize the page
function init() {
  renderItems(filterItems());
  setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
  // Mobile filter toggle
  filterBtn.addEventListener('click', () => {
    filterSidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  closeFilterBtn.addEventListener('click', closeFilterSidebar);
  overlay.addEventListener('click', closeFilterSidebar);

  // Search input
  searchInput.addEventListener('input', debounce(() => {
    currentFilters.searchTerm = searchInput.value.trim().toLowerCase();
    renderItems(filterItems());
  }, 300));

  // Category tabs
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilters.activeTab = tab.dataset.category;
      renderItems(filterItems());
    });
  });

  // Apply filters button
  applyFiltersBtn.addEventListener('click', () => {
    // Update filter state from checkboxes
    currentFilters.categories = Array.from(categoryCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);
    
    currentFilters.ratings = Array.from(ratingCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => parseInt(cb.value));
    
    currentFilters.nearby = nearbyToggle.checked;
    
    renderItems(filterItems());
    
    if (window.innerWidth <= 768) {
      closeFilterSidebar();
    }
  });

  // Reset filters button
  resetFiltersBtn.addEventListener('click', () => {
    // Reset all checkboxes to checked
    categoryCheckboxes.forEach(cb => cb.checked = true);
    ratingCheckboxes.forEach(cb => cb.checked = true);
    nearbyToggle.checked = false;
    
    // Reset filter state
    currentFilters = {
      categories: Array.from(categoryCheckboxes).map(cb => cb.value),
      ratings: Array.from(ratingCheckboxes).map(cb => parseInt(cb.value)),
      nearby: false,
      searchTerm: searchInput.value.trim().toLowerCase(),
      activeTab: currentFilters.activeTab
    };
    
    renderItems(filterItems());
  });
}

// Close the filter sidebar (mobile)
function closeFilterSidebar() {
  filterSidebar.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Filter items based on current filters
function filterItems() {
  return establishments.filter(item => {
    // Filter by search term
    if (currentFilters.searchTerm && !item.name.toLowerCase().includes(currentFilters.searchTerm) && 
        !item.category.toLowerCase().includes(currentFilters.searchTerm)) {
      return false;
    }
    
    // Filter by active tab
    if (currentFilters.activeTab !== 'all' && currentFilters.activeTab !== 'more') {
      if (item.category !== currentFilters.activeTab) {
        return false;
      }
    } else if (currentFilters.activeTab === 'more') {
      // "More" tab shows categories not in the main tabs
      const mainCategories = Array.from(categoryTabs)
        .filter(tab => tab.dataset.category !== 'all' && tab.dataset.category !== 'more')
        .map(tab => tab.dataset.category);
      
      if (mainCategories.includes(item.category)) {
        return false;
      }
    }
    
    // Filter by selected categories
    if (!currentFilters.categories.includes(item.category)) {
      return false;
    }
    
    // Filter by rating
    let ratingMatch = false;
    for (const rating of currentFilters.ratings) {
      if (rating === 5 && item.rating === 5) {
        ratingMatch = true;
        break;
      } else if (rating === 4 && item.rating === 4) {
        ratingMatch = true;
        break;
      } else if (rating === 3 && item.rating < 4) {
        ratingMatch = true;
        break;
      }
    }
    
    if (!ratingMatch) {
      return false;
    }
    
    // For demonstration, we'll assume nearby is just another filter
    // In a real app, this would use geolocation
    if (currentFilters.nearby) {
      // Simulate nearby filter (even IDs are "nearby")
      return item.id % 2 === 0;
    }
    
    return true;
  });
}

// Render filtered items to the grid
function renderItems(items) {
  itemsGrid.innerHTML = '';
  
  if (items.length === 0) {
    noResults.style.display = 'block';
    itemsGrid.style.display = 'none';
    return;
  }
  
  noResults.style.display = 'none';
  itemsGrid.style.display = 'grid';
  
  items.forEach((item, index) => {
    const itemElement = document.createElement('div');
    itemElement.className = 'grid-item';
    itemElement.style.animationDelay = `${index * 0.05}s`;
    itemElement.dataset.id = item.id;
    
    // Generate star rating HTML
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= item.rating) {
        starsHtml += '<i class="fas fa-star"></i>';
      } else {
        starsHtml += '<i class="far fa-star"></i>';
      }
    }
    
    itemElement.innerHTML = `
      <div class="item-image" style="background-image: url('${item.image}')"></div>
      <div class="item-content">
        <span class="item-category">${item.category}</span>
        <h3 class="item-title">${item.name}</h3>
        <div class="item-rating">${starsHtml}</div>
        <div class="item-address">
          <i class="fas fa-map-marker-alt"></i>
          ${item.address}
        </div>
      </div>
    `;
    
    // Make the item clickable
    itemElement.addEventListener('click', () => {
      handleItemClick(item);
    });
    
    itemsGrid.appendChild(itemElement);
  });
}

// Handle item click
function handleItemClick(item) {
  // Create modal for item details
  const modal = document.createElement('div');
  modal.className = 'item-modal';
  
  // Generate star rating HTML
  let starsHtml = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= item.rating) {
      starsHtml += '<i class="fas fa-star"></i>';
    } else {
      starsHtml += '<i class="far fa-star"></i>';
    }
  }
  
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>${item.name}</h2>
        <button class="close-modal-btn">&times;</button>
      </div>
      <div class="modal-image" style="background-image: url('${item.image}')"></div>
      <div class="modal-body">
        <div class="modal-category-rating">
          <span class="modal-category">${item.category}</span>
          <div class="modal-rating">${starsHtml}</div>
        </div>
        <div class="modal-address">
          <i class="fas fa-map-marker-alt"></i> ${item.address}
        </div>
        <p class="modal-description">${item.description}</p>
      </div>
      <div class="modal-footer">
        <button class="filter-by-category-btn">Show all ${item.category}</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Prevent body scrolling when modal is open
  document.body.style.overflow = 'hidden';
  
  // Add animation class after a small delay to trigger animation
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  // Close modal when clicking the close button
  const closeBtn = modal.querySelector('.close-modal-btn');
  closeBtn.addEventListener('click', () => {
    closeModal(modal);
  });
  
  // Close modal when clicking outside the content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
  
  // Filter by this category when clicking the filter button
  const filterBtn = modal.querySelector('.filter-by-category-btn');
  filterBtn.addEventListener('click', () => {
    // Set only this category as checked
    categoryCheckboxes.forEach(cb => {
      cb.checked = cb.value === item.category;
    });
    
    // Update filter state
    currentFilters.categories = [item.category];
    
    // Find and activate the corresponding tab if it exists
    const categoryTab = Array.from(categoryTabs).find(tab => tab.dataset.category === item.category);
    if (categoryTab) {
      categoryTabs.forEach(tab => tab.classList.remove('active'));
      categoryTab.classList.add('active');
      currentFilters.activeTab = item.category;
    } else {
      // If no specific tab, set to "all" and let the category filter work
      categoryTabs.forEach(tab => tab.classList.remove('active'));
      const allTab = Array.from(categoryTabs).find(tab => tab.dataset.category === 'all');
      if (allTab) allTab.classList.add('active');
      currentFilters.activeTab = 'all';
    }
    
    // Render filtered items
    renderItems(filterItems());
    
    // Close the modal
    closeModal(modal);
  });
}

// Close modal function
function closeModal(modal) {
  modal.classList.remove('active');
  setTimeout(() => {
    document.body.removeChild(modal);
    document.body.style.overflow = '';
  }, 300); // Match the CSS transition time
}

// Debounce function for search input
function debounce(func, delay) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

let restaurants = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', function() {
    fetchRestaurants();
    setupEventListeners();
});

function fetchRestaurants() {
    fetch('/api/restaurants')
        .then(response => response.json())
        .then(data => {
            restaurants = data.restaurants;
            displayRestaurants(restaurants);
        })
        .catch(error => console.error('Error:', error));
}

function displayRestaurants(restaurantsToShow) {
    const grid = document.getElementById('itemsGrid'); // Change to use itemsGrid instead of restaurantsGrid
    const noResults = document.getElementById('noResults');
    
    grid.innerHTML = '';

    if (!restaurantsToShow || restaurantsToShow.length === 0) {
        noResults.style.display = 'block';
        grid.style.display = 'none';
    } else {
        noResults.style.display = 'none';
        grid.style.display = 'grid';
        
        restaurantsToShow.forEach(restaurant => {
            const card = createRestaurantCard(restaurant);
            grid.appendChild(card);
        });
    }
}

function createRestaurantCard(restaurant) {
    const card = document.createElement('div');
    card.className = 'restaurant-card';
    card.style.cursor = 'pointer';
    
    // Create small map preview
    const mapPreview = `https://maps.googleapis.com/maps/api/staticmap?center=${restaurant.latitude},${restaurant.longitude}&zoom=15&size=150x150&markers=color:red%7C${restaurant.latitude},${restaurant.longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`;
    
    card.innerHTML = `
        <div class="card-image">
            <img src="${restaurant.image || 'default-restaurant-image.jpg'}" alt="${restaurant.name}">
        </div>
        <div class="card-content">
            <h3>${restaurant.name}</h3>
            <p class="address">
                <i class="fas fa-map-marker-alt"></i> ${restaurant.address}
            </p>
            <div class="location-preview">
                <img src="${mapPreview}" alt="Location map">
            </div>
            <p class="category">${restaurant.category || 'Restaurant'}</p>
            <div class="rating">Rating: ${restaurant.rating || 'N/A'}</div>
        </div>
    `;

    card.addEventListener('click', () => {
        const params = new URLSearchParams({
            id: restaurant.id,
            name: restaurant.name,
            address: restaurant.address,
            rating: restaurant.rating || '',
            category: restaurant.category || '',
            image: restaurant.image || '',
            latitude: restaurant.latitude,
            longitude: restaurant.longitude
        });
        
        window.location.href = `/static/magasin.html?${params.toString()}`;
    });

    return card;
}

function setupEventListeners() {
    // Category tabs
    document.querySelectorAll('.category-tabs .tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;
            currentFilter = category;
            
            // Update active tab
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Filter restaurants
            const filtered = category === 'all' 
                ? restaurants 
                : restaurants.filter(r => r.category === category);
            displayRestaurants(filtered);
        });
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = restaurants.filter(restaurant => 
                restaurant.name.toLowerCase().includes(searchTerm) ||
                restaurant.address.toLowerCase().includes(searchTerm)
            );
            displayRestaurants(filtered);
        });
    }
}

