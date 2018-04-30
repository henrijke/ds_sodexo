'use strict';

const restaurantSelect = document.querySelector('#restaurantSelect');
const optionsDiv = document.querySelector('#optionsDiv');
const menuOutput = document.querySelector('#menuOutput');
const menuHolder = document.querySelector("#menuDiv");

const openingTime={
  16363: {
    name: "Bulevardi",
    cafeOpen: null,
    cafeClose: null,
    restaurantOpen: 730,
    restaurantClosed: 1430,
    breakfastOpen: 730,
    breakfastClose: 1000,
    lunchOpen: 1030,
    lunchClose: 1400,
  },
  16364:{
    name: "Hämeentie",
    cafeOpen: null,
    cafeClose: null,
    restaurantOpen: 800,
    restaurantClosed: 1430,
    breakfastOpen: 800,
    breakfastClose: 1000,
    lunchOpen: 1030,
    lunchClose: 1300,
  },
  16365:{
    name: "Leiritie",
    cafeOpen: 730,
    cafeClose: 900,
    restaurantOpen: 730,
    restaurantClosed: 1730,
    breakfastOpen: 730,
    breakfastClose: 1900,
    lunchOpen: 1030,
    lunchClose: 1430,
  },
  16435:{
    name: "Vanha Maantie",
    cafeOpen: 730,
    cafeClose: 1730,
    restaurantOpen: 730,
    restaurantClosed: 1730,
    breakfastOpen: 730,
    breakfastClose: 1000,
    lunchOpen: 1030,
    lunchClose: 1430,
  },
  16448:{
    name: "Vanha Viertotie",
    cafeOpen: null,
    cafeClose: null,
    restaurantOpen: 730,
    restaurantClosed: 1500,
    breakfastOpen: 730,
    breakfastClose: 1000,
    lunchOpen: 1030,
    lunchClose: 1400,
  },
};

const propertiesElements = (list) =>{
  const elementHolder = document.createElement('div');
  elementHolder.className += ' specialProperties';
  for(const ls of list){
    switch(ls.toUpperCase()){
      case "G":
        const glut = document.createElement('p');
        glut.innerHTML= 'Gluteeniton';
        glut.className += ' glut';
        elementHolder.appendChild(glut);
        break;
      case "L":
        const lact = document.createElement('p');
        lact.className += ' lact';
        lact.innerHTML = 'Laktoositon';
        elementHolder.appendChild(lact);
        break;
      case "M":
        const milk = document.createElement('p');
        milk.className += ' milk';
        milk.innerHTML = 'Maidoton';
        elementHolder.appendChild(milk);
        break;
      case "VL":
        const lowl = document.createElement('p');
        lowl.className += ' lowl';
        lowl.innerHTML = 'Vähälaktoosinen';
        elementHolder.appendChild(lowl);
        break;
    }
  }
  return elementHolder;
};

const displayMenu = () => {
  menuOutput.innerHTML = '<tr class="headNames">'+'<th>Ruoka</th>'+'<th>Hinta</th>'+'<th>Opiskelijahinta</th>'+'<th>Henkilökuntahinta</th>'+'<th>Erikoisruokavalio</th>';
  for (let i = 0; i < this.courses.length; i++) {
    const data = this.courses[i];
    const hinnat = this.courses[i].price.split('/');
    const erikoisRuokaValiot = propertiesElements(this.courses[i].properties.split(','));
    menuOutput.innerHTML += '<td>'+data.title_fi+'</td> <td>'+hinnat[2].trim()+'€</td> <td>'+hinnat[0].trim()+'€</td> <td>'+hinnat[1].trim()+'€</td> <td id="append'+i+'"></td>';
    document.querySelector('#append'+i).appendChild(erikoisRuokaValiot);
  }
};

const millisecondsUntilMidnight = () => {
  const now = new Date();
  const then = new Date(now);
  then.setHours(24, 0, 0, 0);
  return (then - now) / 6e4 * 1000;
};

// checks if the given restaurant is open
const isOpen=(currentTime, openingTime, closingTime)=>{
  const time = (currentTime.hour*100) + currentTime.minutes;
  return (time >= openingTime && time <= closingTime);
};

//shows whats available at the current restaurant
const displayOpen=(currentTime, restaurant)=>{

  if (document.querySelector('#restaurantHandler') !== null) {
    document.querySelector('#restaurantHandler').remove();
  }

  const restaurantHandler = document.createElement('div');
  restaurantHandler.id = 'restaurantHandler';
  const restaurantName = document.createElement('h1');
  restaurantName.innerHTML = openingTime[restaurant].name;
  restaurantHandler.appendChild(restaurantName);
  const food = document.createElement('h2');

  if(isOpen(currentTime,openingTime[restaurant].lunchOpen,openingTime[restaurant].lunchClose)){
    food.innerHTML = `Lounasta parhaillaan tarjolla!`;
  }else if(isOpen(currentTime,openingTime[restaurant].breakfastOpen, openingTime[restaurant].breakfastClose)){
    food.innerHTML = `Aamupalaa parhaillaan tarjolla!`;
  }else{
    food.innerHTML = `Tällä hetkellä lounasta tai aamupalaa ei saatavilla`;
  }
  restaurantHandler.appendChild(food);
  menuHolder.insertBefore(restaurantHandler, menuHolder.firstChild);
};


//function that cleans the menuOutput, hide options and then fetches info of the new restaurant
const changeRestaurant = () => {
  menuOutput.innerHTML="";
  hideElement(optionsDiv);
};

const updateMenu = () => {
  console.log('Updating schedule in ' + millisecondsUntilMidnight() / 1000 + ' minutes.');
  setTimeout( () => {
    fetchSearch(restaurantSelect, currentDate());
  }, millisecondsUntilMidnight());
};

//makes the fetchsearch for the menu and builds it and tells whats available
const fetchSearch=(restaurantSelect, date)=>{

  updateMenu();

  const url =  `https://www.sodexo.fi/ruokalistat/output/daily_json/${restaurantSelect.value}/${date.year}/${date.month+1}/${date.day}/fi`;
  console.log(url);
  fetch(url,{
    headers: {
      'Access-Control-Allow-Origin': 'aSasasASd',
    },
  }).then( (response) => {
    return response.json();
  }).then( (result) => {
    this.courses = result.courses;
    console.log(result);
    displayMenu();
    displayOpen(date, restaurantSelect.value);
  });
};

// takes current date and parses it
const currentDate=() =>{
  const date = new Date();
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
    weekday: date.getDay(),
    hour: date.getHours(),
    minutes: date.getMinutes()
  };
};

//hides or shows given element
const hideElement= (element)=>{
  if(element.style.display === 'none'){
    element.style.display = 'block';
  } else {
    element.style.display = 'none';
  }
};

getMenuButton.addEventListener('click', () => {
  hideElement(optionsDiv);
  fetchSearch(restaurantSelect,currentDate());
});


