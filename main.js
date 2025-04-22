/*
* Actuariat & Finance - Modern Website
* Author: Amine Ait Bounou
* Version: 1.0
*/

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS animation library
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('hide');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
    }

    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }

    // Mobile menu links - close menu when clicking a link
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    // Sticky header
    const header = document.getElementById('header');
    
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Active navigation links based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    
    function highlightNavLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);

    // Back to top button
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 700) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        
        backToTopButton.addEventListener('click', e => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth scrolling for anchor links
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Animate circular progress bars
    const animateCircles = () => {
        const circles = document.querySelectorAll('.stats__circle-progress');
        
        circles.forEach(circle => {
            const percent = parseInt(circle.getAttribute('data-percent'));
            const circumference = 283; // 2 * PI * 45 (radius)
            const offset = circumference - (circumference * percent / 100);
            
            circle.style.strokeDashoffset = offset;
        });
    };

    // Observe the stats section and animate when visible
    const statsSection = document.getElementById('stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCircles();
                    initCounters();
                    setupCharts();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(statsSection);
    }

    // Program tabs functionality
    setupProgramTabs();

    // Contact form handling
    setupContactForm();
});

// Setup program tabs
function setupProgramTabs() {
    const modules = document.querySelectorAll('.program__module');
    const tabs = document.querySelectorAll('.program__tab');
    
    if (modules.length && tabs.length) {
        modules.forEach(module => {
            module.addEventListener('click', () => {
                // Update active module
                modules.forEach(m => m.classList.remove('program__module--active'));
                module.classList.add('program__module--active');
                
                // Show corresponding tab
                const targetId = module.getAttribute('data-target');
                tabs.forEach(tab => {
                    tab.classList.remove('program__tab--active');
                    if (tab.id === targetId) {
                        tab.classList.add('program__tab--active');
                    }
                });
            });
        });
    }
}

// Setup charts for statistics section
function setupCharts() {
    // Sectors Chart (Doughnut)
    const sectorsChartEl = document.getElementById('sectorsChart');
    if (sectorsChartEl) {
        const sectorsChart = new Chart(sectorsChartEl, {
            type: 'doughnut',
            data: {
                labels: ['Assurance', 'Banque', 'Consulting', 'Autres'],
                datasets: [{
                    data: [45, 35, 15, 5],
                    backgroundColor: ['#4FD1C5', '#818CF8', '#A78BFA', '#F472B6'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1f2937',
                        titleFont: {
                            size: 16,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 14
                        },
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.raw + '%';
                            }
                        },
                        // Make tooltips appear more easily
                        enabled: true,
                        intersect: false,
                        mode: 'nearest'
                    }
                },
                // Enable interactions for chart elements
                events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
                interaction: {
                    mode: 'nearest',
                    intersect: false
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                },
                // Add onHover to display element information
                onHover: (event, chartElements) => {
                    const chartElement = document.getElementById('sectorsChart');
                    if (chartElements && chartElements.length > 0) {
                        chartElement.style.cursor = 'pointer';
                    } else {
                        chartElement.style.cursor = 'default';
                    }
                }
            }
        });
    }

    // Salary Evolution Chart (Line)
    const salaryChartEl = document.getElementById('salaryChart');
    if (salaryChartEl) {
        const salaryChart = new Chart(salaryChartEl, {
            type: 'line',
            data: {
                labels: ['Stage', 'Diplomation', '1 an', '2 ans', '3 ans', '5 ans'],
                datasets: [{
                    label: 'Évolution du salaire (MAD/mois)',
                    data: [6000, 15000, 18000, 22000, 28000, 35000],
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    borderColor: '#10b981',
                    borderWidth: 2,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#fff',
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1f2937',
                        titleFont: {
                            size: 16,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 14
                        },
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return new Intl.NumberFormat('fr-MA', {
                                    style: 'currency',
                                    currency: 'MAD',
                                    maximumFractionDigits: 0
                                }).format(context.raw);
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString() + ' MAD';
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }
}

// Contact form handling
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            // Don't prevent default - let the form submit to Formspree
            
            // Add loading state to submit button
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            submitButton.disabled = true;
            
            // Reset button state after a delay (Formspree will handle the redirect)
            setTimeout(() => {
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }, 2000);
        });
    }
    
    // Newsletter subscription form
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', e => {
            // Don't prevent default - let the form submit to Formspree
            
            // Add loading state to submit button
            const submitButton = newsletterForm.querySelector('button[type="submit"]');
            const originalButtonHTML = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitButton.disabled = true;
            
            // Reset button state after a delay (Formspree will handle the redirect)
            setTimeout(() => {
                submitButton.innerHTML = originalButtonHTML;
                submitButton.disabled = false;
            }, 2000);
        });
    }
}

// Counter animation function
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const suffix = element.dataset.suffix || '';
    
    const animate = () => {
        start += increment;
        
        if (start >= target) {
            element.textContent = target.toLocaleString() + suffix;
            return;
        }
        
        element.textContent = Math.floor(start).toLocaleString() + suffix;
        requestAnimationFrame(animate);
    };
    
    animate();
}

// Initialize counters
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        
        // For the donut chart center, don't animate and show 45% immediately
        if (counter.closest('.stats__chart-center')) {
            return; // Skip animation for the chart center - already set in HTML
        }
        
        if (!counter.classList.contains('counted')) {
            counter.classList.add('counted');
            animateCounter(counter, target);
        }
    });
} 