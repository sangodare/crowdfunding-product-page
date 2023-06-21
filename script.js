'use strict';

const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const overlay = document.querySelector('.overlay');
const nav = document.querySelector('.nav');
const backProjectBtn = document.querySelector('.back-project');
const rewardBtns = document.querySelectorAll('.reward-btn');
const selectionModal = document.querySelector('.selection-modal');
const numInputs = document.querySelectorAll('input[type=number]');
const closeModal = document.querySelector('.close-modal');
const checkboxInputs = document.querySelectorAll('input[type=checkbox]');
const continueBtns = document.querySelectorAll('.continue-btn');
const thanksModal = document.querySelector('.thanks-modal');
const gotItBtn = document.querySelector('.got-it-btn');
const progress = document.querySelector('.progress');
const amountRaised = document.querySelector('.amount');
const backers = document.getElementById('num-of-backers');
const progressBar = document.querySelector('.progress-bar-filled');
const bookmarkContainer = document.querySelector('.bookmark');
const bookmarkSvg = document.querySelector('.bookmark-svg');
const bookmarkButton = document.querySelector('.bookmark-btn');

let bookmarked;
const dataObj = {};


//Functions

//overlay toggle
function displayOverlay() {
    overlay.classList.remove('overlay-hidden');
    document.body.style.overflow = 'hidden';
};

function hideOverlay() {
    overlay.classList.add('overlay-hidden');
    document.body.style.overflow = 'scroll';
};

//Mobile menu toggle
function toggleMenu() {
    const visibility = nav.getAttribute('data-visible');
    
    if(visibility === 'false') {
        mobileNavToggle.setAttribute('aria-expanded', true);
        nav.setAttribute('data-visible', true);
        closeSelectionModal();
        hideThanksModal();
        displayOverlay();
    } else {
        mobileNavToggle.setAttribute('aria-expanded', false);
        nav.setAttribute('data-visible', false);
        hideOverlay();
    }
};

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

function bookmark() {
    bookmarkSvg.classList.add('bookmarked');
    bookmarkButton.textContent = 'Bookmarked';
    bookmarkButton.classList.add('bookmarked-btn');
    bookmarked = true;
};

function unbookmark() {
    bookmarkSvg.classList.remove('bookmarked');
    bookmarkButton.textContent = 'Bookmark';
    bookmarkButton.classList.remove('bookmarked-btn');
    bookmarked = false;
}


function bookmarkToggle() {
    bookmarkContainer.classList.toggle('toggler');

    if (bookmarkContainer.classList.contains('toggler'))  bookmark();

    if(!bookmarkContainer.classList.contains('toggler')) unbookmark();

    dataObj.bookmarked = bookmarked;

    localStorage.setItem('data', JSON.stringify(dataObj));
       
};

function displaySelectionModal() {
    displayOverlay();
    selectionModal.classList.remove('hidden');
    
};

function closeSelectionModal() {
    hideOverlay();
    selectionModal.classList.add('hidden');
    resetPledge();
};

function displayStand(element) {
    element.classList.add('modal-stand--active');
    element.querySelector('.pledging').classList.remove('hidden');
    element.querySelector('.stand-content').classList.remove('border');
};

function hideStand(element) {
    element.classList.remove('modal-stand--active');
    element.querySelector('.pledging').classList.add('hidden');
    element.querySelector('.stand-content').classList.add('border');
};

function resetPledge() {
    checkboxInputs.forEach(checkbox => {
        const checkboxParentEl = checkbox.closest(`.modal-stand--${checkbox.dataset.input}`);
        checkbox.checked = false;
        hideStand(checkboxParentEl);
    });
};

function displayRewardSelected(e) {
    e.preventDefault();
    if(e.target.classList.contains('out-of-stock-bg')) return;
  
    const id = e.target.getAttribute('href');
    const dataNum = e.target.dataset.reward;
    const reward = document.querySelector(id);

    displaySelectionModal();
    reward.scrollIntoView({behavior: 'smooth'});
    reward.querySelector(`.input--${dataNum}`).checked = true;
    displayStand(reward);
};

function selectPledge(e) {
    const clicked = e.target;
    const allCheckboxInputs = clicked.closest('.selection-modal').querySelectorAll('.input');
    const inputParentEl = clicked.closest(`.modal-stand--${clicked.dataset.input}`);

    allCheckboxInputs.forEach(checkbox => {
        const checkboxParentEl = checkbox.closest(`.modal-stand--${checkbox.dataset.input}`);

        if(clicked.classList.contains('input--4')) return;
    
        if(checkbox !== clicked) checkbox.checked = false;

        if(checkbox.checked === false) hideStand(checkboxParentEl);
        
        if(clicked.checked === true) displayStand(inputParentEl);
    
    });

};

//to restrict amount entered as pledge
function restrictNumInput() {
    this.value = this.valueAsNumber;
    if(this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);
};

function updateBackers() {
    let currentBackers = backers.textContent.replaceAll(',', '');
    const numOfBackers = ++currentBackers;
    const formattedNum = new Intl.NumberFormat(navigator.language, {style: 'decimal'}).format(numOfBackers);

    dataObj.formattedNumOfBackers = formattedNum,
    
    localStorage.setItem('data', JSON.stringify(dataObj));
    backers.textContent = `${formattedNum}`;
};

function updateAmountRaised(input) {
    let currentAmountRaised = amountRaised.textContent.replaceAll(',', '');
    const inputAmount = +input.value
    const updatedAmount =  +currentAmountRaised + inputAmount;
    const formattedAmount = new Intl.NumberFormat(navigator.language, {style: 'decimal'}).format(updatedAmount);

    dataObj.formattedAmountRaised = formattedAmount;
    localStorage.setItem('data', JSON.stringify(dataObj));
    amountRaised.textContent = `${formattedAmount}`;
};

function updateProgressBar() {
    const data = JSON.parse(localStorage.getItem('data'));
    const figureRaised = data?.formattedAmountRaised || amountRaised.textContent.replaceAll(',', '');
    const percent = (+figureRaised / 100000) * 100;
    progressBar.style.flexBasis = `${percent}%`;
};

function getData() {
    const data = JSON.parse(localStorage.getItem('data'));
    backers.textContent = data?.formattedNumOfBackers || backers.textContent;
    amountRaised.textContent = data?.formattedAmountRaised || amountRaised.textContent;
    updateProgressBar();

    if(data?.bookmarked === true) {
        bookmarkContainer.classList.add('toggler');
        bookmark();
    }
};

function updateProgress(e) {
    const parentEl = e.target.closest('.pledging');
    const input = document.querySelector(`.pledge-input--${e.target.dataset.tab}`);

    if(input?.value == null) {
        closeSelectionModal();
        displayThanksModal();
        updateBackers();
    };

    if(input?.value != null) {
        if(input.value === '' || +input.value < +input.min || +input.value > +input.max) {
            const html = `<p class="margin-top error-msg">Your pledge should be between ${input.min} and ${input.max}</p>`
    
            if(parentEl.querySelector('.error-msg') != null) return;
            parentEl.insertAdjacentHTML('beforeend', html);
    
            setTimeout(() => parentEl.querySelector('p').remove(), 3000);  
        };

        updateBackers();
        updateAmountRaised(input);
        updateProgressBar();
        closeSelectionModal();
        displayThanksModal();
    };
    
};

function displayThanksModal() {
    displayOverlay();
    thanksModal.classList.remove('hidden');
};

function hideThanksModal() {
    hideOverlay();
    thanksModal.classList.add('hidden');
};

function scrollToProgressSection() {
    progress.scrollIntoView({behavior: 'smooth'});
}


//Event listeners
mobileNavToggle.addEventListener('click', toggleMenu);

nav.addEventListener('mouseover', linkHighlighter.bind(0.5));

nav.addEventListener('mouseout', linkHighlighter.bind(1));

bookmarkContainer.addEventListener('click', bookmarkToggle);

backProjectBtn.addEventListener('click', displaySelectionModal);

rewardBtns.forEach(rewardBtn => rewardBtn.addEventListener('click', displayRewardSelected));

checkboxInputs.forEach(checkbox => checkbox.addEventListener('click', selectPledge));

numInputs.forEach(numInput => numInput.addEventListener('input', restrictNumInput));

closeModal.addEventListener('click', closeSelectionModal);

continueBtns.forEach(continueBtn => continueBtn.addEventListener('click', updateProgress));

gotItBtn.addEventListener('click', () => {
    hideThanksModal();
    scrollToProgressSection();
});

document.addEventListener('DOMContentLoaded', getData);