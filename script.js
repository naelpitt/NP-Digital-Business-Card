'use strict';

// CONTENTS //

// TOGGLE NIGHTMODE / DAYMODE
// DETECT THEME PREFERENCE
// PHOTO SWIPPER
// MAIN FILTER MENU FUNCTIONALITY
// SECONDARY FILTER MENU FUNCTIONALITY
// skill ROTATION

//                            //
//                            //
// TOGGLE NIGHTMODE / DAYMODE //
//                            //
//                            //

const toggle = document.querySelector(`.toggle-container`);
const body = document.querySelector(`body`);

const applyTheme = function (theme) {
  const isDark = theme === 'dark';
  body.classList.toggle(`dark`, isDark);
  if (toggle) {
    toggle.classList.toggle(`dark`, isDark);
  }
  localStorage.setItem(`theme`, theme);
};

if (toggle) {
  toggle.addEventListener(`click`, function () {
    const nextTheme = body.classList.contains(`dark`) ? `light` : `dark`;
    applyTheme(nextTheme);
  });
}

//                         //
//                         //
// DETECT THEME PREFERENCE //
//                         //
//                         //

function detectColorScheme() {
  const storedTheme = localStorage.getItem(`theme`);

  if (storedTheme === `dark` || storedTheme === `light`) {
    applyTheme(storedTheme);
    return;
  }

  if (!window.matchMedia) {
    return false;
  }

  if (window.matchMedia(`(prefers-color-scheme: dark)`).matches) {
    applyTheme(`dark`);
    return;
  }

  applyTheme(`light`);

  window
    .matchMedia(`(prefers-color-scheme: dark)`)
    .addEventListener(`change`, function (event) {
      applyTheme(event.matches ? `dark` : `light`);
    });
}
detectColorScheme();

//               //
//               //
// PHOTO SWIPPER //
//               //
//               //

const slides = document.querySelectorAll(`.slide`);
const buttonLeft = document.querySelector(`.slider-btn--left`);
const buttonRight = document.querySelector(`.slider-btn--right`);
const dotContainer = document.querySelector(`.dots`);

if (!slides.length) {
  throw new Error(`No slides found on the page.`);
}

let currentSlide = Math.floor(Math.random() * slides.length);
const maxSlide = slides.length;

const createDots = function () {
  slides.forEach(function (slide, index) {
    dotContainer.insertAdjacentHTML(
      `beforeend`,
      `<button  class="dots--dot" data-slide="${index}" aria-label="photo-${
        index + 1
      }"></button>`
    );
  });
};


const activeDot = function (slide) {
  document
    .querySelectorAll(`.dots--dot`)
    .forEach(dot => dot.classList.remove(`dots--dot--active`));
  document
    .querySelector(`.dots--dot[data-slide="${slide}"]`)
    .classList.add(`dots--dot--active`);
};

const goToSlide = function (slideNumber) {
  slides.forEach(
    (slide, index) =>
      (slide.style.transform = `translateX(${100 * (index - slideNumber)}%)`)
  );
};

const nextSlide = function () {
  if (currentSlide === maxSlide - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  goToSlide(currentSlide);
  activeDot(currentSlide);
};

const previousSlide = function () {
  if (currentSlide === 0) {
    currentSlide = maxSlide - 1;
  } else {
    currentSlide--;
  }
  goToSlide(currentSlide);
  activeDot(currentSlide);
};

const init = function () {
  goToSlide(0);
  createDots();
  activeDot(0);
};
init();

buttonLeft.addEventListener(`click`, previousSlide);
buttonRight.addEventListener(`click`, nextSlide);
dotContainer.addEventListener(`click`, function (event) {
  if (event.target.classList.contains(`dots--dot`)) {
    currentSlide = Number(event.target.dataset.slide);
    goToSlide(currentSlide);
    activeDot(currentSlide);
  }
});

//                                //
//                                //
// MAIN FILTER MENU FUNCTIONALITY //
//                                //
//                                //

const filterMain = document.querySelectorAll(`.filter`);
const filterContainerMain = document.querySelector(`.filters-container-main`);
const learnMoreButton = document.getElementById(`btn-learn-more`);

const cardIntro = document.querySelector(`.card--intro`);
const cardSpotify = document.querySelector(`.card--spotify`);
const cardPhotos = document.querySelector(`.card--photos`);
const cardSkills = document.querySelector(`.card--skills`);
const cardProj = document.querySelector(`.card--proj`);
const cardGithub = document.querySelector(`.card--github`);
const cardLinkedin = document.querySelector(`.card--linkedin`);
const cardClock = document.querySelector(`.card--clock`);
const introTextAll = document.getElementById(`intro-text-all`);
const introTextAbout = document.getElementById(`intro-text-about`);
const introTextContent = document.querySelectorAll(`.intro-text-content`);

const updateLearnMoreVisibility = function (filterValue) {
  if (!learnMoreButton) return;

  const isProfileView = filterValue === `about`;
  learnMoreButton.classList.toggle(`is-hidden`, isProfileView);
  learnMoreButton.disabled = isProfileView;
  learnMoreButton.setAttribute(`aria-hidden`, String(isProfileView));
  learnMoreButton.setAttribute(`tabindex`, isProfileView ? `-1` : `0`);
};

const updateCardIds = function (filterValue) {
  const cards = [
    { element: cardIntro, base: `card--intro` },
    { element: cardSpotify, base: `card--spotify` },
    { element: cardPhotos, base: `card--photos` },
    { element: cardSkills, base: `card--skills` },
    { element: cardProj, base: `card--proj` },
    { element: cardGithub, base: `card--github` },
    { element: cardLinkedin, base: `card--linkedin` },
    { element: cardClock, base: `card--clock` },
  ];

  cards.forEach(({ element, base }) => {
    if (element) {
      element.setAttribute(`id`, `${base}--${filterValue}`);
    }
  });
};

filterContainerMain.addEventListener(`click`, function (event) {
  const clicked = event.target.closest(`.filter`);
  if (!clicked) return;
  filterMain.forEach(filter => filter.classList.remove(`active`));
  clicked.classList.add(`active`);
  updateCardIds(clicked.dataset.filter);
  updateLearnMoreVisibility(clicked.dataset.filter);

  // CHANGE PHOTO ON FILTER CHANGE
  const randomSlide = Math.floor(Math.random() * maxSlide);
  goToSlide(randomSlide);
  activeDot(randomSlide);
  // CHANGE INTRO CARD ON FILTER CHANGE
  if (clicked.dataset.filter === `about`) {
    introTextContent.forEach(element =>
      element.classList.remove(`intro-text--active`)
    );
    introTextAbout.classList.add(`intro-text--active`);
  } else {
    introTextContent.forEach(element =>
      element.classList.remove(`intro-text--active`)
    );
    introTextAll.classList.add(`intro-text--active`);
  }
});

updateLearnMoreVisibility(`all`);


//                  //
//                  //
// completed //  CHANGE SHOE
//                  //
//                  //

const projContainer = document.querySelector(`.proj-container`);
const projView = document.querySelectorAll(`.proj-view`);
const shoeImage = document.querySelectorAll(`.proj-view-image`);

const projRotation = function () {
  if (!projContainer || !projView.length || !shoeImage.length) return;

  projContainer.addEventListener(`click`, function (event) {
    const clicked = event.target.closest(`.proj-view`);
    if (!clicked) return;
    // REMOVE ACTIVE CLASS
    projView.forEach(shoe =>
      shoe.classList.remove(`proj-view--active`)
    );
    shoeImage.forEach(image =>
      image.classList.remove(`proj-view-image--active`)
    );
    // ADD ACTIVE CLASS
    clicked.classList.add(`proj-view--active`);
    const activeImage = document.querySelector(
      `.proj-view-image--${clicked.dataset.shoe}`
    );
    if (activeImage) {
      activeImage.classList.add(`proj-view-image--active`);
    }
  });
};
projRotation();

//                                     //
//                                     //
// donate  //
//                                     //
//                                     //


function updateTime() {
  const timeElement = document.getElementById('time');
  const dayElement = document.getElementById('day');
  const dateElement = document.getElementById('date');
  const greetingElement = document.getElementById('greeting');

  if (!timeElement || !dayElement || !dateElement) return;

  const now = new Date();
  const timeString = now.toLocaleTimeString('en-GB', { hour12: false });
  const dayString = now.toLocaleDateString('en-GB', { weekday: 'long' });
  const dateString = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });

  timeElement.textContent = timeString;
  dayElement.textContent = dayString;
  dateElement.textContent = dateString;

  const hours = now.getHours();
  let greeting;
  if (hours < 12) {
    greeting = 'Good Morning!';
  } else if (hours < 18) {
    greeting = 'Good Afternoon!';
  } else {
    greeting = 'Good Evening!';
  }

  if (greetingElement) {
    greetingElement.textContent = greeting;
  }
}

setInterval(updateTime, 1000);
updateTime();



//                                     //
//                                     //
// SECONDARY FILTER MENU FUNCTIONALITY //
//                                     //
//                                     //

const filterSecondary = document.querySelectorAll(`.filter-secondary`);
const filterContainerSecondary = document.querySelector(
  `.filters-container-secondary`
);
const filterSecondaryContent = document.querySelectorAll(
  `.filter-secondary-content`
);

const defaultSecondaryFilter = filterSecondary[0];
if (defaultSecondaryFilter) {
  defaultSecondaryFilter.classList.add(`active`, `filter-secondary--active`);
  const defaultPanel = document.querySelector(
    `.filter-content--${defaultSecondaryFilter.dataset.filter}`
  );
  if (defaultPanel) {
    defaultPanel.classList.add(`filter-content--active`);
  }
}

if (filterContainerSecondary) {
  filterContainerSecondary.addEventListener(`click`, function (event) {
    const clicked = event.target.closest(`.filter-secondary`);
    if (!clicked) return;
    filterSecondary.forEach(filter => {
      filter.classList.remove(`active`, `filter-secondary--active`);
    });
    filterSecondaryContent.forEach(filter =>
      filter.classList.remove(`filter-content--active`)
    );
    clicked.classList.add(`active`, `filter-secondary--active`);
    const targetPanel = document.querySelector(
      `.filter-content--${clicked.dataset.filter}`
    );
    if (targetPanel) {
      targetPanel.classList.add(`filter-content--active`);
    }
  });
}
