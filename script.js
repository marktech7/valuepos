document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navigation = document.querySelector('.navigation');
    
    mobileMenuToggle.addEventListener('click', function() {
        navigation.classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-bars');
        this.querySelector('i').classList.toggle('fa-times');
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navigation.classList.contains('active')) {
                navigation.classList.remove('active');
                mobileMenuToggle.querySelector('i').classList.toggle('fa-bars');
                mobileMenuToggle.querySelector('i').classList.toggle('fa-times');
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without page jump
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    window.location.hash = targetId;
                }
            }
        });
    });
    
    // Form validation and submission
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const spinner = document.getElementById('spinner');
    const formMessage = document.getElementById('form-message');
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        let isValid = true;
        
        // Reset error messages
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });
        
        // Validate first name
        if (!firstName) {
            document.getElementById('first-name-error').textContent = 'Please enter your first name';
            document.getElementById('first-name-error').style.display = 'block';
            isValid = false;
        }
        
        // Validate last name
        if (!lastName) {
            document.getElementById('last-name-error').textContent = 'Please enter your last name';
            document.getElementById('last-name-error').style.display = 'block';
            isValid = false;
        }
        
        // Validate email
        if (!email) {
            document.getElementById('email-error').textContent = 'Please enter your email address';
            document.getElementById('email-error').style.display = 'block';
            isValid = false;
        } else if (!isValidEmail(email)) {
            document.getElementById('email-error').textContent = 'Please enter a valid email address';
            document.getElementById('email-error').style.display = 'block';
            isValid = false;
        }
        
        // Validate message
        if (!message) {
            document.getElementById('message-error').textContent = 'Please enter your message';
            document.getElementById('message-error').style.display = 'block';
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Show loading state
        submitBtn.classList.add('loading');
        spinner.classList.remove('hidden');
        
        try {
            // Prepare form data
            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Send to Formspark
            const response = await fetch('https://submit-form.com/Np9l44BM7', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                // Show success message
                formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
                formMessage.className = 'form-message success';
                
                // Reset form
                contactForm.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            formMessage.textContent = 'There was an error submitting your form. Please try again later