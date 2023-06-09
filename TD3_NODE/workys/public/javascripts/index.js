let mainOverlay = document.querySelector('#main_overlay');
let navigataionBar = document.querySelector('.nav_sidebar');
let navigationToggle = document.querySelector('#burger_icon');
let navigationUntoggle = document.querySelector('#exit_nav');

const showLateralMenu = () => {
    navigataionBar.classList.toggle('w-25')
    mainOverlay.classList.toggle('active')
}

const hideLateralMenu = () => {
    navigataionBar.classList.remove('w-25')
    mainOverlay.classList.remove('active')
}

navigationToggle.addEventListener('click', showLateralMenu);
navigationUntoggle.addEventListener('click', hideLateralMenu);
mainOverlay.addEventListener('click', hideLateralMenu);