
// =================================
// DIGITAL CLOCK
// =================================

let hrs = document.getElementById("hrs");
let min = document.getElementById("min");
let sec = document.getElementById("sec");

let fulldate = document.getElementById("fulldate");
let shortdate = document.getElementById("shortdate");

function updateDigitalClock() {

    let currentTime = new Date();

    hrs.innerHTML = String(currentTime.getHours()).padStart(2, "0");
    min.innerHTML = String(currentTime.getMinutes()).padStart(2, "0");
    sec.innerHTML = String(currentTime.getSeconds()).padStart(2, "0");

    let day = currentTime.getDate();
    let month = currentTime.getMonth();
    let year = currentTime.getFullYear();

    let days = [
        "Sunday", "Monday", "Tuesday",
        "Wednesday", "Thursday", "Friday", "Saturday"
    ];

    let months = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    fulldate.innerHTML =
        days[currentTime.getDay()] + ", " +
        day + " " + months[month] + " " + year;

    shortdate.innerHTML =
        String(day).padStart(2, "0") + "/" +
        String(month + 1).padStart(2, "0") + "/" +
        year;
}

updateDigitalClock();
setInterval(updateDigitalClock, 1000);


// =================================
// STOPWATCH
// =================================

let [seconds, minutes, hours] = [0, 0, 0];

let displaytime = document.getElementById("displaytime");

let timer = null;

function stopwatch() {

    seconds++;

    if (seconds == 60) {

        seconds = 0;
        minutes++;

        if (minutes == 60) {

            minutes = 0;
            hours++;

        }
    }

    let h = String(hours).padStart(2, "0");
    let m = String(minutes).padStart(2, "0");
    let s = String(seconds).padStart(2, "0");

    displaytime.innerHTML = h + ":" + m + ":" + s;
}


function watchstart() {

    if (timer !== null) {
        return;
    }

    timer = setInterval(stopwatch, 1000);
}


function watchstop() {

    clearInterval(timer);
    timer = null;

}


function watchreset() {

    clearInterval(timer);
    timer = null;

    [seconds, minutes, hours] = [0, 0, 0];

    displaytime.innerHTML = "00:00:00";

}


// world clock


let cities = [
    {
        name: "London",
        timezone: "Europe/London"
    },
    {
        name: "New York",
        timezone: "America/New_York"
    },
    {
        name: "Dubai",
        timezone: "Asia/Dubai"
    },
    {
        name: "Tokyo",
        timezone: "Asia/Tokyo"
    }
];

let clockContainer = document.getElementById("clockContainer");
let citySelect = document.getElementById("citySelect");
let selectedCity = document.getElementById("selectedCity");


// CREATE CITY CARDS

cities.forEach((city, index) => {

    clockContainer.innerHTML += `
        <div class="city">

            <h2>${city.name}</h2>

            <div class="time" id="time${index}"></div>

        </div>
    `;

});


// GET CITY TIME AND TIMEZONE

function getCityTime(timezone) {

    let now = new Date();

    let time = new Intl.DateTimeFormat("en-GB", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    }).format(now);

    let zone = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        timeZoneName: "short"
    }).formatToParts(now)
      .find(part => part.type === "timeZoneName").value;

    return time + " (" + zone + ")";
}


// GET TIME DIFFERENCE FROM INDIA

function getDifference(timezone) {

    let now = new Date();

    let indiaOffset = getOffset("Asia/Kolkata", now);
    let cityOffset = getOffset(timezone, now);

    let difference = cityOffset - indiaOffset;

    let sign = difference >= 0 ? "+" : "-";

    difference = Math.abs(difference);

    let hours = Math.floor(difference / 60);
    let minutes = difference % 60;

    return sign +
        String(hours).padStart(2, "0") + ":" +
        String(minutes).padStart(2, "0") + " hrs";
}


// GET UTC OFFSET IN MINUTES

function getOffset(timezone, date) {

    let parts = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        timeZoneName: "longOffset"
    }).formatToParts(date);

    let offset = parts.find(
        part => part.type === "timeZoneName"
    ).value;

    if (offset === "GMT" || offset === "GMT+00:00") {
        return 0;
    }

    let match = offset.match(/GMT([+-])(\d{2}):(\d{2})/);

    if (!match) return 0;

    let minutes = Number(match[2]) * 60 + Number(match[3]);

    return match[1] === "+" ? minutes : -minutes;
}

function updateClocks() {

    cities.forEach((city, index) => {

        document.getElementById("time" + index).innerHTML =
            getCityTime(city.timezone);

    });

}

citySelect.addEventListener("change", function() {

    let timezone = this.value;

    if (timezone === "") {

        selectedCity.innerHTML = "";

        return;
    }

    let cityName = this.options[this.selectedIndex].text;

    let difference = getDifference(timezone);

    selectedCity.innerHTML = `
        ${cityName}<br>
        India difference: ${difference}
    `;

});


// UPDATE EVERY SECOND

updateClocks();

setInterval(updateClocks, 1000);
