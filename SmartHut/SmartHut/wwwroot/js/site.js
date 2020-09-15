// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

//Variabler
let SmartHut = document.getElementById("SmartHut");
let myJWTToken = document.getElementById("JWTToken").value;
let server = "https://api.smarthut.se";
let buildingId = "9eee90c3-55cb-48a1-8aa7-13b7083f2b6f";


let includeDevices = true; 
let devicesId = [
    "a115f84c-7e7e-4a7e-a982-0d984788f8c7",
    "a2bd8fef-e680-43db-bd29-54b3cb2284e7",
    "2ecf8aef-bd10-4a53-af03-558ef550f8f7",
    "896c6582-9e0d-44ee-97c5-a69fb7e68ca2",
    "702cd343-b9a4-4a15-bd2c-e5624e71423f",
    "4b2415da-c41d-435d-acdb-ef303383668b"
];

//Function to save the building identifier
function GetMyBuildingId() {
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
            console.log(jsonResponse.id)
        })
        .catch(err => console.log(JSON.stringify(err)));
}


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
        let text = `<h3>Get My Builgning</h3>`;
        text += `<p>Namn: ${jsonResponse.name} </p>`;
        text += `<p>Adress: ${jsonResponse.address} </p>`;
        text += `<p>Stad: ${jsonResponse.city} </p>`;
        text += `<p>Land: ${jsonResponse.country} </p>`;
        text += `<p>Postnummer: ${jsonResponse.postalCode} </p>`;
        SmartHut.innerHTML = text; 
    })
    .catch(err => console.log(JSON.stringify(err)));
}


//GET: /BuildingInfo/{id}/{includeDevices}
function GetBuildingInfo() {
    fetch(`${server}/BuildingInfo/${buildingId}/${includeDevices}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${myJWTToken}`
        }
    })
    .then(response => response.json())
    .then(function (jsonResponse) {
        let text = `<h3>Get My Builgning All Devices</h3>`;
        for (let i = 0; i < jsonResponse.devices.length; i++) {
            text += `<p>buildingId: ${jsonResponse.devices[i].buildingId} </p>`;
            text += `<p>minValue: ${jsonResponse.devices[i].minValue} </p>`;
            text += `<p>maxValue: ${jsonResponse.devices[i].maxValue} </p>`;
            text += `<p>unitId: ${jsonResponse.devices[i].unitId} </p>`;
            text += `<p>metricType: ${jsonResponse.devices[i].metricType} </p>`;
            text += `<p>id: ${jsonResponse.devices[i].id} </p>`;
            text += `<p>name: ${jsonResponse.devices[i].name} </p>`;
        }
        SmartHut.innerHTML = text;
    })
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
        let text = `<h3>Get My Builgning All Devices</h3>`;
        for (let i = 0; i < jsonResponse.length; i++) {
            text += `<p>buildingId: ${jsonResponse[i].buildingId} </p>`;
            text += `<p>minValue: ${jsonResponse[i].minValue} </p>`;
            text += `<p>maxValue: ${jsonResponse[i].maxValue} </p>`;
            text += `<p>unitId: ${jsonResponse[i].unitId} </p>`;
            text += `<p>metricType: ${jsonResponse[i].metricType} </p>`;
            text += `<p>id: ${jsonResponse[i].id} </p>`;
            text += `<p>name: ${jsonResponse[i].name} </p>`;
        }
        SmartHut.innerHTML = text;
    })
    .catch(err => console.log(JSON.stringify(err)));
}


//GET: /DeviceInfo/{id}
function GetDeviceInfo(id) {
    fetch(`${server}/DeviceInfo/${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${myJWTToken}`
        }
    })
        .then(response => response.json())
        .then(function (jsonResponse) {
            let text = `<h3>Get Device Info</h3>`;
            text += `<p>buildingId: ${jsonResponse.buildingId} </p>`;
            text += `<p>minValue: ${jsonResponse.minValue} </p>`;
            text += `<p>maxValue: ${jsonResponse.maxValue} </p>`;
            text += `<p>unitId: ${jsonResponse.unitId} </p>`;
            text += `<p>metricType: ${jsonResponse.metricType} </p>`;
            text += `<p>id: ${jsonResponse.id} </p>`;
            text += `<p>name: ${jsonResponse.name} </p>`;
            SmartHut.innerHTML = text;
        })
        .catch(err => console.log(JSON.stringify(err)));
}

GetMyBuilding();
//GetBuildingInfo();
//GetBuildingDevices();
//GetDeviceInfo(devicesId[0]);


