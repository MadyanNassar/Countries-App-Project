//  elements declaration

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
const mapTxt = document.getElementById('map-txt') 
const mapView = document.getElementById('map')
const quesHint = document.getElementById('question-hint')
const lstAns = document.getElementById('list-answers')
const mainInfo = document.getElementById('main-info-section')


// variables for quiz
let quesNum = 0;
let numOfCorrAns =0;
let numOfAns = 0;

// Generale function to fetch URL and returns the data
function fetchData(url) {
    return fetch(url).then((response) => {
      if (!response.ok) {
        throw new Error('request error : something went wrong');
      }
      const data = response.json()
      return data;
    });
  }

  // start rendering the data on HTML elements
  function renderData(data) {
    mapView.style.display='block';
    mapTxt.style.display='none';
     flag.src = data[0].flag;
     flag.alt = data[0].name;
     countryName.textContent = data[0].name
     nativeName.textContent = data[0].nativeName
     capital.textContent = data[0].capital
     region.textContent = data[0].region
     const populationNum = data[0].population
     population.textContent = new Intl.NumberFormat().format(populationNum) // format big number (111222333 -> 111,222,333)
     currency.textContent = data[0].currencies[0].name
     language.textContent = data[0].languages[0].name
     mainInfo.style.display='flex';


     // start working on map section

     // firstly check if there is already map viewed to remove it and prepare for next map 
     const mapContainer = L.DomUtil.get('map');
      if(mapContainer !== null){
        mapContainer._leaflet_id = null; 
      }

      // rendering the map according on latitude and longitude and zoom level
      const myLatLong = data[0].latlng;
      const mapZoom = 4;
     const  map = L.map('map', { zoomControl: true }).setView(myLatLong, mapZoom)
     L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=EHLe3esGMaAM7recDgHM', {
      attribution:'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
  }).addTo(map);

  // add marker to map on the specific latitude and longitude
  L.marker(myLatLong).addTo(map);
  // map.dragging.disable()
  map.scrollWheelZoom.disable();

  // get the correct country in order to put some styling (boarder feature)
  const selectedCountry =  countriesMap.features.filter(function(country) {
  return country.properties.name_long.toUpperCase() === data[0].name.toUpperCase();
});
// adding border feature to correct country on map 
L.geoJSON(countriesMap, {
  style: function(feature) {
      switch ((feature.properties.name_long)) {
          case `${selectedCountry[0].properties.name_long}`: return {color: "red"};
          // default :  return {color: "black"};
      }
  }
}).addTo(map);

// mapView.addEventListener('click', ()=>{
//   console.log(mapView);
//   mapView.classList.add("full-screen");
// })


  }

  // function when there is error
  function renderError(error) {
    mapTxt.style.display='block';
    mapView.style.display='none'; 
    mapTxt.textContent = '';

    // check if the user input text on search input
    if(input.value.length > 0){
     if (countryName.textContent.length > 0 )  {
      mapTxt.textContent = `Can not showing ${countryName.textContent} on map,.. ${countryName.textContent} map is not a supported yet`
    }
    else{
      mapTxt.textContent = `${error} ..... Please enter a valid country name to see its information and map ... ${input.value} is not a valid country`
    }
  }
  // if the user did not type anything in search input
    else{
      mapTxt.textContent = 'Please enter the name of country to see its info'
    }
    mapTxt.style.color='red'
  }

  // the main function for first section which will run when search button is clicked
  async function main() {
    try {
        const url = `https://restcountries.eu/rest/v2/name/${input.value}`
      const data = await fetchData(url);
      renderData(data)
    } catch (error) {
      renderError(error);
    }
  }

search.addEventListener('click', ()=>{
  countryName.textContent = '';
  flag.src = '';
  flag.alt = '';
  countryName.textContent = '';
  nativeName.textContent = '';
  capital.textContent = '';
  region.textContent =  '';
  currency.textContent ='';
  language.textContent = '';
  population.textContent ='';
  main ();
});

// function to generate a quiz
const generateQuiz = (resultCountries)=>{
  // let's firstly check if the user reached the number of questions of quiz
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

  // start generate the quiz 
  scoreSec.style.display='block';
  quesNum++
  numOfAns++
  currentQues.textContent=quesNum
  numOfQues.textContent=10
  quizBtn.textContent='Next Country'
  radio.innerHTML='';
  quizFlag.src = ''
  // choose random country from resultCountries it will be the correct country
  const i = Math.floor(Math.random() * resultCountries.length); 
  const correctCountry = resultCountries[i].name
  quizFlag.src = resultCountries[i].flag
  hint.textContent = `The country is located in ${resultCountries[i].region} and its capital is ${resultCountries[i].capital}`
// generate group of buttons depending on number of countries is current question 
  for ( const country in resultCountries){
    const answerButton = document.createElement('button');
    answerButton.textContent=resultCountries[country].name;
    answerButton.style.color='blue'
    answerButton.classList.add('btn' ,'btn-info', 'w-100', 'answer-btn');
    // answerButton.setAttribute('country-name', resultCountries[country].name);
    // answerButton.setAttribute('correct-country', correctCountry);
    radio.appendChild(answerButton);
   // let's check what answer did the user choose
    answerButton.addEventListener('click', (event)=>{
      if (answerButton.textContent === correctCountry){
        answerButton.innerHTML += `<span class="blink_icon"><i class="fa fa-thumbs-up"></i></span>`;
        answerButton.classList.remove('btn-info-dark')
        answerButton.style.background='green'
        answerButton.style.color='white'
        answerButton.classList.add('btn-success', 'blink_icon');
        hint.textContent=`That is true the country is ${correctCountry}`
        numOfCorrAns++
      }
      else{
        answerButton.innerHTML += `<span class="blink_icon"><i class="fa fa-thumbs-down"></i></span>`;
        answerButton.classList.remove('btn-info-dark')
        answerButton.style.background='red'
        answerButton.style.color='white'
        hint.textContent=`${event.target.textContent} is wrong the correct country is ${correctCountry}`
      }
      // all buttons will be disabled when the user chose an answer
      const answerButtons = document.getElementsByClassName('answer-btn')
      for (let i = 0; i < answerButtons.length; i++) {
      answerButtons[i].disabled = true
    }
    // after select the answer wait 4 sec then run quiz func again (to generate new question)
   setTimeout(()=>quiz(),4000)
    })
  }
}

// main func for quiz
  async function quiz() {
    try {
      const url = 'https://restcountries.eu/rest/v2/all'
      const data = await fetchData(url);
      const shuffle = data.sort(() => Math.random() - 0.5); // shuffle the whole array
      const resultCountries = shuffle.slice(1, 7); // take the first 6 elements of it
       generateQuiz(resultCountries); // now execute generateQuiz func to make a quiz question
    } catch (error) {
      quizBtn.textContent='sorry there is no data' // if something went wrong
    }
  }
  
quizBtn.addEventListener('click', ()=>{
  quesHint.textContent ='What is the name of country';
  lstAns.textContent='choose one from the list';
  quiz();
});

// window.onload = function() {
// scoreSec.style.display='none';
// };