        document.addEventListener('DOMContentLoaded', function() {
            const menuItems = document.querySelectorAll('.menu-item');
            const contentSections = document.querySelectorAll('.content-section-content');

            // Handle menu navigation
            menuItems.forEach(item => {
                item.addEventListener('click', function() {
                    const targetSection = this.dataset.section;
                    
                    // Remove active class from all menu items
                    menuItems.forEach(mi => mi.classList.remove('active'));
                    
                    // Add active class to clicked item
                    this.classList.add('active');

                    // Hide all content sections
                    contentSections.forEach(section => section.classList.add('hidden'));
                    
                    // Show target section
                    const targetContent = document.getElementById(targetSection + '-content');
                    if (targetContent) {
                        targetContent.classList.remove('hidden');
                    }
                });
            });

            // Handle form submission
            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                contactForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const formData = new FormData(this);
                    const subject = formData.get('subject');
                    const priority = formData.get('priority');
                    const message = formData.get('message');
                    
                    // Simulate email sending
                    const emailBody = `Subject: ${subject}\nPriority: ${priority}\n\nMessage:\n${message}\n\n--\nSent from Madiba HealthConnect\nStudent: Lindokuhle Madwendwe\nStudent ID: 1234567890`;
                    
                    // Create mailto link
                    const mailtoLink = `mailto:clinic@mandela.ac.za?subject=HealthConnect: ${subject}&body=${encodeURIComponent(emailBody)}`;
                    
                    // Open email client
                    window.location.href = mailtoLink;
                    
                    // Show success message
                    alert('Your default email client will open with the message pre-filled. Please send the email to complete your request.');
                    
                    // Reset form
                    this.reset();
                });
            }

            // Enhanced scroll effect for gradient darkening
            let ticking = false;
            
            function updateGradient() {
                const scrollTop = window.pageYOffset;
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                const scrollProgress = Math.min(scrollTop / (maxScroll || 1), 1);
                
                // Calculate darkness based on scroll
                const darkness = scrollProgress * 0.4; // Max 40% darkness
                
                // Apply the overlay
                const overlay = document.querySelector('body::before') || document.body;
                document.body.style.setProperty('--scroll-darkness', darkness);
                
                ticking = false;
            }
            
            function requestUpdate() {
                if (!ticking) {
                    requestAnimationFrame(updateGradient);
                    ticking = true;
                }
            }
            
            window.addEventListener('scroll', requestUpdate);
            
            // Update CSS to use the custom property
            const style = document.createElement('style');
            style.textContent = `
                body::before {
                    background: linear-gradient(180deg, 
                        rgba(0,0,0,0) 0%, 
                        rgba(0,0,0,calc(0.1 + var(--scroll-darkness, 0))) 30%, 
                        rgba(0,0,0,calc(0.2 + var(--scroll-darkness, 0) * 1.5)) 60%, 
                        rgba(0,0,0,calc(0.3 + var(--scroll-darkness, 0) * 2)) 100%);
                }
            `;
            document.head.appendChild(style);
        });