document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all content sections
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Show the corresponding content section
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');

            // Initialize charts if analytics section is active
            if (sectionId === 'analytics') {
                initCharts();
            }
        });
    });

    // Modal functionality
    const modals = document.querySelectorAll('.modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    // Open modals
    document.getElementById('addShopBtn').addEventListener('click', function() {
        document.getElementById('addShopModal').style.display = 'flex';
    });

    document.getElementById('addUserBtn').addEventListener('click', function() {
        document.getElementById('addUserModal').style.display = 'flex';
    });

    document.getElementById('composeBtn').addEventListener('click', function() {
        document.getElementById('composeMessageModal').style.display = 'flex';
    });

    // Close modals
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Edit review functionality
    const editReviewBtns = document.querySelectorAll('.edit-review');
    
    editReviewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const user = row.cells[1].textContent;
            const shop = row.cells[2].textContent;
            const rating = row.cells[3].textContent;
            const comment = row.cells[4].textContent;
            
            document.getElementById('reviewUser').value = user;
            document.getElementById('reviewShop').value = shop;
            document.getElementById('reviewRating').value = rating;
            document.getElementById('reviewComment').value = comment;
            
            document.getElementById('editReviewModal').style.display = 'flex';
        });
    });

    // View message functionality
    const viewMessageBtns = document.querySelectorAll('.view-message');
    
    viewMessageBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const from = row.cells[1].textContent;
            const to = row.cells[2].textContent;
            const subject = row.cells[3].textContent;
            const date = row.cells[4].textContent;
            
            document.getElementById('viewMessageFrom').textContent = from;
            document.getElementById('viewMessageTo').textContent = to;
            document.getElementById('viewMessageSubject').textContent = subject;
            document.getElementById('viewMessageDate').textContent = date;
            
            document.getElementById('viewMessageModal').style.display = 'flex';
        });
    });

    // Save functionality
    document.getElementById('saveShopBtn').addEventListener('click', function() {
        const shopName = document.getElementById('shopName').value;
        const ownerName = document.getElementById('ownerName').value;
        
        if (shopName && ownerName) {
            // In a real application, this would save to a database
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${document.getElementById('shopsTableBody').children.length + 1}</td>
                <td>${shopName}</td>
                <td>${ownerName}</td>
                <td>${document.getElementById('shopCategory').value || 'Other'}</td>
                <td>0.0</td>
                <td>${document.getElementById('shopStatus').value || 'Active'}</td>
                <td class="action-buttons">
                    <button class="btn btn-warning btn-sm edit-shop">Edit</button>
                    <button class="btn btn-danger btn-sm delete-shop">Delete</button>
                    <button class="btn btn-primary btn-sm contact-shop">Contact</button>
                </td>
            `;
            
            document.getElementById('shopsTableBody').appendChild(newRow);
            document.getElementById('addShopModal').style.display = 'none';
            
            // Clear form
            document.getElementById('shopName').value = '';
            document.getElementById('ownerName').value = '';
            document.getElementById('shopCategory').value = '';
            document.getElementById('shopEmail').value = '';
            document.getElementById('shopStatus').value = 'Active';
            
            showNotification('Shop added successfully!', 'success');
        } else {
            showNotification('Please fill in all required fields!', 'error');
        }
    });

    document.getElementById('saveReviewBtn').addEventListener('click', function() {
        const rating = document.getElementById('reviewRating').value;
        const comment = document.getElementById('reviewComment').value;
        
        if (rating && comment) {
            // In a real application, this would update the database
            showNotification('Review updated successfully!', 'success');
            document.getElementById('editReviewModal').style.display = 'none';
        } else {
            showNotification('Please fill in all required fields!', 'error');
        }
    });

    document.getElementById('saveUserBtn').addEventListener('click', function() {
        const userName = document.getElementById('userName').value;
        const userEmail = document.getElementById('userEmail').value;
        
        if (userName && userEmail) {
            // In a real application, this would save to a database
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${document.getElementById('usersTableBody').children.length + 1}</td>
                <td>${userName}</td>
                <td>${userEmail}</td>
                <td>${document.getElementById('userRole').value}</td>
                <td>${new Date().toISOString().split('T')[0]}</td>
                <td>${document.getElementById('userStatus').value}</td>
                <td class="action-buttons">
                    <button class="btn btn-warning btn-sm edit-user">Edit</button>
                    <button class="btn btn-danger btn-sm delete-user">Delete</button>
                    <button class="btn btn-primary btn-sm contact-user">Contact</button>
                </td>
            `;
            
            document.getElementById('usersTableBody').appendChild(newRow);
            document.getElementById('addUserModal').style.display = 'none';
            
            // Clear form
            document.getElementById('userName').value = '';
            document.getElementById('userEmail').value = '';
            document.getElementById('userPassword').value = '';
            
            showNotification('User added successfully!', 'success');
        } else {
            showNotification('Please fill in all required fields!', 'error');
        }
    });

    document.getElementById('sendMessageBtn').addEventListener('click', function() {
        const recipient = document.getElementById('messageRecipient').value;
        const subject = document.getElementById('messageSubject').value;
        const body = document.getElementById('messageBody').value;
        
        if (recipient && subject && body) {
            // In a real application, this would send the message
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${document.getElementById('messagesTableBody').children.length + 1}</td>
                <td>Admin</td>
                <td>${document.getElementById('messageRecipient').options[document.getElementById('messageRecipient').selectedIndex].text}</td>
                <td>${subject}</td>
                <td>${new Date().toISOString().split('T')[0]}</td>
                <td>Sent</td>
                <td class="action-buttons">
                    <button class="btn btn-primary btn-sm view-message">View</button>
                    <button class="btn btn-danger btn-sm delete-message">Delete</button>
                </td>
            `;
            
            document.getElementById('messagesTableBody').appendChild(newRow);
            document.getElementById('composeMessageModal').style.display = 'none';
            
            // Clear form
            document.getElementById('messageRecipient').value = '';
            document.getElementById('messageSubject').value = '';
            document.getElementById('messageBody').value = '';
            
            showNotification('Message sent successfully!', 'success');
        } else {
            showNotification('Please fill in all required fields!', 'error');
        }
    });

    document.getElementById('saveGeneralSettings').addEventListener('click', function() {
        // In a real application, this would save the settings
        showNotification('General settings saved successfully!', 'success');
    });

    document.getElementById('saveReviewSettings').addEventListener('click', function() {
        // In a real application, this would save the settings
        showNotification('Review settings saved successfully!', 'success');
    });

    // Delete functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-shop')) {
            if (confirm('Are you sure you want to delete this shop?')) {
                e.target.closest('tr').remove();
                showNotification('Shop deleted successfully!', 'success');
            }
        }
        
        if (e.target.classList.contains('delete-review')) {
            if (confirm('Are you sure you want to delete this review?')) {
                e.target.closest('tr').remove();
                showNotification('Review deleted successfully!', 'success');
            }
        }
        
        if (e.target.classList.contains('delete-user')) {
            if (confirm('Are you sure you want to delete this user?')) {
                e.target.closest('tr').remove();
                showNotification('User deleted successfully!', 'success');
            }
        }
        
        if (e.target.classList.contains('delete-message')) {
            if (confirm('Are you sure you want to delete this message?')) {
                e.target.closest('tr').remove();
                showNotification('Message deleted successfully!', 'success');
            }
        }
    });

    // Reply to message
    document.getElementById('replyMessageBtn').addEventListener('click', function() {
        const from = document.getElementById('viewMessageFrom').textContent;
        const subject = document.getElementById('viewMessageSubject').textContent;
        
        document.getElementById('viewMessageModal').style.display = 'none';
        document.getElementById('composeMessageModal').style.display = 'flex';
        
        // Pre-fill the compose form
        const recipientSelect = document.getElementById('messageRecipient');
        for (let i = 0; i < recipientSelect.options.length; i++) {
            if (recipientSelect.options[i].text.includes(from.split(' ')[0])) {
                recipientSelect.selectedIndex = i;
                break;
            }
        }
        
        document.getElementById('messageSubject').value = 'RE: ' + subject;
        document.getElementById('messageBody').focus();
    });

    // Search functionality
    document.getElementById('shopSearch').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.getElementById('shopsTableBody').getElementsByTagName('tr');
        
        Array.from(rows).forEach(row => {
            const shopName = row.cells[1].textContent.toLowerCase();
            const ownerName = row.cells[2].textContent.toLowerCase();
            const category = row.cells[3].textContent.toLowerCase();
            
            if (shopName.includes(searchTerm) || ownerName.includes(searchTerm) || category.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    document.getElementById('reviewSearch').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.getElementById('reviewsTableBody').getElementsByTagName('tr');
        
        Array.from(rows).forEach(row => {
            const user = row.cells[1].textContent.toLowerCase();
            const shop = row.cells[2].textContent.toLowerCase();
            const comment = row.cells[4].textContent.toLowerCase();
            
            if (user.includes(searchTerm) || shop.includes(searchTerm) || comment.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    document.getElementById('userSearch').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.getElementById('usersTableBody').getElementsByTagName('tr');
        
        Array.from(rows).forEach(row => {
            const name = row.cells[1].textContent.toLowerCase();
            const email = row.cells[2].textContent.toLowerCase();
            const role = row.cells[3].textContent.toLowerCase();
            
            if (name.includes(searchTerm) || email.includes(searchTerm) || role.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    document.getElementById('messageSearch').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.getElementById('messagesTableBody').getElementsByTagName('tr');
        
        Array.from(rows).forEach(row => {
            const from = row.cells[1].textContent.toLowerCase();
            const to = row.cells[2].textContent.toLowerCase();
            const subject = row.cells[3].textContent.toLowerCase();
            
            if (from.includes(searchTerm) || to.includes(searchTerm) || subject.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // Feature review
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('feature-review')) {
            showNotification('Review featured successfully!', 'success');
        }
    });

    // Contact functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('contact-shop') || e.target.classList.contains('contact-user')) {
            const row = e.target.closest('tr');
            const name = row.cells[1].textContent;
            
            document.getElementById('composeMessageModal').style.display = 'flex';
            
            // Pre-fill the compose form
            const recipientSelect = document.getElementById('messageRecipient');
            for (let i = 0; i < recipientSelect.options.length; i++) {
                if (recipientSelect.options[i].text.includes(name.split(' ')[0])) {
                    recipientSelect.selectedIndex = i;
                    break;
                }
            }
            
            document.getElementById('messageSubject').focus();
        }
    });

    // Analytics functionality
    document.getElementById('dateRange').addEventListener('change', function() {
        initCharts();
        showNotification('Analytics data updated!', 'success');
    });

    document.getElementById('exportAnalyticsBtn').addEventListener('click', function() {
        // In a real application, this would export the analytics data
        showNotification('Analytics data exported successfully!', 'success');
    });

    document.getElementById('copyCodeBtn').addEventListener('click', function() {
        const codeText = document.querySelector('.code-container pre code').textContent;
        navigator.clipboard.writeText(codeText).then(() => {
            showNotification('Integration code copied to clipboard!', 'success');
        });
    });

    // Notification function
    function showNotification(message, type) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = 'notification ' + type;
        notification.style.display = 'block';
        
        setTimeout(function() {
            notification.style.display = 'none';
        }, 3000);
    }

    // Initialize charts
    function initCharts() {
        drawRegistrationChart();
        drawUserDistributionChart();
        drawUserActivityChart();
    }

    // Draw Registration Trends Chart
    function drawRegistrationChart() {
        const canvas = document.getElementById('registrationChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Clear previous chart
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Chart dimensions
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;
        
        // Sample data - in a real app, this would come from an API
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const shopOwners = [2, 3, 1, 4, 2, 3, 1, 2, 1, 2, 1, 2];
        const customers = [5, 7, 6, 9, 8, 10, 7, 8, 9, 6, 7, 5];
        
        // Find max value for scaling
        const maxValue = Math.max(...shopOwners, ...customers) * 1.2;
        
        // Draw axes
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw X-axis labels
        ctx.textAlign = 'center';
        ctx.fillStyle = '#666';
        ctx.font = '10px Arial';
        
        const xStep = (width - padding * 2) / (months.length - 1);
        months.forEach((month, i) => {
            const x = padding + i * xStep;
            ctx.fillText(month, x, height - padding + 15);
        });
        
        // Draw Y-axis labels
        ctx.textAlign = 'right';
        const yStep = (height - padding * 2) / 5;
        for (let i = 0; i <= 5; i++) {
            const y = height - padding - i * yStep;
            const value = Math.round(maxValue * i / 5);
            ctx.fillText(value.toString(), padding - 5, y + 3);
        }
        
        // Draw shop owners line
        ctx.beginPath();
        shopOwners.forEach((value, i) => {
            const x = padding + i * xStep;
            const y = height - padding - (value / maxValue) * (height - padding * 2);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.strokeStyle = '#e06a30';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw shop owners points
        shopOwners.forEach((value, i) => {
            const x = padding + i * xStep;
            const y = height - padding - (value / maxValue) * (height - padding * 2);
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#e06a30';
            ctx.fill();
        });
        
        // Draw customers line
        ctx.beginPath();
        customers.forEach((value, i) => {
            const x = padding + i * xStep;
            const y = height - padding - (value / maxValue) * (height - padding * 2);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.strokeStyle = '#ff8144';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw customers points
        customers.forEach((value, i) => {
            const x = padding + i * xStep;
            const y = height - padding - (value / maxValue) * (height - padding * 2);
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#ff8144';
            ctx.fill();
        });
        
        // Draw legend
        const legendX = width - 150;
        const legendY = padding + 20;
        
        // Shop owners legend
        ctx.beginPath();
        ctx.rect(legendX, legendY - 5, 15, 2);
        ctx.fillStyle = '#e06a30';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(legendX + 7, legendY - 4, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#e06a30';
        ctx.fill();
        
        ctx.fillStyle = '#333';
        ctx.textAlign = 'left';
        ctx.fillText('Shop Owners', legendX + 20, legendY);
        
        // Customers legend
        ctx.beginPath();
        ctx.rect(legendX, legendY + 15, 15, 2);
        ctx.fillStyle = '#ff8144';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(legendX + 7, legendY + 16, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ff8144';
        ctx.fill();
        
        ctx.fillStyle = '#333';
        ctx.textAlign = 'left';
        ctx.fillText('Customers', legendX + 20, legendY + 20);
    }

    // Draw User Distribution Chart (Pie Chart)
    function drawUserDistributionChart() {
        const canvas = document.getElementById('userDistributionChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Clear previous chart
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Chart dimensions
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) - 40;
        
        // Sample data
        const data = [
            { label: 'Shop Owners', value: 24, color: '#e06a30' },
            { label: 'Customers', value: 87, color: '#ff8144' }
        ];
        
        // Calculate total
        const total = data.reduce((sum, item) => sum + item.value, 0);
        
        // Draw pie slices
        let startAngle = 0;
        data.forEach(item => {
            const sliceAngle = (item.value / total) * 2 * Math.PI;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = item.color;
            ctx.fill();
            
            // Draw label
            const midAngle = startAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(midAngle) * (radius * 0.7);
            const labelY = centerY + Math.sin(midAngle) * (radius * 0.7);
            
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${Math.round((item.value / total) * 100)}%`, labelX, labelY);
            
            startAngle += sliceAngle;
        });
        
        // Draw legend
        const legendX = width - 100;
        const legendY = height - 80;
        
        data.forEach((item, i) => {
            const y = legendY + i * 25;
            
            ctx.fillStyle = item.color;
            ctx.fillRect(legendX, y, 15, 15);
            
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${item.label} (${item.value})`, legendX + 25, y + 7);
        });
    }

    // Draw User Activity Chart (Bar Chart)
    function drawUserActivityChart() {
        const canvas = document.getElementById('userActivityChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Clear previous chart
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Chart dimensions
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;
        
        // Sample data
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const activity = [15, 22, 18, 25, 30, 28, 20];
        
        // Find max value for scaling
        const maxValue = Math.max(...activity) * 1.2;
        
        // Draw axes
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw X-axis labels
        ctx.textAlign = 'center';
        ctx.fillStyle = '#666';
        ctx.font = '10px Arial';
        
        const barWidth = (width - padding * 2) / days.length - 10;
        const xStep = (width - padding * 2) / days.length;
        
        days.forEach((day, i) => {
            const x = padding + i * xStep + xStep / 2;
            ctx.fillText(day, x, height - padding + 15);
        });
        
        // Draw Y-axis labels
        ctx.textAlign = 'right';
        const yStep = (height - padding * 2) / 5;
        for (let i = 0; i <= 5; i++) {
            const y = height - padding - i * yStep;
            const value = Math.round(maxValue * i / 5);
            ctx.fillText(value.toString(), padding - 5, y + 3);
        }
        
        // Draw bars
        activity.forEach((value, i) => {
            const x = padding + i * xStep + 5;
            const barHeight = (value / maxValue) * (height - padding * 2);
            const y = height - padding - barHeight;
            
            ctx.fillStyle = '#ff8144';
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Draw value on top of bar
            ctx.fillStyle = '#333';
            ctx.textAlign = 'center';
            ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
        });
    }

    // Initialize charts on page load if analytics section is visible
    if (document.getElementById('analytics').classList.contains('active')) {
        initCharts();
    }
});