// Smooth scrolling for navigation links
document.querySelectorAll('#main-navbar .nav-link').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - (document.querySelector('#main-navbar').offsetHeight || 0),
                behavior: 'smooth'
            });
        }

        // Close navbar on link click for small screens
        const navbarCollapse = document.getElementById('navbarNav');
        if (navbarCollapse.classList.contains('show')) {
            new bootstrap.Collapse(navbarCollapse).hide();
        }
    });
});

// Navbar active state on scroll and shrink effect
const mainNavbar = document.getElementById('main-navbar');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('#main-navbar .nav-link');

window.addEventListener('scroll', () => {
    // Navbar shrink effect
    if (window.scrollY > 50) {
        mainNavbar.classList.add('navbar-scrolled');
    } else {
        mainNavbar.classList.remove('navbar-scrolled');
    }

    // Highlight active navigation link
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - (mainNavbar.offsetHeight || 0);
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - sectionHeight / 3) { // Adjusted offset
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Dark/Light mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const htmlElement = document.documentElement; // Target the <html> tag

function applyTheme(theme) {
    htmlElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
        darkModeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    } else {
        darkModeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
    }
}

darkModeToggle.addEventListener('click', function() {
    const currentTheme = htmlElement.getAttribute('data-bs-theme');
    if (currentTheme === 'dark') {
        applyTheme('light');
    } else {
        applyTheme('dark');
    }
});

// Apply saved theme on load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // If no preference saved, check OS preference
        applyTheme('dark');
    } else {
        applyTheme('light'); // Default to light if no preference and no OS dark mode
    }

    displayProjects(); // Call displayProjects here after theme is set

    portfolioFilters.forEach(button => {
        button.addEventListener('click', function() {
            portfolioFilters.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            displayProjects(this.dataset.filter);
        });
    });

    scrollReveal(); // Initial call for any static elements or elements not handled by displayProjects

    // New typewriter logic
    const nameElement = document.getElementById('animated-name');
    const subtitleElement = document.getElementById('animated-subtitle');
    const nameText = "Muhammad Ahsan";
    const subtitleText = "Focused on performance, functionality, and clean development.";

    if (nameElement && subtitleElement) {
        setTimeout(() => {
            typewriterEffect(nameElement, nameText, 80, () => {
                typewriterEffect(subtitleElement, subtitleText, 50);
            });
        }, 1000); // 1-second delay after page load
    }

    // Contact Form AJAX Submission
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const form = e.target;
            const data = new FormData(form);
            const action = form.action;

            formStatus.innerHTML = 'Sending...';
            formStatus.className = 'mt-3 text-info';

            fetch(action, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    formStatus.innerHTML = "Thank you! Your message has been sent.";
                    formStatus.className = 'mt-3 text-success';
                    form.reset();
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            formStatus.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            formStatus.innerHTML = "Oops! There was a problem submitting your form.";
                        }
                        formStatus.className = 'mt-3 text-danger';
                    })
                }
            }).catch(error => {
                formStatus.innerHTML = "Oops! There was a problem submitting your form.";
                formStatus.className = 'mt-3 text-danger';
            });
        });
    }
});

// Scroll Reveal Animation
// const revealElements = document.querySelectorAll('.reveal'); // Removed global declaration

const scrollReveal = () => {
    const revealElements = document.querySelectorAll('.reveal'); // Re-query elements each time
    const windowHeight = window.innerHeight;
    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;

        if (elementTop < windowHeight - 100) { // Adjust 100px as needed for when animation triggers
            setTimeout(() => {
                el.classList.add('active');
            }, delay);
        } else {
            // Optional: remove 'active' class when out of view to re-animate on scroll back up
            // el.classList.remove('active');
        }
    });
};

window.addEventListener('scroll', scrollReveal);
// document.addEventListener('DOMContentLoaded', scrollReveal); // This call is now redundant as displayProjects calls it

// Reusable Typewriter effect
function typewriterEffect(element, text, speed, callback) {
    let i = 0;
    element.innerHTML = ""; // Ensure element is empty
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }
    type();
}

// Dynamically populate projects
const projects = [
    {
        title: 'Product Crud Application',
        description: 'A PHP CRUD app for product management with search, pagination, and import/export.',
        image: 'images/product.png',
        category: 'web',
        githubRepo: 'https://github.com/Ahsan340/php-product-crud-app'
    },
    {
        title: 'Lawyers Php',
        description: 'An PHP-based lawyers website with an admin panel for CRUD operations.',
        image: 'images/law.png',
        category: 'web',     
        githubRepo: 'https://github.com/Ahsan340/php_lawyers'
    },
    {
        title: 'E-commerce cozastore',
        description: 'An e-commerce online shopping store with adminpanel made with php.',
        image: 'images/coza.png',
        category: 'web',
        githubRepo: 'https://github.com/Ahsan340/php_mini_pro'
    },
    {
        title: 'Laravel crud',
        description: 'A basic laravel crud can add title and posts edit or delete also.',
        image: 'images/crud.png',
        category: 'web', 
        githubRepo: 'https://github.com/Ahsan340/laravel-crud'
    },
        {
            title: 'Portfolio Website',
            description: 'My personl ui design portfolio made with html,css,js including dark mode',
            image: 'images/portfolio.png',
            category: 'design',
            githubRepo: 'https://github.com/Ahsan340/my_portfolio'
        },
        {
            title: 'ABCD Mall Online',
            description: 'An online mall website for booking movie tickets and see information with adminpanel control made with .net',
            image: 'https://via.placeholder.com/400x300/d4edda/28a745?text=Mobile+App',
            category: 'web',
            githubRepo: 'https://github.com/Ahsan340/ABCD-Mall.net'
        }
        // {
        //     title: 'Data Visualization Project',
        //     description: 'Interactive data visualization using D3.js.',
        //     image: 'https://via.placeholder.com/400x300/fff3cd/ffc107?text=Data+Viz',
        //     category: 'other',
        //     liveDemo: '#',
        //     githubRepo: '#'
        // }
];

const projectsGrid = document.querySelector('.portfolio-grid');
const portfolioFilters = document.querySelectorAll('.portfolio-filter');

function displayProjects(filter = 'all') {
    projectsGrid.innerHTML = ''; // Clear current projects
    const filteredProjects = filter === 'all' ? projects : projects.filter(project => project.category === filter);

    filteredProjects.forEach((project, index) => {
        const projectItem = document.createElement('div');
        // Apply Bootstrap grid classes and custom class for filtering/animation
        projectItem.classList.add('col-md-6', 'col-lg-4', 'portfolio-item', project.category, 'reveal', 'fade-in-up');
        // Add delay based on index for staggered animation
        projectItem.dataset.delay = index * 100;

        projectItem.innerHTML = `
            <div class="card h-100 shadow-sm portfolio-card">
                <img src="${project.image}" class="card-img-top" alt="${project.title}">
                <div class="card-body">
                    <h5 class="card-title fw-bold">${project.title}</h5>
                    <p class="card-text">${project.description}</p>
                    <div class="d-flex justify-content-center mt-3">
                        ${project.liveDemo ? `<a href="${project.liveDemo}" class="btn btn-sm btn-primary rounded-pill me-2" target="_blank">Live Demo <i class="fas fa-external-link-alt ms-1"></i></a>` : ''}
                        ${project.githubRepo ? `<a href="${project.githubRepo}" class="btn btn-sm btn-outline-secondary rounded-pill" target="_blank">GitHub <i class="fab fa-github ms-1"></i></a>` : ''}
                    </div>
                </div>
            </div>
        `;
        projectsGrid.appendChild(projectItem);
    });
    scrollReveal(); // Call scrollReveal after all projects are appended
} 
