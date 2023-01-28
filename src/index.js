import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countyList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce (onInput, DEBOUNCE_DELAY));

function onInput() {
  const searchCountryName = input.value;
  if (searchCountryName === '') {
    clearForm();
    return;
  } else {
    fetchCountries(searchCountryName)
      .then(countriesNames => {
        if (countriesNames.length < 4) {
          createCountryCard(countriesNames);
          Notiflix.Notify.success('Here your result');
        } else if (countriesNames.length < 10 && countriesNames.length > 1) {
          createCountrieList(countriesNames);
          Notiflix.Notify.success('Here your result');
        } else {
          clearForm();
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        }
      })
      .catch(() => {
        clearForm();
        Notiflix.Notify.failure('Oops, there is no country with that name.');
      });
  }
}

function createCountryCard(country) {
  clearForm();
  const c = country[0];
  const countryCardInfo = `<div class="country-card">
    <div class="country-card--header">
        <img src="${c.flags.svg}" alt="Country flag" width="50", height="30">
        <h2 class="country-card--name"> ${c.name.official}</h2>
    </div>
        <p class="country-card--info">Capital: <span class="country-value">${
          c.capital
        }</span></p>
        <p class="country-card--info">Population: <span class="country-value">${
          c.population
        }</span></p>
        <p class="country-card--info">Languages: <span class="country-value">${Object.values(
          c.languages
        ).join(', ')}</span></p>
</div>`;
  countryInfo.innerHTML = countryCardInfo;
}

function createCountrieList(country) {
  clearForm();
  const countiesList = country
    .map(
      c =>
        `<li class="country-list--item">
              <img src="${c.flags.svg}" alt="Country flag" width="50", height="35">
              <span class="country-list--name">${c.name.official}</span>
          </li>`
    )
    .join('');
    countyList.insertAdjacentHTML('beforeend', countiesList);
}

function clearForm() {
  countryInfo.innerHTML = '';
  countyList.innerHTML = '';
}
