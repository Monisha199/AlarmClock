function updateRealTime() {
    const date = new Date()
    let hr = date.getHours()
    let min = date.getMinutes()
    let sec = date.getSeconds()
    let AMPM = "AM"

    if (date.getHours() == 0) {
        hr = 12
    }

    if (date.getHours() >= 12) {
        if (date.getHours() == 12) {
            hr = 12
        } else {
            hr = hr - 12
        }

        AMPM = "PM"
    } else {
        AMPM = "AM"
    }

    if (hr.toString().length == 1) {
        hr = '0' + hr
    }
    if (min < 10) {
        min = '0' + min
    }
    if (sec < 10) {
        sec = '0' + sec
    }

    document.getElementById("realtime-clock").innerHTML = hr + " : " + min + " : " + sec +' '+ AMPM
}
setInterval(updateRealTime, 1000)


let schedule_alarm = []
let setHr = document.getElementById("hr")
let setMin = document.getElementById("min")
let setSec = document.getElementById("sec")
let setAMPM = document.getElementById("ampm")
let colorChange = document.getElementsByClassName("time")
let upcomingAlarmsholder = document.getElementById("upcoming-alarms")


// Selected by the visitor :

let totalHrs = 12
// Range from 1 to 12 hrs
for (let i = 1; i <= totalHrs; i++) {
    setHr.options[setHr.options.length] = new Option(i < 10 ? '0' + i : i)
}

let totalMins = 59
// Range of 00-59 minutes
for (let i = 0; i <= totalMins; i++) {
    setMin.options[setMin.options.length] = new Option(i < 10 ? '0' + i : i)
}

let totalSecs = 59
// Range of 00-59 seconds
for (let i = 0; i <= totalSecs; i++) {
    setSec.options[setSec.options.length] = new Option(i < 10 ? '0' + i : i)
}

let dayornoon = ["AM", "PM"]
// setting the AM, PM
for (let i = 0; i < dayornoon.length; i++) {
    setAMPM.options[setAMPM.options.length] = new Option(dayornoon[i])
}


// Function to display the time:



// Creating new Alarm time element in form of list:
var createNewTaskElement = function (alarmString) {
    let listElem = document.createElement("li")
    let labelElem = document.createElement("label")
    let deleteElem = document.createElement("button")

    deleteElem.innerText = "Delete" + alarmString[0]
    deleteElem.className = "delete"
    labelElem.innerText = alarmString

    listElem.appendChild(labelElem)
    listElem.appendChild(deleteElem)
    return listElem
}


// Clicking the alarm time button which triggers creating the alarm time element:
document.getElementById("setButton").addEventListener("click", function () {
    let user_Hr = setHr.options[setHr.selectedIndex].value;
    let user_Min = setMin.options[setMin.selectedIndex].value;
    let user_Sec = setSec.options[setSec.selectedIndex].value;
    let user_AMPM = setAMPM.options[setAMPM.selectedIndex].value;
    console.log(user_Hr, user_Min, user_Sec, user_AMPM)
    let len = schedule_alarm.length + 1

    // Getting today's time
    var ivt = new Date();
    var today_dd = String(ivt.getDate()).padStart(2, '0');
    var today_mm = String(ivt.getMonth() + 1).padStart(2, '0'); //January is 0!
    var today_yyyy = ivt.getFullYear();

    ivt = today_mm + '/' + today_dd + '/' + today_yyyy;
    let adjusthr = parseInt(user_Hr)
    if (user_AMPM == "PM") {
        adjusthr = 12 + adjusthr
    }

    if (user_AMPM == "AM" && adjusthr == 12) {
        adjusthr = 0
    }
    if (adjusthr.toString.length == 1) {
        adjusthr = '0' + adjusthr
    }
    let finalAlarm = adjusthr + ":" + user_Min + ":" + user_Sec
    var d = new Date(`${ivt} ${finalAlarm}`);

    // Getting time in milliseconds 
    var milliseconds = d.getTime();

    // storing alarm time data in an array
    schedule_alarm.push([user_Hr, user_Min, user_Sec, user_AMPM, milliseconds, len])

    // milliseconds time is used for sorting the array and the first element in the array
    // will be the first alarm to get triggered
    schedule_alarm = schedule_alarm.sort((a, b) => a[4] - b[4])
    let val = len.toString() + ") " + user_Hr + ":" + user_Min + ":" + user_Sec + ":" + user_AMPM

    // creating the alarm list element which includes delete button
    var listItem = createNewTaskElement(val)
    upcomingAlarmsholder.appendChild(listItem)
    // This function is used for deleting an alarm element
    appendAlarmEvents(listItem)

    // function to check alarm time with real time
    setInterval(() => {
        const date = new Date()
        let hr = date.getHours()
        let min = date.getMinutes()
        let sec = date.getSeconds()
        var AMPM = "AM"
        console.log("hours ",hr )
        if (date.getHours() == 0) {
            hr = 12
        }

        if (date.getHours() > 12) {
            if (date.getHours() == 12) {
                hr = 12
            } else {
                hr = hr - 12
            }
            AMPM = "PM"
        } else {
            AMPM = "AM"
        }

        if (hr.toString().length == 1) {
            hr = '0' + hr
        }
        if (min < 10) {
            min = '0' + min
        }
        if (sec < 10) {
            sec = '0' + sec
        }
        // When real time matches with alarm time, the alarm shows an alert and then starts ringing
        if (schedule_alarm.length != 0 && schedule_alarm[0][0] == hr && schedule_alarm[0][1] == min && schedule_alarm[0][2] == sec && schedule_alarm[0][3] == AMPM) {
            alert("Alarm is ringing")
            schedule_alarm.shift();
            schedule_alarm = schedule_alarm.sort((a, b) => a[4] - b[4])
            
        }
    }, 1000)
})

// When set clear button is clicked, alarm sound stops
// document.getElementById("setClear").addEventListener("click", function () {
//     sound.pause()
// })
var indDel = 0

// To delete  perticular alarm from the recent listed alarms:
var deleteAlarm = function () {
    let listItem = this.parentNode
    var ul = listItem.parentNode
    var deleteButton = listItem.querySelector("button.delete")
    indDel = parseInt(deleteButton.innerHTML[6])
    for (let i = 0; i < schedule_alarm.length; i++) {
        if (schedule_alarm[i][5] == indDel) {
            schedule_alarm.splice(i, 1)
        }
    }
    ul.removeChild(listItem)
}
var appendAlarmEvents = function (alarmListItem) {
    var deleteButton = alarmListItem.querySelector("button.delete")
    deleteButton.onclick = deleteAlarm
}