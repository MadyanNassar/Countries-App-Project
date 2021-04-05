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
const quizBtn = document.getElementById('quiz-button')
const quizFlag = document.getElementById('quiz-country')
const radio = document.getElementById('radio')


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
     flag.src = data[0].flag;
     flag.alt = data[0].name;
     CountryName.textContent = data[0].name
     NativeName.textContent = data[0].nativeName
     Capital.textContent = data[0].capital
     region.textContent = data[0].region
     const populationNum = data[0].population
     population.textContent = new Intl.NumberFormat().format(populationNum)
     currency.textContent = data[0].currencies[0].name
     language.textContent = data[0].languages[0].name

     const mapContainer = L.DomUtil.get('map');
      if(mapContainer !== null){
        mapContainer._leaflet_id = null;
        
      }
      const myLatLong = data[0].latlng;
      const mapZoom = 4;
      //console.log(myLatLong)
     const  map = L.map('map', { zoomControl: true }).setView(myLatLong, mapZoom)
     L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=EHLe3esGMaAM7recDgHM', {
      attribution:'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
  }).addTo(map);
  L.marker(myLatLong).addTo(map);
  
  map.dragging.disable()
  map.scrollWheelZoom.disable();
  
  console.log(europe)
//
  const selectedCountry =  europe.features.filter(function(country) {
    return country.properties.name_long.toUpperCase() === data[0].name.toUpperCase();
});

// console.log(data[0])
// console.log(selectedCountry[0].properties.name_long)
//console.log(data[0])

L.geoJSON(europe, {
  style: function(feature) {
      switch ((feature.properties.name_long)) {
          case `${selectedCountry[0].properties.name_long}`: return {color: "red"};
          default :  return {color: "black"};
      }
  }
}).addTo(map);
  
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



const generateQuiz = (resultCountries)=>{
  quizBtn.textContent='Next Country'
  radio.innerHTML='';
  quizFlag.src = ''
  console.log(resultCountries)
  const i = Math.floor(Math.random() * 5);
  const correctCountry = resultCountries[i].name
  quizFlag.src = resultCountries[i].flag


  for ( const country in resultCountries){
    const answerButton = document.createElement('button');
    answerButton.textContent=resultCountries[country].name;
    answerButton.style.color='red'
    answerButton.classList.add('btn', 'btn-primary', 'btn-lg', 'w-100', 'answer-btn');
    radio.appendChild(answerButton);
    answerButton.addEventListener('click', ()=>{
      if (answerButton.textContent === correctCountry){
console.log('correct')
      }
      else{
        console.log('wrong')
      }
      quiz()
    })
  }
  

}


  async function quiz() {
    try {
      const url = 'https://restcountries.eu/rest/v2/all'
      const data = await fetchData(url);
      //console.log(data)
      const shuffle = data.sort(() => Math.random() - 0.5);
      const resultCountries = shuffle.slice(1, 7);
      // console.log(resultArray)
       generateQuiz(resultCountries);
    } catch (error) {
      renderError(error);
    }
  }
  
quizBtn.addEventListener('click', quiz);