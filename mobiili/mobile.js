'use strict';

//const pb2 = new PB2('https://pb2-2018.jelastic.metropolia.fi', 'samihenriapp');

// Haetaan buttonit ja selectionit jnejne
const getMenuButton = document.querySelector('#getMenuButton');
const restaurantSelect = document.querySelector('#restaurantSelect');
const menuOutput = document.querySelector('#menuOutput');
const languageSelect = document.querySelector('#languageSelect');
const calendar = document.querySelector('#calendar');
const menuHolder = document.querySelector("#menuDiv");
const preferencesDiv = document.querySelector('#preferences');
const preferencesButton = document.querySelector('#preferencesButton');
const closePreferencesButton = document.querySelector('#closeButton');
const checkboxes = document.querySelectorAll('.checkbox');
const showDate = document.querySelector('#showDate');
const optionsDiv = document.querySelector('#optionsDiv');

let erikoisRuokavaliot = {
  'Gluteeniton': {
    isActive: false
  },
  'Maidoton': {
    isActive: false
  },
  'Laktoositon': {
    isActive: false
  },
  'Vegaani': {
    isActive: false
  }
};

for (let i = 0; i < checkboxes.length; i++) {
  if (localStorage.getItem('preferences') !== null) {
    erikoisRuokavaliot = JSON.parse(localStorage.getItem('preferences'));
  }
  checkboxes[i].addEventListener('change', () => {
    if (checkboxes[i].checked) {
      erikoisRuokavaliot[checkboxes[i].value].isActive = true;
      console.log(erikoisRuokavaliot);
      localStorage.setItem('preferences', JSON.stringify(erikoisRuokavaliot));
    } else {
      erikoisRuokavaliot[checkboxes[i].value].isActive = false;
      console.log(erikoisRuokavaliot);
      localStorage.setItem('preferences', JSON.stringify(erikoisRuokavaliot));
    }
  });
}

closePreferencesButton.addEventListener('click', () => {
  preferencesDiv.classList.toggle('hidden');
  fetchSearch(restaurantSelect,currentDate());
});

preferencesButton.addEventListener('click', () => {
  preferencesDiv.classList.toggle('hidden');
});

const setupUserPreferences = () => {
  let userPreferences;
  if (localStorage.getItem('properties') !== null) {
    userPreferences = JSON.parse(localStorage.getItem('properties'));
  } else {
    userPreferences = erikoisRuokavaliot;
  }
  checkboxes[0].checked = userPreferences['Gluteeniton'].isActive;
  checkboxes[1].checked = userPreferences['Maidoton'].isActive;
  checkboxes[2].checked = userPreferences['Laktoositon'].isActive;
  checkboxes[3].checked = userPreferences['Vegaani'].isActive;
};

setupUserPreferences();

// Lista johon tallennetaan sodexon apista saatu pÃ¤ivÃ¤n ruokalista
let courses = [];

const days = ['Su','Ma','Ti','Ke','To','Pe','La'];
const month = ['Tammikuu','Helmikuu','Maaliskuu', 'Huhtikuu','Toukokuu','KesÃ¤kuu','HeinÃ¤kuu','Elokuu','Syyskuu','Lokakuu','Marraskuu','Joulukuu'];
const maxMonth= [31,28,31,30,31,30,31,31,30,31,30,31];
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
        lowl.innerHTML = 'VÃ¤hÃ¤laktoosinen';
        elementHolder.appendChild(lowl);
        break;
    }
  }
  return elementHolder;
};

// Printtaa menun HTML:Ã¤Ã¤n
const displayMenu = () => {
  menuOutput.innerHTML = '<tr>'+'<th>Ruoka</th>'+'<th>Hinta</th>'+'<th>Opiskelijahinta</th>'+'<th>Henkilökuntahinta</th>'+'<th>Erikoisruokavalio</th>';
  for (let i = 0; i < this.courses.length; i++) {
    const data = this.courses[i];
    const hinnat = this.courses[i].price.split('/');
    const erikoisRuokaValiot = propertiesElements(this.courses[i].properties.split(','));
    console.log(erikoisRuokaValiot);

    let usersPreferences;
    if (localStorage.getItem('preferences') !== null) {
      usersPreferences = JSON.parse(localStorage.getItem('preferences'));
      console.log(usersPreferences);
    } else {
      usersPreferences = erikoisRuokaValiot;
    }
    if (usersPreferences[erikoisRuokaValiot.firstChild.innerHTML].isActive !== true) {
      menuOutput.innerHTML += '<td>'+data.title_fi+'</td> <td>'+hinnat[2].trim()+'€</td> <td>'+hinnat[0].trim()+'€</td> <td>'+hinnat[1].trim()+'€</td> <td id="append'+i+'"></td>';
      document.querySelector('#append'+i).appendChild(erikoisRuokaValiot);
    }
  }
};



// returns what day is the starting day of the month
const whatWeekday= (currentDay, currentDayName) =>{
  return (currentDay-currentDayName)%7;
};

let daySelect = currentDate().day;

// Builds current months calendar
const buildCalendar= ()=>{
  const date = currentDate();
  daySelect = date.day;
  const monthText = document.createElement('h1');
  monthText.innerHTML = month[date.month];
  const weekdays = document.createElement('ul');
  weekdays.className += 'weekdays';

  for(let i=0; i < days.length; i++){
    const dayName= document.createElement('li');
    dayName.innerHTML = days[i];
    weekdays.appendChild(dayName);
  }
  const singularDays = document.createElement('ul');
  singularDays.className += 'days';

  for(let i=1; i < whatWeekday(date.day,date.weekday); i++){
    const li = document.createElement('li');
    li.className += 'empty ' ;
    singularDays.appendChild(li);
  }
  for(let i=1; i < maxMonth[date.month]+1; i++){
    const li = document.createElement('li');
    li.innerHTML = i;
    li.addEventListener('click',()=>{
      daySelect = i;
      for(let child of singularDays.children){
        child.classList.remove('active');
      }
      li.className += 'active ';
    });
    singularDays.appendChild(li);
  }
  calendar.appendChild(monthText);
  calendar.appendChild(weekdays);
  calendar.appendChild(singularDays);
  calendar.style.display = 'none';
  optionsDiv.style.display= 'none';

};

/*
    Menubutton joka pressillÃ¤ hakee fetchin avulla ruokalistan
    Saa select componentista ravintolan ID:n jonka appendaa URL:liin
    TODO:: LisÃ¤Ã¤ muut muuttujat URLiin esim kieli, ja pÃ¤ivÃ¤
*/

//makes the fetchsearch for the menu and builds it and tells whats available
const fetchSearch=(restaurantSelect, date)=>{
  const url =  `https://www.sodexo.fi/ruokalistat/output/daily_json/${restaurantSelect.value}/${date.year}/${date.month+1}/${daySelect}/fi`;
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

// hides or shows the calendar
showDate.addEventListener('click',()=>{
  if(calendar.style.display === 'none'){
    calendar.style.display = 'block';
  } else {
    calendar.style.display = 'none';
  }

  if(optionsDiv.style.display === 'none'){
    optionsDiv.style.display = 'block';
  } else {
    optionsDiv.style.display = 'none';
  }

});

fetchSearch(restaurantSelect,currentDate());

getMenuButton.addEventListener('click', () => {
  fetchSearch(restaurantSelect,currentDate());
});

buildCalendar();

if (localStorage.getItem('preferences') === null) {
  localStorage.setItem('preferences', JSON.stringify(erikoisRuokavaliot));
}

// TODO:: Kenties mobiiliappi voisi admin tunnuksilla lÃ¤hettÃ¤Ã¤ viestejÃ¤ DS:Ã¤Ã¤n? Esim ettÃ¤ ruoka loppu tms...

