// Configuration Google Sheets API
const API_KEY = '249985263848-54o97a600a2l9mc39iaab73isli1fbaf.apps.googleusercontent.com';
const SHEET_ID = '1SFrSGMPhtDujjGePSnXdCyTmVlhVbsunhfuh0-H1Nyo';

// Initialisation du scanner
let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });

scanner.addListener('scan', function (content) {
    checkIn(content);
});

Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
        scanner.start(cameras[0]);
    } else {
        console.error('Pas de caméra trouvée.');
    }
}).catch(function (e) {
    console.error(e);
});

// Fonction de check-in
function checkIn(id) {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'A:E',
    }).then(function(response) {
        let values = response.result.values;
        let row = values.findIndex(row => row[3] === id);
        if (row !== -1) {
            updateSheet(row + 1);
            document.getElementById('result').innerText = 'Check-in réussi pour ' + values[row][0] + ' ' + values[row][1];
        } else {
            document.getElementById('result').innerText = 'ID non trouvé';
        }
    }, function(response) {
        console.error('Erreur : ' + response.result.error.message);
    });
}

// Mise à jour de la feuille Google Sheets
function updateSheet(row) {
    gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: 'E' + row,
        valueInputOption: 'RAW',
        resource: {
            values: [['Checked-in']]
        }
    }).then(function(response) {
        console.log('Mise à jour réussie');
    }, function(response) {
        console.error('Erreur : ' + response.result.error.message);
    });
}

// Initialisation de l'API Google Sheets
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    }).then(function() {
        console.log('Google Sheets API initialisée');
    }, function(error) {
        console.error('Erreur : ' + error.details);
    });
}

gapi.load('client', initClient);