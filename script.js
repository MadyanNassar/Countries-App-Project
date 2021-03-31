const body = document.querySelector('body');
const button = document.createElement('button');
const input = document.createElement('input');
button.innerText= 'search';
input.type='text';
input.placeholder='enter the location that you want';
body.appendChild(button);
body.appendChild(input);

button.addEventListener('click', ()=>{
    fetch(`https://restcountries.eu/rest/v2/name/${input.value}`)
    .then(res => res.json())
    .then(data => console.log(data)
    )
});
