import { Chart } from "@/components/ui/chart"
// DOM Elements
document.addEventListener("DOMContentLoaded", () => {
  // Navigation and tabs
  const menuItems = document.querySelectorAll(".menu-item")
  const tabContents = document.querySelectorAll(".tab-content")
  const dateBtns = document.querySelectorAll(".date-btn")
  const replyBtns = document.querySelectorAll(".reply-btn")
  const cancelBtns = document.querySelectorAll(".cancel-reply")
  const messageFilters = document.querySelectorAll(".message-filter")
  const conversations = document.querySelectorAll(".conversation")

  // Payment and plans
  const planBtns = document.querySelectorAll(".plan-btn.select")
  const paymentModal = document.getElementById("paymentModal")
  const closeModalPayment = document.querySelector(".close-modal")
  const cancelPayment = document.getElementById("cancelPayment")
  const proceedPayment = document.getElementById("proceedPayment")
  const paymentMethods = document.querySelectorAll(".payment-method")
  const selectedPlanName = document.getElementById("selectedPlanName")
  const selectedPlanPrice = document.getElementById("selectedPlanPrice")

  // DOM Elements - Place Details Page
  const thumbnailImages = document.querySelectorAll(".thumbnail-images img")
  const mainImage = document.querySelector(".main-image img")
  const reviewBtn = document.querySelector(".review-btn")
  const goToMapsBtn = document.querySelector(".go-to-maps-btn")
  const suggestEditBtn = document.querySelector(".suggest-edit-btn")
  const seeAllReviewsBtn = document.querySelector(".see-all-reviews-btn")
  const discoverMoreBtn = document.querySelector(".discover-more-btn")
  const reviewsModal = document.getElementById("reviewsModal")
  const closeModalReviews = document.querySelector(".close-modal")
  const allReviewsContainer = document.querySelector(".all-reviews-container")
  const placeCards = document.querySelectorAll(".place-card")
  const saveBtn = document.querySelector(".btn-dark:first-child")
  const shareBtn = document.querySelector(".btn-dark:last-child")

  // Sample reviews data
  const reviewsData = [
    {
      stars: 5,
      title: "Amazing experience!",
      body: "I had a wonderful time at this place. The service was excellent and the products were high quality. Would definitely recommend to anyone looking for a great experience.",
      reviewer: "Ahmed Benali",
      image: "https://source.unsplash.com/random/40x40/?man",
      date: "2 days ago",
    },
    {
      stars: 4,
      title: "Great service",
      body: "The staff was very friendly and helpful. The only reason I'm not giving 5 stars is because the wait time was a bit long. Otherwise, everything was perfect.",
      reviewer: "Leila Mansouri",
      image: "https://source.unsplash.com/random/40x40/?woman",
      date: "1 week ago",
    },
    {
      stars: 4.5,
      title: "Highly recommended",
      body: "This place exceeded my expectations. The quality of products and the attention to detail is impressive. I'll definitely be coming back.",
      reviewer: "Karim Hadj",
      image: "https://source.unsplash.com/random/40x40/?person",
      date: "2 weeks ago",
    },
    {
      stars: 3,
      title: "Decent place",
      body: "It's an okay place. Nothing extraordinary but gets the job done. The staff could be more attentive.",
      reviewer: "Samira Hakim",
      image: "https://source.unsplash.com/random/40x40/?girl",
      date: "3 weeks ago",
    },
    {
      stars: 5,
      title: "Best in town!",
      body: "Without a doubt the best place in town for this service. The owner is very passionate and it shows in the quality of everything they offer.",
      reviewer: "Youcef Belhadj",
      image: "https://source.unsplash.com/random/40x40/?boy",
      date: "1 month ago",
    },
    {
      stars: 4,
      title: "Good value",
      body: "Good value for money. The prices are reasonable and the quality is good. I would recommend this place to friends and family.",
      reviewer: "Nadia Taleb",
      image: "https://source.unsplash.com/random/40x40/?woman",
      date: "1 month ago",
    },
  ]

  // Initialize the dashboard
  initDashboard()

  function initDashboard() {
    setupEventListeners()
    initCharts()
    initPlaceDetailsPage()
  }

  // Initialize the place details page
  function initPlaceDetailsPage() {
    setupPlaceDetailsEventListeners()
    initMap()
  }

  // Set up event listeners
  function setupEventListeners() {
    // Tab navigation
    menuItems.forEach((item) => {
      item.addEventListener("click", () => {
        const tabId = item.getAttribute("data-tab")

        // Update active menu item
        menuItems.forEach((i) => i.classList.remove("active"))
        item.classList.add("active")

        // Show corresponding tab content
        tabContents.forEach((content) => {
          content.classList.remove("active")
          if (content.id === tabId) {
            content.classList.add("active")
          }
        })
      })
    })

    // Date selector
    dateBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        dateBtns.forEach((b) => b.classList.remove("active"))
        btn.classList.add("active")

        // In a real app, this would update the chart data based on the selected date range
        updateChartsForDateRange(btn.textContent.toLowerCase())
      })
    })

    // Reply buttons for reviews
    replyBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const replyForm = btn.nextElementSibling
        replyForm.classList.toggle("hidden")
        btn.classList.add("hidden")
      })
    })

    // Cancel reply buttons
    cancelBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const replyForm = btn.closest(".review-reply-form")
        const replyBtn = replyForm.previousElementSibling

        replyForm.classList.add("hidden")
        replyBtn.classList.remove("hidden")
      })
    })

    // Message filters
    messageFilters.forEach((filter) => {
      filter.addEventListener("click", () => {
        messageFilters.forEach((f) => f.classList.remove("active"))
        filter.classList.add("active")

        // In a real app, this would filter the messages based on the selected filter
      })
    })

    // Conversations
    conversations.forEach((conversation) => {
      conversation.addEventListener("click", () => {
        conversations.forEach((c) => c.classList.remove("active"))
        conversation.classList.add("active")

        // In a real app, this would load the selected conversation
      })
    })

    // Plan selection
    planBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const plan = btn.getAttribute("data-plan")
        showPaymentModal(plan)
      })
    })

    // Payment modal
    closeModalPayment.addEventListener("click", closePaymentModal)
    cancelPayment.addEventListener("click", closePaymentModal)

    // Payment method selection
    paymentMethods.forEach((method) => {
      method.addEventListener("click", () => {
        paymentMethods.forEach((m) => m.classList.remove("selected"))
        method.classList.add("selected")
        proceedPayment.disabled = false
      })
    })

    // Proceed to payment
    proceedPayment.addEventListener("click", () => {
      const selectedMethod = document.querySelector(".payment-method.selected")
      if (selectedMethod) {
        const method = selectedMethod.getAttribute("data-method")
        navigateToPayment(method)
      }
    })

    // Send message button
    const sendBtn = document.querySelector(".send-btn")
    if (sendBtn) {
      sendBtn.addEventListener("click", () => {
        const messageInput = document.querySelector(".message-input textarea")
        if (messageInput.value.trim() !== "") {
          sendMessage(messageInput.value)
          messageInput.value = ""
        }
      })
    }
  }

  // Set up event listeners for place details page
  function setupPlaceDetailsEventListeners() {
    // Thumbnail images click
    thumbnailImages.forEach((img) => {
      img.addEventListener("click", () => {
        mainImage.src = img.src
      })
    })

    // Review button click
    reviewBtn.addEventListener("click", () => {
      alert("Leave a review for this place")
      // In a real app, this would open a review form
    })

    // Go To Maps button click
    goToMapsBtn.addEventListener("click", () => {
      alert("Opening maps with directions to this place")
      // In a real app, this would open Google Maps with directions
    })

    // Suggest Edit button click
    suggestEditBtn.addEventListener("click", () => {
      alert("Suggest an edit for this place")
      // In a real app, this would open an edit form
    })

    // See All Reviews button click
    seeAllReviewsBtn.addEventListener("click", () => {
      openReviewsModal()
    })

    // Discover More button click
    discoverMoreBtn.addEventListener("click", () => {
      alert("Discovering more nearby places")
      // In a real app, this would navigate to a page with more nearby places
    })

    // Close modal
    closeModalReviews.addEventListener("click", () => {
      closeReviewsModal()
    })

    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
      if (e.target === reviewsModal) {
        closeReviewsModal()
      }
    })

    // Place cards click
    placeCards.forEach((card) => {
      card.addEventListener("click", () => {
        const placeName = card.querySelector(".place-name").textContent
        alert(`Viewing details for ${placeName}`)
        // In a real app, this would navigate to the place's detail page
      })
    })

    // Save button click
    saveBtn.addEventListener("click", () => {
      saveBtn.innerHTML = saveBtn.innerHTML.includes("bookmark")
        ? '<i class="fas fa-bookmark"></i> Saved'
        : '<i class="fas fa-bookmark"></i> Save'
      alert("Place saved to your favorites")
    })

    // Share button click
    shareBtn.addEventListener("click", () => {
      alert("Sharing this place")
      // In a real app, this would open a share dialog
    })
  }

  // Initialize charts
  function initCharts() {
    if (typeof Chart === "undefined") {
      console.error("Chart.js is not loaded")
      return
    }

    // Visitors Chart
    const visitorsCtx = document.getElementById("visitorsChart")
    if (visitorsCtx) {
      new Chart(visitorsCtx, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            {
              label: "Visitors",
              data: [1200, 1900, 1500, 2000, 2500, 2800, 3000, 3200, 3500, 3800, 4000, 4200],
              backgroundColor: "rgba(255, 129, 68, 0.2)",
              borderColor: "#ff8144",
              borderWidth: 2,
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
        },
      })
    }

    // Reviews Chart
    const reviewsCtx = document.getElementById("reviewsChart")
    if (reviewsCtx) {
      new Chart(reviewsCtx, {
        type: "bar",
        data: {
          labels: ["5★", "4★", "3★", "2★", "1★"],
          datasets: [
            {
              label: "Reviews",
              data: [75, 20, 3, 1, 1],
              backgroundColor: "#ff8144",
              borderRadius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
              },
              ticks: {
                callback: (value) => value + "%",
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
        },
      })
    }

    // Demographics Chart
    const demographicsCtx = document.getElementById("demographicsChart")
    if (demographicsCtx) {
      new Chart(demographicsCtx, {
        type: "pie",
        data: {
          labels: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
          datasets: [
            {
              data: [15, 30, 25, 18, 8, 4],
              backgroundColor: ["#ff8144", "#ffa577", "#ffcbaa", "#ffe5d6", "#fff2ea", "#fff9f5"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "right",
            },
          },
        },
      })
    }

    // Acquisition Chart
    const acquisitionCtx = document.getElementById("acquisitionChart")
    if (acquisitionCtx) {
      new Chart(acquisitionCtx, {
        type: "doughnut",
        data: {
          labels: ["Direct", "Social Media", "Search", "Referral", "Email", "Other"],
          datasets: [
            {
              data: [35, 25, 20, 10, 7, 3],
              backgroundColor: ["#ff8144", "#ffa577", "#ffcbaa", "#ffe5d6", "#fff2ea", "#fff9f5"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "right",
            },
          },
          cutout: "70%",
        },
      })
    }
  }

  // Initialize map
  function initMap() {
    // In a real app, this would initialize a Google Map
    console.log("Map initialized")
  }

  // Update charts based on date range
  function updateChartsForDateRange(range) {
    // In a real application, this would fetch data for the selected date range
    // and update the charts accordingly
    console.log(`Updating charts for date range: ${range}`)

    // Example of how you might update a chart with new data
    // visitorsChart.data.datasets[0].data = newVisitorsData;
    // visitorsChart.update();
  }

  // Send a message
  function sendMessage(message) {
    // In a real application, this would send the message to the server
    console.log(`Sending message: ${message}`)

    // Create a new message element
    const messagesThread = document.querySelector(".messages-thread")
    if (messagesThread) {
      const messageElement = document.createElement("div")
      messageElement.className = "message shop"
      messageElement.innerHTML = `
        <div class="message-bubble">
          <p>${message}</p>
        </div>
        <span class="message-time">Just now</span>
      `

      messagesThread.appendChild(messageElement)
      messagesThread.scrollTop = messagesThread.scrollHeight
    }
  }

  // Show payment modal
  function showPaymentModal(plan) {
    let planName, planPrice

    switch (plan) {
      case "daily":
        planName = "Daily"
        planPrice = "DZD 2,500/day"
        break
      case "monthly":
        planName = "Monthly"
        planPrice = "DZD 15,000/month"
        break
      case "yearly":
        planName = "Yearly"
        planPrice = "DZD 120,000/year"
        break
      case "verified":
        planName = "Verified Signal"
        planPrice = "DZD 12,000"
        break
      default:
        planName = "Unknown"
        planPrice = "Unknown"
    }

    selectedPlanName.textContent = planName
    selectedPlanPrice.textContent = planPrice

    paymentModal.classList.add("active")
    document.body.style.overflow = "hidden"

    // Reset payment method selection
    paymentMethods.forEach((m) => m.classList.remove("selected"))
    proceedPayment.disabled = true
  }

  // Open reviews modal
  function openReviewsModal() {
    reviewsModal.style.display = "block"
    document.body.style.overflow = "hidden"

    // Clear previous reviews
    allReviewsContainer.innerHTML = ""

    // Add all reviews to the modal
    reviewsData.forEach((review) => {
      const reviewElement = createReviewElement(review)
      allReviewsContainer.appendChild(reviewElement)
    })
  }

  // Close payment modal
  function closePaymentModal() {
    paymentModal.classList.remove("active")
    document.body.style.overflow = ""
  }

  // Close reviews modal
  function closeReviewsModal() {
    reviewsModal.style.display = "none"
    document.body.style.overflow = ""
  }

  // Create a review element
  function createReviewElement(review) {
    const reviewElement = document.createElement("div")
    reviewElement.className = "review-card"

    // Create stars based on rating
    let starsHTML = ""
    const fullStars = Math.floor(review.stars)
    const hasHalfStar = review.stars % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      starsHTML += '<i class="fas fa-star"></i>'
    }

    if (hasHalfStar) {
      starsHTML += '<i class="fas fa-star-half-alt"></i>'
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += '<i class="far fa-star"></i>'
    }

    reviewElement.innerHTML = `
      <div class="review-stars">
        ${starsHTML}
      </div>
      <h3 class="review-title">${review.title}</h3>
      <p class="review-body">${review.body}</p>
      <div class="reviewer">
        <img src="${review.image}" alt="Reviewer" class="reviewer-img">
        <div class="reviewer-info">
          <p class="reviewer-name">${review.reviewer}</p>
          <p class="review-date">${review.date}</p>
        </div>
      </div>
    `

    return reviewElement
  }

  // Navigate to payment gateway
  function navigateToPayment(method) {
    // In a real application, this would redirect to the payment gateway
    console.log(`Navigating to ${method} payment gateway...`)

    // Simulate navigation
    if (method === "baridimob") {
      alert("Redirecting to BARIDI MOB payment gateway...")
      // window.location.href = 'https://baridimob-payment.dz';
    } else if (method === "edahabia") {
      alert("Redirecting to EDAHABIA payment gateway...")
      // window.location.href = 'https://edahabia-payment.dz';
    }

    // Close the modal
    closePaymentModal()
  }
})
