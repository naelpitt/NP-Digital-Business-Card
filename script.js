'use strict';

// CONTENTS //

// MAP BOX API
// TOGGLE NIGHTMODE / DAYMODE
// DETECT THEME PREFERENCE
// PHOTO SWIPPER
// MAIN FILTER MENU FUNCTIONALITY
// SECONDARY FILTER MENU FUNCTIONALITY
// skill ROTATION

//             //
//             //
// MAP BOX API //
//             //
//             //

mapboxgl.accessToken =
  'pk.eyJ1IjoibmFlbHBpdHQiLCJhIjoiY211OTNhYjZ6MTAyOTJ3czJ5cGIwNGxwayJ9.r9-2yGC0FYDVz61zzLH7dg';
const latitude = 54.975170;
const longitude = -1.622539;
const coords = [longitude, latitude];

let mapStyle;
let mapTheme;
let mapInstance = null;

const setMapStyle = function () {
  return document.body.classList.contains(`dark`) ? `dark-v10` : `light-v10`;
};

const setMapTheme = function () {
  return `mapbox://styles/mapbox/${setMapStyle()}`;
};

const mapZoom = getComputedStyle(document.body).getPropertyValue(
  '--mapbox-zoom'
);
const mapIconSize = getComputedStyle(document.body).getPropertyValue(
  `--mapbox-icon-size`
);

const mobileDevice = Number(
  getComputedStyle(document.body)
    .getPropertyValue(`--mobile-device`)
    .trim()
);

function applyMapCorners() {
  const mapCanvas = document.querySelector('#map .mapboxgl-canvas');
  const mapContainer = document.querySelector('#map .mapboxgl-map');
  const mapWrap = document.querySelector('#map');

  if (mapWrap) {
    mapWrap.style.borderRadius = '32px';
    mapWrap.style.overflow = 'hidden';
  }

  if (mapContainer) {
    mapContainer.style.setProperty('border-radius', '32px', 'important');
    mapContainer.style.setProperty('overflow', 'hidden', 'important');
  }

  if (mapCanvas) {
    mapCanvas.style.setProperty('border-radius', '32px', 'important');
    mapCanvas.style.setProperty('overflow', 'hidden', 'important');
    mapCanvas.style.setProperty('clip-path', 'inset(0 round 32px)', 'important');
  }
}

function setupMap(coords) {
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }

  const map = new mapboxgl.Map({
    container: 'map',
    style: setMapTheme(),
    attributionControl: false,
    center: coords,
    zoom: mapZoom,
  });

  mapInstance = map;
  map.dragRotate.disable();
  map.touchPitch.disable();
  if (mobileDevice === 1) {
    map.dragPan.disable();
    map.scrollZoom.disable();
    map.doubleClickZoom.disable();
    map.touchZoomRotate.disable();
  }

  map.on('load', () => {
    applyMapCorners();

    map.loadImage('img/bitmoji.png', (error, image) => {
      if (error) throw error;
      map.addImage('memoji', image);
      map.addSource('point', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [longitude, latitude],
              },
            },
          ],
        },
      });
      map.addLayer({
        id: 'points',
        type: 'symbol',
        source: 'point',
        layout: {
          'icon-image': 'memoji',
          'icon-size': Number(mapIconSize),
        },
      });
    });
  });
}
setupMap(coords);

//                     //
// MAP ZOOM IN AND OUT //
//                     //

const zoomIn = document.querySelector(`.zoom-btn--in`);
const zoomOut = document.querySelector(`.zoom-btn--out`);

let currentZoom = 0;

//                            //
//                            //
// TOGGLE NIGHTMODE / DAYMODE //
//                            //
//                            //

const toggle = document.querySelector(`.toggle-container`);
const body = document.querySelector(`body`);
const card = document.querySelector(`.card`);

const applyTheme = function (theme) {
  const isDark = theme === 'dark';
  body.classList.toggle(`dark`, isDark);
  toggle.classList.toggle(`dark`, isDark);
  localStorage.setItem(`theme`, theme);
  setupMap(coords);
};

toggle.addEventListener(`click`, function () {
  const nextTheme = body.classList.contains(`dark`) ? `light` : `dark`;
  applyTheme(nextTheme);
});

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
const cardMap = document.querySelector(`.card--map`);
const cardPhotos = document.querySelector(`.card--photos`);
const cardSkills = document.querySelector(`.card--skills`);
const cardLearning = document.querySelector(`.card--learning`);
const cardProj = document.querySelector(`.card--proj`);
const cardGithub = document.querySelector(`.card--github`);
const cardLinkedin = document.querySelector(`.card--linkedin`);
const cardRyos = document.querySelector(`.card--ryos`);
const cardRecipely = document.querySelector(`.card--recipely`);
const cardClock = document.querySelector(`.card--clock`);
const introTextAll = document.getElementById(`intro-text-all`);
const introTextAbout = document.getElementById(`intro-text-about`);
const introTextContent = document.querySelectorAll(`.intro-text-content`);

const refreshMapLayout = function () {
  if (!mapInstance) return;

  requestAnimationFrame(() => {
    mapInstance.resize();
  });
};

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
    { element: cardMap, base: `card--map` },
    { element: cardPhotos, base: `card--photos` },
    { element: cardSkills, base: `card--skills` },
    { element: cardLearning, base: `card--learning` },
    { element: cardProj, base: `card--proj` },
    { element: cardGithub, base: `card--github` },
    { element: cardLinkedin, base: `card--linkedin` },
    { element: cardRyos, base: `card--ryos` },
    { element: cardRecipely, base: `card--recipely` },
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
  refreshMapLayout();

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

// Set the default active secondary filter on page load
const defaultSecondaryFilter = filterSecondary[0]; // Assuming the first filter is the default
if (defaultSecondaryFilter) {
  defaultSecondaryFilter.classList.add(`active`);
  document
    .querySelector(`.filter-content--${defaultSecondaryFilter.dataset.filter}`)
    .classList.add(`filter-content--active`);
}

filterContainerSecondary.addEventListener(`click`, function (event) {
  const clicked = event.target.closest(`.filter-secondary`);
  if (!clicked) return;
  filterSecondary.forEach(filter => filter.classList.remove(`active`));
  filterSecondaryContent.forEach(filter =>
    filter.classList.remove(`filter-content--active`)
  );
  clicked.classList.add(`active`);
  document
    .querySelector(`.filter-content--${clicked.dataset.filter}`)
    .classList.add(`filter-content--active`);
});
