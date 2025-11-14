// Make checkboxes mutually exclusive
        const checkboxes = document.querySelectorAll('input[name="accountType"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if(this.checked) {
                    checkboxes.forEach(cb => cb !== this && (cb.checked = false));
                }
            });
        });

        // Handle Next button click
        document.getElementById('nextButton').addEventListener('click', function() {
            const selectedCheckbox = document.querySelector('input[name="accountType"]:checked');
            if(!selectedCheckbox) return alert('Please select an account type');
            window.location.href = `confirm.html?type=${selectedCheckbox.value}`;
        });