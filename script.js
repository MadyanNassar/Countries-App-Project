const search = document.getElementById('quiz-btn')
const input = document.querySelector('input')
const countryName = document.getElementById('name')
const nativeName = document.getElementById('native-name')
const capital = document.getElementById('capital')
const region = document.getElementById('region')
const population = document.getElementById('population')
const currency = document.getElementById('currency')
const language = document.getElementById('language')
const flag = document.getElementById('flag-img');
const quizBtn = document.getElementById('quiz-button')
const quizFlag = document.getElementById('quiz-country')
const radio = document.getElementById('radio')
const hint = document.getElementById('hint')
const scoreSec = document.getElementById('score-sec')
const currentQues = document.getElementById('current-ques')
const numOfQues = document.getElementById('num-of-ques')
let quesNum = 0;
let numOfCorrAns =0;
let numOfAns = 0;


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
     countryName.textContent = data[0].name
     nativeName.textContent = data[0].nativeName
     capital.textContent = data[0].capital
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
  
  // console.log(europe)

  const selectedCountry =  europe.features.filter(function(country) {
  return country.properties.name_long.toUpperCase() === data[0].name.toUpperCase();
});

// console.log(data[0])
// console.log(selectedCountry[0].properties.name_long)

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
      if (numOfAns === 10){
      if (numOfCorrAns>=6){
        alert(`Congratulations you did the quiz well and your score is ${numOfCorrAns}/10 , Let's try again`)
      } else {
        alert(`You failed with the quiz your score is ${numOfCorrAns}/10 , Let's try again`)
      }
      quesNum = 0;
      numOfAns = 0;
      numOfCorrAns=0;
      }
  scoreSec.style.display='block';
  quesNum++
  numOfAns++
  currentQues.textContent=quesNum
  numOfQues.textContent=10
  quizBtn.textContent='Next Country'
  radio.innerHTML='';
  quizFlag.src = ''
  const i = Math.floor(Math.random() * resultCountries.length);
  const correctCountry = resultCountries[i].name
  quizFlag.src = resultCountries[i].flag
  hint.textContent = `The country is located in ${resultCountries[i].region} and its capital is ${resultCountries[i].capital}`

  for ( const country in resultCountries){
    const answerButton = document.createElement('button');
    answerButton.textContent=resultCountries[country].name;
    answerButton.style.color='blue'
    answerButton.classList.add('btn' ,'btn-info', 'w-100', 'answer-btn');
    // answerButton.setAttribute('country-name', resultCountries[country].name);
    // answerButton.setAttribute('correct-country', correctCountry);
    //console.log(answerButton)
    radio.appendChild(answerButton);
   
    answerButton.addEventListener('click', (event)=>{
      if (answerButton.textContent === correctCountry){
        answerButton.innerHTML += `<span class="blink_icon"><i class="fa fa-thumbs-up"></i></span>`;
        answerButton.classList.remove('btn-info-dark')
        answerButton.style.background='green'
        answerButton.style.color='white'
        answerButton.classList.add('btn-success', 'blink_icon');
        hint.textContent=`That is true the country is ${correctCountry}`
        numOfCorrAns++
        console.log('correct')
      }
      else{
        answerButton.innerHTML += `<span class="blink_icon"><i class="fa fa-thumbs-down"></i></span>`;
        answerButton.classList.remove('btn-info-dark')
        answerButton.style.background='red'
        answerButton.style.color='white'
        hint.textContent=`${event.target.textContent} is wrong the correct country is ${correctCountry}`
        console.log('wrong')
      }
      const answerButtons = document.getElementsByClassName('answer-btn')
      for (let i = 0; i < answerButtons.length; i++) {
      answerButtons[i].disabled = true
    }
    
console.log(quesNum)
console.log(numOfCorrAns)
console.log(numOfAns)
   setTimeout(()=>quiz(),4000)
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
       generateQuiz(resultCountries);
    } catch (error) {
      renderError(error);
    }
  }
  
quizBtn.addEventListener('click', quiz);

window.onload = function() {
scoreSec.style.display='none';
};