document.addEventListener('DOMContentLoaded', function() {
    // Load user data from localStorage
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        
        if (profileName) profileName.textContent = userData.name;
        if (profileEmail) profileEmail.textContent = userData.email;
    } else {
        // If no user data, redirect to login
        window.location.href = 'login.html';
    }
});

function goToFilter() {
        window.location.href = 'Filter.html';
    }
// Close ad functionality
        function closeAd() {
            document.querySelector('.fullscreen-ad-container').style.transform = 'translateY(100%)';
            setTimeout(() => {
            document.querySelector('.fullscreen-ad-container').style.display = 'none';
        }, 300);
        }

        // Optional: Track ad clicks
            document.querySelector('.fullscreen-ad').addEventListener('click', function() {
            console.log('Fullscreen ad clicked');
            // Add analytics tracking here
            });

        // Sidebar functionality
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        const nightModeToggle = document.getElementById('nightModeToggle');
        
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        // Night mode toggle
        nightModeToggle.addEventListener('change', () => {
            document.body.classList.toggle('night-mode');
            
            // Save preference to localStorage
            if (document.body.classList.contains('night-mode')) {
                localStorage.setItem('nightMode', 'enabled');
            } else {
                localStorage.setItem('nightMode', 'disabled');
            }
        });

        // Check for saved night mode preference
        if (localStorage.getItem('nightMode') === 'enabled') {
            document.body.classList.add('night-mode');
            nightModeToggle.checked = true;
        }

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && e.target !== sidebarToggle) {
                sidebar.classList.remove('open');
            }
        });
        document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const chatbotContainer = document.getElementById('chatbotContainer');
  const chatbotMessages = document.getElementById('chatbotMessages');
  const userInput = document.getElementById('userInput');
  const sendButton = document.getElementById('sendMessage');
  const closeButton = document.getElementById('closeChatbot');
  const messengerButton = document.getElementById('messengerButton');
  
  // Toggle chatbot visibility
  messengerButton.addEventListener('click', function() {
    chatbotContainer.classList.add('active');
    addBotMessage("Hello! I'm Reviqo Assistant. How can I help you today?");
  });
  
  closeButton.addEventListener('click', function() {
    chatbotContainer.classList.remove('active');
  });
  
  // Send message function
  function sendMessage() {
    const message = userInput.value.trim();
    if (message !== '') {
      addUserMessage(message);
      userInput.value = '';
      setTimeout(() => {
        respondToUser(message);
      }, 500);
    }
  }
  
  // Event listeners for sending messages
  sendButton.addEventListener('click', sendMessage);
  userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  // Add message to chat
  function addMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    messageDiv.textContent = text;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }
  
  function addUserMessage(text) {
    addMessage(text, true);
  }
  
  function addBotMessage(text) {
    addMessage(text, false);
  }
  
  // Bot responses
  function respondToUser(message) {
    const lowerMessage = message.toLowerCase();
    let response;
    
    // Common questions and responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      response = "Hello there! How can I assist you today? Ask 'help' or 'search' or 'review' or 'account' or 'thank' or 'bye' ";
    } else if (lowerMessage.includes('help')) {
      response = "I can help you with:\n- Finding places\n- Reviewing businesses\n- Navigation help\n- Account issues\nWhat do you need help with?";
    } else if (lowerMessage.includes('search') || lowerMessage.includes('find')) {
      response = "You can use the search bar at the top of the page to find places. What are you looking for?";
    } else if (lowerMessage.includes('review') || lowerMessage.includes('rating')) {
      response = "To leave a review, go to the business page and click on 'Write a Review' button.";
    } else if (lowerMessage.includes('account') || lowerMessage.includes('login')) {
      response = "Account issues can be resolved in the 'Settings' section. Would you like me to guide you there?";
    } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      response = "You're welcome! Is there anything else I can help you with?";
    } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      response = "Goodbye! Feel free to come back if you have more questions.";
      setTimeout(() => {
        chatbotContainer.classList.remove('active');
      }, 1500);
    } else {
      response = "I'm not sure I understand. Could you rephrase your question? Here are things I can help with:\n- Search for places\n- Write reviews\n- Account issues\n- General help";
    }
    
    // Simulate typing effect
    simulateTyping(response);
  }
  
  // Simulate typing effect
  function simulateTyping(text) {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        const currentText = text.substring(0, i + 1);
        // Check if we need to replace the last message or add a new one
        const lastMessage = chatbotMessages.lastChild;
        if (lastMessage && lastMessage.classList.contains('bot-message') ){
          lastMessage.textContent = currentText;
        } else {
          addBotMessage(currentText);
        }
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 20);
  }
  
  // Initial greeting when chatbot opens
  function initializeChatbot() {
    // You can add any initialization code here if needed
  }
  
  // Initialize
  initializeChatbot();
    





  
});