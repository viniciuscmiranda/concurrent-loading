let maxQuantity = 100000;
let maxTimeOut = 2000;
let maxStores = 20;
let storesDelay = 500;
let intervalsDelay = 500;
let blockSizes = 100;
let stores = [];

function setStores(size = 3) {
  const pre = [
    'Ampha',
    'Bisha',
    'Charma',
    'Drago',
    'Embo',
    'Farfe',
    'Gyra',
    'Hitmo',
    'Ivy',
    'Jo',
    'Kada',
    'La',
    'Ma',
    'Nido',
    'Oddi',
    'Pachi',
    'Qui',
    'Rai',
    'Sala',
    'Toge',
    'Ursa',
    'Veno',
    'Wobbu',
    'Xerne',
    'Yeve',
    'Zoro',
  ];

  const suf = [
    'ros',
    'rp',
    'nder',
    'tch\'d',
    'ar',
    'dos',
    'nlee',
    'saur',
    'lteon',
    'bra',
    'tios',
    'gmar',
    'nite',
    'king',
    'sh',
    'risu',
    'lava',
    'chu',
    'mence',
    'pi',
    'ring',
    'moth',
    'fet',
    'neas',
    'letal',
    'ak',
  ];

  stores = [...Array(Math.min(size))].map(() => {
    const preindex = parseInt(Math.random() * pre.length);
    const sufindex = parseInt(Math.random() * suf.length);

    const store = {
      id: id(),
      name: pre[preindex] + suf[sufindex],
      quantity: parseInt((Math.random() * maxQuantity)),
    }

    return store;
  })
}

function id(size = 3) {
  const ids = [...Array(size).keys()].map(() =>
    Math.random().toString(16).slice(2)
  );

  return ids.join('-');
};

const intervals = {};
function wait(timeout, id) {
  return new Promise((resolve, reject) => {
    const interval = setTimeout(() => {
      if (Math.random() < .9999) resolve();
      else reject();
    }, timeout);
    intervals[id] = interval;
  });
}

function draw(store, perc, status = 'loading') {
  let loaded =
    `${parseInt(store.quantity * perc / 100)}/${store.quantity}`;

  const html = `
    <p class="store-name">${store.name} (${loaded})</p>
    <div class="progress-empty">
      <div class="progress-container ${status}" style="width: ${perc}%"></div>
    </div>
  `;

  const elem = document.querySelector(`#progress_${store.id}`);
  elem.innerHTML = html;
}

function get() {
  clear();

  const loadings = {};
  stores.forEach((store, sIndex) => {
    draw(store, 0);
    const range = [...Array(Math.ceil(store.quantity / blockSizes)).keys()];

    loadings[store.id] = 0;
    range.forEach((interval, iIndex) => {
      const mill = ((Math.random() * maxTimeOut));
      const delay = mill + ((sIndex * storesDelay) + (iIndex * intervalsDelay));
      const id = `${store.id}_${interval}`;

      wait(delay, id).then(() => {
        const perc = ((++loadings[store.id]) / range.length * 100).toFixed(2);
        const status = perc >= 100 ? 'success' : 'loading';

        draw(store, perc, status);
      }).catch(() => {
        const perc = ((++loadings[store.id]) / range.length * 100).toFixed(2);

        draw(store, perc, 'fail');
        clear(store.id);
      });
    });
  });
}

function clear(store) {
  if (!store) {
    Object.keys(intervals)
      .forEach(key => clearInterval(intervals[key]));
  } else {
    Object.keys(intervals)
      .filter(key => key.includes(store))
      .forEach(key => clearInterval(intervals[key]))
  }
}

function init() {
  const storesInput = document.querySelector('#maxStores');
  const quantityInput = document.querySelector('#maxQuantity');
  const timeInput = document.querySelector('#maxTimeOut');
  const storesDelayInput = document.querySelector('#storesDelay');
  const intervalsDelayInput = document.querySelector('#intervalsDelay');
  const blockSizesInput = document.querySelector('#blockSizes');

  storesInput.defaultValue = localStorage.getItem('maxStores') || maxStores;
  quantityInput.defaultValue = localStorage.getItem('maxQuantity') || maxQuantity;
  timeInput.defaultValue = localStorage.getItem('maxTimeOut') || maxTimeOut;
  storesDelayInput.defaultValue = localStorage.getItem('storesDelay') || storesDelay;
  intervalsDelayInput.defaultValue = localStorage.getItem('intervalsDelay') || intervalsDelay;
  blockSizesInput.defaultValue = localStorage.getItem('blockSizes') || blockSizes;

  maxStores = parseInt(storesInput.value);
  maxQuantity = parseInt(quantityInput.value);
  maxTimeOut = parseInt(timeInput.value);
  storesDelay = parseInt(storesDelayInput.value);
  intervalsDelay = parseInt(intervalsDelayInput.value);
  blockSizes = parseInt(blockSizesInput.value);

  localStorage.setItem('maxStores', storesInput.value);
  localStorage.setItem('maxQuantity', quantityInput.value);
  localStorage.setItem('maxTimeOut', timeInput.value);
  localStorage.setItem('storesDelay', storesDelayInput.value);
  localStorage.setItem('intervalsDelay', intervalsDelayInput.value);
  localStorage.setItem('blockSizes', blockSizesInput.value);

  setStores(maxStores);
  clear();

  const container = document.querySelector('#container');
  container.innerHTML = '';

  stores.forEach(store => {
    const html = `
      <div class="loader" id="progress_${store.id}">
        <p class="store-name">${store.name} (${store.quantity})</p>
        <div class="progress-empty"></div>
      </div>
    `;

    container.innerHTML += html;
  });
}

init();