document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Progress Bar
    const scrollProgress = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const totalScroll = document.documentElement.scrollTop;
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scroll = `${totalScroll / windowHeight * 100}%`;
        scrollProgress.style.width = scroll;
    });

    // 2. Typing Effect for Hero Subtitle
    const typingSpan = document.getElementById('typing-text');
    const roles = ["Mechatronics Engineer.", "PLC Programmer.", "IoT Developer.", "Computer Vision Enthusiast."];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingSpan.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingSpan.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typingSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentRole.length) {
            typingSpeed = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before starting new word
        }

        setTimeout(typeEffect, typingSpeed);
    }
    
    // Start typing effect slightly delayed
    setTimeout(typeEffect, 1000);

    // 3. Advanced Scroll Reveal Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's a skill bar group, animate the interior fill
                if (entry.target.classList.contains('skill-bar-group')) {
                    const fill = entry.target.querySelector('.progress-fill');
                    if (fill) {
                        fill.style.width = fill.getAttribute('data-width');
                    }
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
        observer.observe(el);
    });

    // 4. Navbar Scroll Effect & Smooth Scrolling
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });
    }

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        });
    });

    // 5. Contact Form Submission (Professional AJAX Implementation)
    const contactForm = document.getElementById('contactForm');
    const formResponse = document.getElementById('formResponse');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent full page reload

            const btn = contactForm.querySelector('button');
            const btnText = btn.querySelector('.btn-text');
            const originalBtnText = btnText.innerText;
            
            // Visual Feedback
            btn.disabled = true;
            btnText.innerText = 'Mengirim...';
            btn.style.opacity = '0.7';
            
            // Prepare data for FormSubmit AJAX
            const object = {};
            formData.forEach((value, key) => object[key] = value);
            const json = JSON.stringify(object);
            
            // Timeout 5 detik agar tidak "Sending..." selamanya
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            try {
                // Gunakan endpoint /ajax/ untuk respon JSON yang stabil
                const ajaxAction = contactForm.action.replace("formsubmit.co/", "formsubmit.co/ajax/");
                
                const response = await fetch(ajaxAction, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    contactForm.reset();
                    window.location.href = 'thanks.html';
                } else {
                    // Jika gagal tapi email tetap terkirim
                    console.warn("Server returned error, but proceeding to thanks page.");
                    window.location.href = 'thanks.html';
                }
            } catch (error) {
                clearTimeout(timeoutId);
                // Jika error (timeout, CORS, dll), asumsikan terkirim dan pindah halaman
                console.log("Submission error or timeout, redirecting to fallback...");
                window.location.href = 'thanks.html';
            } finally {
                // Pastikan button tidak terkunci jika user menekan tombol Back
                setTimeout(() => {
                    btn.disabled = false;
                    btnText.innerText = originalBtnText;
                    btn.style.opacity = '1';
                }, 1000);
            }
        });
    }
    // 6. Project & Award Auto-Slider Carousel
    const carousels = document.querySelectorAll('.card-carousel');
    
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nav = carousel.querySelector('.carousel-nav');
        const dots = [];
        let currentIndex = 0;

        // Create dots only if multiple slides
        if (slides.length > 1) {
            slides.forEach((_, i) => {
                const dot = document.createElement('div');
                dot.classList.add('carousel-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => moveToSlide(i));
                nav.appendChild(dot);
                dots.push(dot);
            });

            // Auto-slide every 3 seconds
            setInterval(() => {
                currentIndex = (currentIndex + 1) % slides.length;
                moveToSlide(currentIndex);
            }, 3500);
        } else {
            nav.style.display = 'none';
        }

        function moveToSlide(index) {
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(d => d.classList.remove('active'));
            if (dots[index]) dots[index].classList.add('active');
            currentIndex = index;
        }
    });

    // 7. Image Lightbox Popup with Multi-Image Gallery Logic
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("img01");
    const captionText = document.getElementById("caption");
    const closeBtn = document.querySelector(".modal-close");
    const prevBtn = document.getElementById("modalPrev");
    const nextBtn = document.getElementById("modalNext");
    
    let currentGallery = [];
    let currentGalleryIndex = 0;

    // Helper to update modal content
    function updateModalImage(index) {
        if (currentGallery.length > 0) {
            const img = currentGallery[index];
            modalImg.src = img.src;
            captionText.innerHTML = img.alt || "Dokumentasi Portofolio";
            currentGalleryIndex = index;
            
            // Show/Hide Nav Buttons if only 1 image
            if (currentGallery.length <= 1) {
                prevBtn.style.display = "none";
                nextBtn.style.display = "none";
            } else {
                prevBtn.style.display = "block";
                nextBtn.style.display = "block";
            }
        }
    }

    // Identify all images and add click listener
    document.querySelectorAll('img').forEach(img => {
        img.onclick = function() {
            // Find parent carousel if exists
            const carouselTrack = this.closest('.carousel-track');
            if (carouselTrack) {
                currentGallery = Array.from(carouselTrack.querySelectorAll('img'));
                currentGalleryIndex = currentGallery.indexOf(this);
            } else {
                currentGallery = [this];
                currentGalleryIndex = 0;
            }

            modal.style.display = "block";
            document.body.style.overflow = "hidden";
            updateModalImage(currentGalleryIndex);
        }
    });

    // Navigation Logic
    if (prevBtn) {
        prevBtn.onclick = (e) => {
            e.stopPropagation();
            currentGalleryIndex = (currentGalleryIndex - 1 + currentGallery.length) % currentGallery.length;
            updateModalImage(currentGalleryIndex);
        }
    }

    if (nextBtn) {
        nextBtn.onclick = (e) => {
            e.stopPropagation();
            currentGalleryIndex = (currentGalleryIndex + 1) % currentGallery.length;
            updateModalImage(currentGalleryIndex);
        }
    }

    // Close on X click
    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    }

    // Close on background click
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });

    // Keyboard Navigation (Arrow Keys + Escape)
    window.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') {
            if (e.key === 'Escape') {
                modal.style.display = 'none';
                document.body.style.overflow = "auto";
            } else if (e.key === 'ArrowRight') {
                nextBtn.click();
            } else if (e.key === 'ArrowLeft') {
                prevBtn.click();
            }
        }
    });
});

