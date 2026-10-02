// вывод строки в блок на странице и в консоль
function show(outId, text) {
  const out = document.getElementById(outId);
  out.textContent += text + '\n';
  console.log(text);
}


// Чистые функции

// чистая: результат зависит только от аргументов
const sum = (a, b) => a + b;

// нечистая: меняет внешнюю переменную total
let total = 0;
const add = (x) => (total += x);

document.getElementById('pure-btn').addEventListener('click', () => {
  show('pure-out', 'sum(2, 3) = ' + sum(2, 3));
  show('pure-out', 'add(2) = ' + add(2));
  show('pure-out', '---');
});


// Функции высшего порядка

// addEventListener принимает функцию-обработчик
const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');

menuBtn.addEventListener('click', () => {
  menu.classList.toggle('open');
});

const prices = [100, 250, 400];

// функция, которая возвращает функцию
const multiply = (k) => (x) => x * k;
const double = multiply(2);

document.getElementById('hof-btn').addEventListener('click', () => {
  // map принимает функцию и применяет её к каждому элементу
  const withVat = prices.map((p) => p * 1.2);

  show('hof-out', 'prices = [' + prices.join(', ') + ']');
  show('hof-out', 'withVat = [' + withVat.join(', ') + ']');
  show('hof-out', 'double(5) = ' + double(5));
  show('hof-out', '---');
});


// Кэширование функций

function memoize(fn) {
  const cache = new Map();
  return (n) => {
    if (!cache.has(n)) cache.set(n, fn(n));
    return cache.get(n);
  };
}

// специально медленная функция, чтобы была видна разница!!
function heavyCalc(n) {
  let result = 0;
  for (let i = 0; i < 300000000; i++) {
    result += i % n;
  }
  return result;
}

const fastCalc = memoize(heavyCalc);

document.getElementById('memo-btn').addEventListener('click', () => {
  const start = performance.now();
  const result = fastCalc(42);
  const time = Math.round(performance.now() - start);

  show('memo-out', 'fastCalc(42) = ' + result + ', время: ' + time + ' мс');
});


// Ленивые функции

let supportsWebp = function () {
  show('lazy-out', 'выполняю проверку...');

  const canvas = document.createElement('canvas');
  const result = canvas
    .toDataURL('image/webp')
    .startsWith('data:image/webp');

  // подменяем себя готовым ответом
  supportsWebp = () => result;
  return result;
};

document.getElementById('lazy-btn').addEventListener('click', () => {
  show('lazy-out', 'supportsWebp() = ' + supportsWebp());
});


// Каррирование

const curryAdd = (a) => (b) => a + b;

// частичное применение
const setColor = (color) => (el) => {
  el.style.color = color;
};

const makeRed = setColor('red');
const makeBlue = setColor('blue');
const resetColor = setColor('');

const title = document.getElementById('title');

show('curry-out', 'sum(2, 3) = ' + sum(2, 3));
show('curry-out', 'curryAdd(2)(3) = ' + curryAdd(2)(3));

document.getElementById('red-btn').addEventListener('click', () => {
  makeRed(title);
  show('curry-out', 'makeRed(title)');
});

document.getElementById('blue-btn').addEventListener('click', () => {
  makeBlue(title);
  show('curry-out', 'makeBlue(title)');
});

document.getElementById('reset-btn').addEventListener('click', () => {
  resetColor(title);
  show('curry-out', 'resetColor(title)');
});


// Композиция функций

const trim = (s) => s.trim();
const lower = (s) => s.toLowerCase();
const dash = (s) => s.replace(/\s+/g, '-');

const compose = (...fns) => (x) =>
  fns.reduceRight((acc, fn) => fn(acc), x);

// pipe делает то же самое, но слева направо
const pipe = (...fns) => (x) =>
  fns.reduce((acc, fn) => fn(acc), x);

const toSlug = compose(dash, lower, trim);
const toSlugPipe = pipe(trim, lower, dash);

const slugInput = document.getElementById('slug-input');
const composeOut = document.getElementById('compose-out');

function showSlug(text) {
  composeOut.textContent =
    'compose: "' + toSlug(text) + '"\n' +
    'pipe:    "' + toSlugPipe(text) + '"';
}

// пример со слайда
showSlug('  Новая Статья ');

slugInput.addEventListener('input', () => {
  showSlug(slugInput.value);
});
