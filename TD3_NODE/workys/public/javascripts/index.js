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

const mainOverlayBg = document.querySelector('#modal_overlay_bg');
        
const modal = {
    title : document.querySelector('#modal_title'),
    organization : document.querySelector('#modal_org'),
    description : document.querySelector('#modal_desc'),
}

const closeAnnonceModal = () => {
    mainOverlayBg.classList.remove('active');
    mainOverlay.classList.remove('active');
}

const openAnnonceModal = (annonce) => {
    mainOverlayBg.classList.toggle('active');
    mainOverlay.classList.toggle('active');

    modal.title.innerHTML = annonce.title;
    modal.description.innerHTML = annonce.description;
    modal.organization.innerHTML = `par ${annonce.org_name}`;
    
    formField.action = `/offreemploi/${annonce.id}/apply`
}

const setPage = (index) => {
    window.history.replaceState(null, null, '?p=' + index);
}
const modifyPage = (offset) => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('p') || 0;

    setPage(Number(pageParam) + offset)
    asyncAnnoncesFetch();
}