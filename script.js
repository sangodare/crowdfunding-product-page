'use strict';
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const overlay = document.querySelector('.overlay');
const nav = document.querySelector('.nav');

//overlay toggle
function displayOverlay() {
    overlay.classList.remove('hidden');
};

function hideOverlay() {
    overlay.classList.add('hidden');
};

//Mobile menu toggle
function toggleMenu() {
    const visibility = nav.getAttribute('data-visible');
    
    if(visibility === 'false') {
        mobileNavToggle.setAttribute('aria-expanded', true);
        nav.setAttribute('data-visible', true);
        displayOverlay()
    } else {
        mobileNavToggle.setAttribute('aria-expanded', false);
        nav.setAttribute('data-visible', false);
        hideOverlay();
    }
};

mobileNavToggle.addEventListener('click', toggleMenu);

//menu link fade, when a menu link is hovered other menu links fade
function linkHighlighter(e) {
    if (e.target.classList.contains('nav__link')) {
        const hoveredLink = e.target;
        const siblings = hoveredLink.closest('.nav').querySelectorAll('.nav__link');
        siblings.forEach(link => {
            if(hoveredLink != link) link.style.opacity = this
        });
    }
};

nav.addEventListener('mouseover', linkHighlighter.bind(0.5));
nav.addEventListener('mouseout', linkHighlighter.bind(1));
