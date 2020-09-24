
//Variabler
var buildingId;
var buildingName;
var address;
var postalCode;
var city;
var country;

var smart = document.getElementById("SmartHut");
var myJWTToken = document.getElementById("JWTToken").value;
var server = "https://api.smarthut.se";

var user; // Den inloggades email
var url;  // Här lagras url till SignalR
var accessToken; // Här lagras accessToken

//GET: /BuildingInfo/GetMyBuilding
function GetMyBuilding() {
    fetch(`${server}/BuildingInfo/GetMyBuilding`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${myJWTToken}`
        }
    })
        .then(response => response.json())
        .then(function (jsonResponse) {
            buildingId = jsonResponse.id;
            buildingName = jsonResponse.name;
            address = jsonResponse.address;
            postalCode = jsonResponse.postalCode;
            city = jsonResponse.city;
            country = jsonResponse.country;
        })
        .then(() => GetBuildingDevices())
        .catch(err => console.log(JSON.stringify(err)));
}

//GET: /DeviceInfo/GetBuildingDevices/{buildingId}
function GetBuildingDevices() {
    fetch(`${server}/DeviceInfo/GetBuildingDevices/${buildingId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${myJWTToken}`
        }
    })
        .then(response => response.json())
        .then(function (jsonResponse) {
            var text = `<h1 style="color: #0000FF;">The Mercer</h1>
                        <div class="row">`;
            for (let i = 0; i < jsonResponse.length; i++) {
                var stringArray = jsonResponse[i].name.split(" ");
                var name = `${stringArray[1]} ${stringArray[2]} ${stringArray[3]}`;

                text += `<div class="col-md-3 room-card">
                            <div class="room-item">
                                <h5 class="text-center">${name}</h5><hr>
                                <div class="text-left">`;
                switch (jsonResponse[i].metricType) {
                    case 1:
                        text += `Värme (°C):  `; 
                        break;
                    case 2:
                        text += `Luftfuktighet (%): `;
                        break;
                    default:
                        console.log("Error in metricType");
                }
                text += `   <input type="text" style="width: 50px; font-weight: bold" id="${jsonResponse[i].id}" name="${jsonResponse[i].id}" />
                            
                        </div>
                    `;
                text += `<p class="text-left">Godkänd intervall [${jsonResponse[i].minValue} - ${jsonResponse[i].maxValue}]</p>`;
                text += `<input id="MIN-${jsonResponse[i].id}" type="hidden" value="${jsonResponse[i].minValue}" /> `;
                text += `<input id="MAX-${jsonResponse[i].id}" type="hidden" value="${jsonResponse[i].maxValue}" />`
                text += `<div class="text-center">
                            <button type="button"
                            class="btn btn-danger"
                            id="btn-${jsonResponse[i].id}"
                            style="visibility: hidden;"
                            onclick="resetDevice('${jsonResponse[i].id}')">Återställ</button>
                        </div></div>
                        </div>`;
            }
            text += `</div>`
            smart.innerHTML = text;
        })
        .then(() => createConnection())
        .catch(err => console.log(JSON.stringify(err)));
    
}

// Handskakning för att få ut url och accessToken
function createConnection() {
    user = document.getElementById("User").value;

    fetch(`https://smarthut.azurewebsites.net/api/negotiate`, {
        method: 'GET',
        headers: {
            'X-MS-SIGNALR-USERID': user
        }
    })
        .then(response => response.json())
        .then(function (jsonResponse) {
            url = jsonResponse.url;
            accessToken = jsonResponse.accessToken;
        })
        .then(() => Connection())
        .catch(err => console.log(JSON.stringify(err)));
}

function Connection() {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl(url, { accessTokenFactory: () => accessToken })
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.on("newTelemetry", (getData) => {

        document.getElementById(getData[0].deviceId.toLowerCase()).value = getData[0].value.toFixed(1);

        if ((document.getElementById(`MIN-${getData[0].deviceId.toLowerCase()}`).value) > getData[0].value.toFixed(1)
            || getData[0].value.toFixed(1) > (document.getElementById(`MAX-${getData[0].deviceId.toLowerCase()}`).value))
        { 
            document.getElementById(`btn-${getData[0].deviceId.toLowerCase()}`).style.visibility = "visible"; 
        }
    });
    
    connection.on("alarmNeutralized", (restoreAlarm) => {
        
        var btnId = restoreAlarm.substr(33, 36);
        
        if (restoreAlarm) {
            document.getElementById("btn-" + btnId).style.visibility = "hidden";
        }
    });

    async function start() {
        try {
            await connection.start();
            console.log("connected");
        } catch (err) {
            console.log(err);
            setTimeout(() => start(), 3000);
        }
    };

    connection.onclose(async () => {
        await start();
    });

    start();
}

function resetDevice(deviceId) {
    user = document.getElementById("User").value;
    document.getElementById(`btn-${deviceId}`).style.visibility = "hidden";

    fetch(`https://smarthut.azurewebsites.net/api/restorealarm`, {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${myJWTToken}`            
        },
        body: JSON.stringify({'deviceId': deviceId,'userName': user})
    })
        .then(console.log )
        .catch(err => console.log(JSON.stringify(err)));
}

GetMyBuilding();