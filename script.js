const search = document.querySelector('button')
const input = document.querySelector('input')
const CountryName = document.getElementById('name')
const NativeName = document.getElementById('native-name')
const Capital = document.getElementById('capital')
const region = document.getElementById('region')
const population = document.getElementById('population')
const currency = document.getElementById('currency')
const language = document.getElementById('language')
const flag = document.getElementById('flag-img');
//const map = document.getElementById('map')

function fetchData(url) {
    return fetch(url).then((response) => {
      if (!response.ok) {
        throw new Error('request error');
      }
      const data = response.json()
      return data;
    });
  }

  function renderData(data) {
    console.log(data)
     flag.src = data[0].flag;
     flag.alt = data[0].name;
     CountryName.innerText = data[0].name
     NativeName.innerText = data[0].nativeName
     Capital.innerText = data[0].capital
     region.innerText = data[0].region
     const populationNum = data[0].population
     population.innerText = new Intl.NumberFormat().format(populationNum)
     currency.innerText = data[0].currencies[0].name
     language.innerText = data[0].languages[0].name

     const mapContainer = L.DomUtil.get('map');
      if(mapContainer != null){
        mapContainer._leaflet_id = null;
      }
      const myLatLong = data[0].latlng;
      const mapZoom = 5;
      console.log(myLatLong)
     let map = L.map('map').setView(myLatLong, mapZoom);
     L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=EHLe3esGMaAM7recDgHM', {
      attribution:'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
  }).addTo(map);
  L.marker(myLatLong).addTo(map);
  
    
  }
  
  function renderError(error) {
    console.log(error);
    // errTitle.textContent = error;
    // errTitle.style.color = 'red';

  }

  async function main() {
    try {
        const url = `https://restcountries.eu/rest/v2/name/${input.value}`
      const data = await fetchData(url);
      renderData(data)
    } catch (error) {
      renderError(error);
    }
  }
  
  search.addEventListener('click', main);