const id = (id) => document.getElementById(id);
const container = id("container");

const createEl = (type, content, attachTo) => {
  var elem = document.createElement(type);
    attachTo.appendChild(elem);
    elem.innerHTML = content;
}
let lat = "41.890278", //default values for no geolocation
    lon = "12.493316";
//----------CHOOSE   WEATHER ICON-------------------
const getIcon = (code) => {      
  if(code >= 200 && code < 300){
    return '<i class="wi wi-thunderstorm"></i>';
  }else if(code >= 300 && code < 400){
    return '<i class="wi wi-sprinkle"></i>';      
  }else if(code >= 500 && code < 600){
    return '<i class="wi wi-rain"></i>';
  }else if(code >= 600 && code < 700){
    return '<i class="wi wi-snowm"></i>';
  }else if(code >= 700 && code < 800){
     return '<i class="wi wi-fog"></i>';
  }else if(code == 800){
    return '<i class="wi wi-day-sunny"></i>';        
  }else if(code == 801){
    return '<i class="wi wi-day-cloudy"></i>';
  }else if(code == 802){
    return '<i class="wi wi-cloud"></i>';
  }else if(code == 803){
    return '<i class="wi wi-cloudy"></i>';
  }else{
    return '<i class="wi wi-meteor"></i>';
  }
}
window.onload = function(){  
//-------------WEATHER API CALL---------------------
    const getWeather = async (lat, lon) => {  
    try{    
      //get json content    
      let response = await fetch(`https://weather-proxy.freecodecamp.rocks/api/current?lat=${lat}&lon=${lon}`);
      let content = await response.json();    
      //render content on the page
      createEl("h2",
              `${content.name}, ${content.sys.country}`,
              container);
      createEl("h3",
              content.weather[0].description,
              container);
      createEl("div",
              getIcon(content.weather[0].id),
              container);
      createEl("div",
              `<div id="temp-display"><h2 id="temp-text">${content.main.temp.toFixed(1)}</h2><span id="temp-scale"> &degC</span></div>`,
               container
              );
//--------------TOGGLE TEMPERATURE SCALE------------------      
      let tempInC = content.main.temp.toFixed(1);
      const tempScale = id("temp-scale"),
            tempText = id("temp-text");
      let isTempConverted = false;
      const convertTempToF = () => {        
        if(!isTempConverted){
          tempText.innerText = (tempInC * 9 / 5 + 32).toFixed(1);
          tempScale.innerHTML = " &degF";
          isTempConverted = true;          
        }else{
          tempText.innerText = tempInC;
          tempScale.innerHTML = " &degC";
          isTempConverted = false;
        }
      }
      tempScale.addEventListener("click", convertTempToF);
      
    }catch(err){    
      createEl("h2",
              "Unable to get data.",
              container);
    }  
    };
  //--------GET USER LOCATION------------------
  const error = () => {
    getWeather(lat, lon);
  }
  if(navigator.geolocation){  
    navigator.geolocation.getCurrentPosition(function(response){
      lat = response.coords.latitude;
      lon = response.coords.longitude;
      getWeather(lat, lon);
    }, error);
  }else{
    createEl("h2",
              "Sorry, your browser doesn't support geolocation.",
              container);
  }  
  
}
