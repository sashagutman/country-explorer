const btn = document.getElementById('btn');
const inputCountry = document.getElementById('inputCountry');
const countryInfo = document.getElementById('countryInfo');

// функция для управления состоянием кнопки
function setLoading(is){
  btn.disabled = is;
  btn.textContent = is ? 'loading…' : 'search';
}
// функция для форматирования списков
function fmtList(v) {
  if (!v) return 'N/A';
  if (Array.isArray(v)) return v.join(', ');
  return String(v);
}
// функция для форматирования чисел
function fmtNum(n){
  return typeof n === 'number' ? new Intl.NumberFormat().format(n) : 'N/A';
}

btn.addEventListener('click', async () => {
  const name = inputCountry.value.trim();
  if (!name) {
    countryInfo.innerHTML = `<p class="text">The input field cannot be empty</p>`;
    return;
  }

  // только нужные поля
  const fields = 'name,capital,continents,flags,languages,currencies,population,timezones';
  const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fields=${fields}`;

  setLoading(true);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      countryInfo.innerHTML = `<p class="text">Country not found. Please check the name.</p>`;
      return;
    }
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      countryInfo.innerHTML = `<p class="text">Country not found. Please check the name.</p>`;
      return;
    }

    // берём первый результат
    const c = data[0];

    const flag = c.flags?.svg || c.flags?.png || '';
    const nameCommon = c.name?.common || 'Unknown';
    const capital = fmtList(c.capital || []);
    const languages = c.languages ? Object.values(c.languages).join(', ') : 'N/A';
    const continents = fmtList(c.continents || []);
    const currencies = c.currencies
      ? Object.values(c.currencies).map(x => x.name).join(', ')
      : 'N/A';
    const population = fmtNum(c.population);
    const timezones = fmtList(c.timezones || []);

    countryInfo.innerHTML = `
      <div class="info-inner">
        <div class="flag-center">
          ${flag ? `<img src="${flag}" alt="Flag of ${nameCommon}" loading="lazy">` : ''}
        </div>
        <h3 class="title title-center">${nameCommon}</h3>
        <h3 class="title">Capital: <span class="span-title">${capital}</span></h3>
        <h3 class="title">Languages: <span class="span-title">${languages}</span></h3>
        <h3 class="title">Continents: <span class="span-title">${continents}</span></h3>
        <h3 class="title">Currencies: <span class="span-title">${currencies}</span></h3>
        <h3 class="title">Population: <span class="span-title">${population}</span></h3>
        <h3 class="title">Timezones: <span class="span-title">${timezones}</span></h3>
      </div>
    `;
  } catch (err) {
    countryInfo.innerHTML = `<p class="text">Network error. Please try again later.</p>`;
  } finally {
    setLoading(false);
  }
});

inputCountry.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') btn.click();
});
