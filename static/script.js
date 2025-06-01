document.addEventListener('DOMContentLoaded', function() {
  const filterBtn = document.getElementById('filterBtn');
  const closeFilterBtn = document.getElementById('closeFilterBtn');
  const filterSidebar = document.getElementById('filterSidebar');
  const overlay = document.getElementById('overlay');
  
  // Function to check if we're on mobile
  function isMobile() {
    return window.innerWidth <= 768;
  }
  
  // Function to open filter sidebar
  function openFilterSidebar() {
    if (isMobile()) {
      filterSidebar.classList.add('active');
      overlay.style.display = 'block';
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
  }
  
  // Function to close filter sidebar
  function closeFilterSidebar() {
    if (isMobile()) {
      filterSidebar.classList.remove('active');
      overlay.style.display = 'none';
      document.body.style.overflow = ''; // Allow scrolling
    }
  }
  
  // Event listeners
  filterBtn.addEventListener('click', openFilterSidebar);
  closeFilterBtn.addEventListener('click', closeFilterSidebar);
  overlay.addEventListener('click', closeFilterSidebar);
  
  // Handle window resize
  window.addEventListener('resize', function() {
    if (!isMobile() && filterSidebar.classList.contains('active')) {
      closeFilterSidebar();
    }
  });
});