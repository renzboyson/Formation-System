document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const tabLogin = document.getElementById('tab-login');
    const tabSignup = document.getElementById('tab-signup');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const linkSignup = document.getElementById('link-signup');
    const linkLogin = document.getElementById('link-login');
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    // Form Toggling Logic
    function showLoginForm(e) {
        if(e) e.preventDefault();
        tabLogin.classList.add('active');
        tabSignup.classList.remove('active');
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    }

    function showSignupForm(e) {
        if(e) e.preventDefault();
        tabSignup.classList.add('active');
        tabLogin.classList.remove('active');
        signupForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    }

    tabLogin.addEventListener('click', showLoginForm);
    linkLogin.addEventListener('click', showLoginForm);
    
    tabSignup.addEventListener('click', showSignupForm);
    linkSignup.addEventListener('click', showSignupForm);

    // Navigating to Auth Section
    const navLoginBtns = [
        document.getElementById('nav-login-btn'),
        document.getElementById('mobile-nav-login-btn'),
        document.getElementById('hero-cta-btn')
    ];

    navLoginBtns.forEach(btn => {
        if(btn) {
            btn.addEventListener('click', () => { setTimeout(showLoginForm, 50); });
        }
    });

    // Mobile Menu Toggle
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
        });
    }

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNav) mobileNav.classList.remove('active');
        });
    });

    // Simple Form Validation Prevention
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Login submitted.');
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Sign up submitted.');
        });
    }
});
