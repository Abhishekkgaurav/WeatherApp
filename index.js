let usertab=document.querySelector("[user-tab]");
let searchtab=document.querySelector("[search-tab]");
let userlocation=document.querySelector("[user-location-name]");
let weatherinfotext=document.querySelector("[weather-info-text]");
let weatherinfoimg=document.querySelector("[weather-info-img]");
let weathertemp=document.querySelector("[weather-temp]");
let usercountry=document.querySelector("[user-country]");
let windinfo=document.querySelector("[wind-info]");
let humidityinfo=document.querySelector("[humidity-info]");
let cloudinfo=document.querySelector("[cloud-info]");
let grantAccess=document.querySelector(".grantaccess");
let loading=document.querySelector(".loadingsection");
let searchsection=document.querySelector(".searchweathersection")
let userweathersection=document.querySelector(".yourweathersection");
let granraccessbtn=document.querySelector("[access-btn]");
const cityname=document.querySelector("[inputcityname]");
const invalidCityMessage=document.querySelector(".invalidcity");
//const searchwform=document.querySelector("[search-weather-form]");

let currenttab=usertab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currenttab.classList.add('current-tab');
getFromSessionStorage();

async function fetchUserWeatherInfo(cordinates){
    const {lat,lon}=cordinates;
    grantAccess.classList.remove("active");
    loading.classList.add("active");
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
          const data=await response.json();
          console.log("Fetch weather running");
          console.log(data);
          loading.classList.remove("active");
          userweathersection.classList.add("active");
          renderWeather(data);
    }
    catch(err){
        loading.classList.add("active");
    }
}


function renderWeather(data){
userlocation.innerText=data?.name;
usercountry.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
weatherinfotext.innerText= data?.weather?.[0]?.description;
weatherinfoimg.src=`http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
weathertemp.innerText=`${data?.main?.temp} °C`;
windinfo.innerText=`${data?.wind?.speed} m/s`;
humidityinfo.innerText=`${data?.main?.humidity}%`;
cloudinfo.innerText=`${data?.clouds?.all}%`;

}



function getLocation(){
    if (navigator.geolocation){
             navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
            alert("Your Browser is not supporting GeoLocation!!!");
    }
}



function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };
    sessionStorage.setItem("user-cordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

  }



function switchTab(clicked){
    if(currenttab!==clicked)
    { 
        console.log(currenttab);
        currenttab.classList.remove('current-tab');
        currenttab=clicked;
        currenttab.classList.add('current-tab');

            if(!searchsection.classList.contains("active"))
        {
            userweathersection.classList.remove("active");
            grantAccess.classList.remove("active");
            searchsection.classList.add("active");
        }
        else{
            searchsection.classList.remove("active");
            getFromSessionStorage();
        }
    }
}



function getFromSessionStorage() {
    const localcordinates=sessionStorage.getItem('user-cordinates');
    if(!localcordinates) {
        //agar local coordinates nahi mile
        grantAccess.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localcordinates);
        fetchUserWeatherInfo(coordinates);
    }
}




granraccessbtn.addEventListener('click',getLocation);

usertab.addEventListener('click',()=>{
    switchTab(usertab);
});

searchtab.addEventListener('click',()=>{
    switchTab(searchtab);
});


searchsection.addEventListener("submit", (e)=>{
    e.preventDefault();
    let city = cityname.value;
    if(city==="")
    {
        return;
    }
    else{
        fetchSearchWeatherSection(city);
    }
})
async function fetchSearchWeatherSection(city){
    
    loading.classList.add('active');
    grantAccess.classList.remove('active');
    userweathersection.classList.remove('active');
    try{
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data= await response.json();
        loading.classList.remove('active');
        if(response.ok!=true)
        {
            invalidCityMessage.classList.add("invalidactive");
        }
        else{
            invalidCityMessage.classList.remove("invalidactive");
            userweathersection.classList.add('active');
            renderWeather(data);
        }
        
    }
    catch(err){
        console.log(err);
        loading.classList.add('active');
    }
    
}

