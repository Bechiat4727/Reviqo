// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
  // Navigation and tabs
  const menuItems = document.querySelectorAll('.menu-item');
  const tabContents = document.querySelectorAll('.tab-content');
  const dateBtns = document.querySelectorAll('.date-btn');
  const replyBtns = document.querySelectorAll('.reply-btn');
  const cancelBtns = document.querySelectorAll('.cancel-reply');
  const messageFilters = document.querySelectorAll('.message-filter');
  const conversations = document.querySelectorAll('.conversation');
  
  // Payment and plans
  const planBtns = document.querySelectorAll('.plan-btn.select');
  const paymentModal = document.getElementById('paymentModal');
  const closeModal = document.querySelector('.close-modal');
  const cancelPayment = document.getElementById('cancelPayment');
  const proceedPayment = document.getElementById('proceedPayment');
  const paymentMethods = document.querySelectorAll('.payment-method');
  const selectedPlanName = document.getElementById('selectedPlanName');
  const selectedPlanPrice = document.getElementById('selectedPlanPrice');

  // Initialize the dashboard
  initDashboard();

  function initDashboard() {
    setupEventListeners();
    initCharts();
  }

  // Set up event listeners
  function setupEventListeners() {
    // Tab navigation
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        const tabId = item.getAttribute('data-tab');
        
        // Update active menu item
        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        // Show corresponding tab content
        tabContents.forEach(content => {
          content.classList.remove('active');
          if (content.id === tabId) {
            content.classList.add('active');
          }
        });
      });
    });
    
    // Date selector
    dateBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        dateBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // In a real app, this would update the chart data based on the selected date range
        updateChartsForDateRange(btn.textContent.toLowerCase());
      });
    });
    
    // Reply buttons for reviews
    replyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const replyForm = btn.nextElementSibling;
        replyForm.classList.toggle('hidden');
        btn.classList.add('hidden');
      });
    });
    
    // Cancel reply buttons
    cancelBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const replyForm = btn.closest('.review-reply-form');
        const replyBtn = replyForm.previousElementSibling;
        
        replyForm.classList.add('hidden');
        replyBtn.classList.remove('hidden');
      });
    });
    
    // Message filters
    messageFilters.forEach(filter => {
      filter.addEventListener('click', () => {
        messageFilters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
        
        // In a real app, this would filter the messages based on the selected filter
      });
    });
    
    // Conversations
    conversations.forEach(conversation => {
      conversation.addEventListener('click', () => {
        conversations.forEach(c => c.classList.remove('active'));
        conversation.classList.add('active');
        
        // In a real app, this would load the selected conversation
      });
    });
    
    // Plan selection
    planBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const plan = btn.getAttribute('data-plan');
        showPaymentModal(plan);
      });
    });
    
    // Payment modal
    closeModal.addEventListener('click', closePaymentModal);
    cancelPayment.addEventListener('click', closePaymentModal);
    
    // Payment method selection
    paymentMethods.forEach(method => {
      method.addEventListener('click', () => {
        paymentMethods.forEach(m => m.classList.remove('selected'));
        method.classList.add('selected');
        proceedPayment.disabled = false;
      });
    });
    
    // Proceed to payment
    proceedPayment.addEventListener('click', () => {
      const selectedMethod = document.querySelector('.payment-method.selected');
      if (selectedMethod) {
        const method = selectedMethod.getAttribute('data-method');
        navigateToPayment(method);
      }
    });
    
    // Send message button
    const sendBtn = document.querySelector('.send-btn');
    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        const messageInput = document.querySelector('.message-input textarea');
        if (messageInput.value.trim() !== '') {
          sendMessage(messageInput.value);
          messageInput.value = '';
        }
      });
    }
  }

  // Initialize charts
  function initCharts() {
    if (typeof Chart === 'undefined') {
      console.error('Chart.js is not loaded');
      return;
    }
    
    // Visitors Chart
    const visitorsCtx = document.getElementById('visitorsChart');
    if (visitorsCtx) {
      new Chart(visitorsCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Visitors',
            data: [1200, 1900, 1500, 2000, 2500, 2800, 3000, 3200, 3500, 3800, 4000, 4200],
            backgroundColor: 'rgba(255, 129, 68, 0.2)',
            borderColor: '#ff8144',
            borderWidth: 2,
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }
    
    // Reviews Chart
    const reviewsCtx = document.getElementById('reviewsChart');
    if (reviewsCtx) {
      new Chart(reviewsCtx, {
        type: 'bar',
        data: {
          labels: ['5★', '4★', '3★', '2★', '1★'],
          datasets: [{
            label: 'Reviews',
            data: [75, 20, 3, 1, 1],
            backgroundColor: '#ff8144',
            borderRadius: 5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }
    
    // Demographics Chart
    const demographicsCtx = document.getElementById('demographicsChart');
    if (demographicsCtx) {
      new Chart(demographicsCtx, {
        type: 'pie',
        data: {
          labels: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
          datasets: [{
            data: [15, 30, 25, 18, 8, 4],
            backgroundColor: [
              '#ff8144',
              '#ffa577',
              '#ffcbaa',
              '#ffe5d6',
              '#fff2ea',
              '#fff9f5'
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right'
            }
          }
        }
      });
    }
    
    // Acquisition Chart
    const acquisitionCtx = document.getElementById('acquisitionChart');
    if (acquisitionCtx) {
      new Chart(acquisitionCtx, {
        type: 'doughnut',
        data: {
          labels: ['Direct', 'Social Media', 'Search', 'Referral', 'Email', 'Other'],
          datasets: [{
            data: [35, 25, 20, 10, 7, 3],
            backgroundColor: [
              '#ff8144',
              '#ffa577',
              '#ffcbaa',
              '#ffe5d6',
              '#fff2ea',
              '#fff9f5'
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right'
            }
          },
          cutout: '70%'
        }
      });
    }
  }

  // Update charts based on date range
  function updateChartsForDateRange(range) {
    // In a real application, this would fetch data for the selected date range
    // and update the charts accordingly
    console.log(`Updating charts for date range: ${range}`);
    
    // Example of how you might update a chart with new data
    // visitorsChart.data.datasets[0].data = newVisitorsData;
    // visitorsChart.update();
  }

  // Send a message
  function sendMessage(message) {
    // In a real application, this would send the message to the server
    console.log(`Sending message: ${message}`);
    
    // Create a new message element
    const messagesThread = document.querySelector('.messages-thread');
    if (messagesThread) {
      const messageElement = document.createElement('div');
      messageElement.className = 'message shop';
      messageElement.innerHTML = `
        <div class="message-bubble">
          <p>${message}</p>
        </div>
        <span class="message-time">Just now</span>
      `;
      
      messagesThread.appendChild(messageElement);
      messagesThread.scrollTop = messagesThread.scrollHeight;
    }
  }

  // Show payment modal
  function showPaymentModal(plan) {
    let planName, planPrice;
    
    switch(plan) {
      case 'daily':
        planName = 'Daily';
        planPrice = 'DZD 2,500/day';
        break;
      case 'monthly':
        planName = 'Monthly';
        planPrice = 'DZD 15,000/month';
        break;
      case 'yearly':
        planName = 'Yearly';
        planPrice = 'DZD 120,000/year';
        break;
      case 'verified':
        planName = 'Verified Signal';
        planPrice = 'DZD 12,000';
        break;
      default:
        planName = 'Unknown';
        planPrice = 'Unknown';
    }
    
    selectedPlanName.textContent = planName;
    selectedPlanPrice.textContent = planPrice;
    
    paymentModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Reset payment method selection
    paymentMethods.forEach(m => m.classList.remove('selected'));
    proceedPayment.disabled = true;
  }

  // Close payment modal
  function closePaymentModal() {
    paymentModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Navigate to payment gateway
  function navigateToPayment(method) {
    // In a real application, this would redirect to the payment gateway
    console.log(`Navigating to ${method} payment gateway...`);
    
    // Simulate navigation
    if (method === 'baridimob') {
      alert('Redirecting to BARIDI MOB payment gateway...');
      // window.location.href = 'https://baridimob-payment.dz';
    } else if (method === 'edahabia') {
      alert('Redirecting to EDAHABIA payment gateway...');
      // window.location.href = 'https://edahabia-payment.dz';
    }
    
    // Close the modal
    closePaymentModal();
  }
});