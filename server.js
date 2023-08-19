const express = require('express');
const app = express();
const axios = require('axios');


const creds = {
	"companyName": "2TAP",
	"clientID": "518f84ca-2c16-4f6c-a973-ffe9436afbf9",
	"clientSecret": "WbspgheqXXumwlaM",
	"ownerName": "Sahith",
	"ownerEmail": "sahith007@gmail.com",
	"rollNo": "AM.EN.U4CSE20358"
}

let accessToken;

var options = {
    method: 'POST',
    url: 'http://20.244.56.144/train/auth',
    headers: {'Content-Type': 'application/json'},
    data: creds
};


axios.request(options).then(function (response) {
    accessToken = response.data.access_token;
    }).catch(function (error) {
    console.error(error);
    });



//get train data using access token
app.get('/', (req, res) => {

    const now = new Date();
    const twelveHoursLater = new Date(now.getTime() + 12 * 60 * 60 * 1000);

    var options = {
        method: 'GET',
        url: 'http://20.244.56.144/train/trains',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken
        },
        data: creds
      };
      
      axios.request(options).then(function (response) {
        trains = response.data;
        console.log(trains);

        //filter only next 12 hours
        const filteredTrains = trains.filter((train) => {
            const departureTime = new Date();
            departureTime.setHours(train.departureTime.Hours);
            departureTime.setMinutes(train.departureTime.Minutes);
            departureTime.setSeconds(train.departureTime.Seconds);
            return departureTime >= now && departureTime <= twelveHoursLater;
          });

        res.send(filteredTrains);

      }).catch(function (error) {
        console.error(error);
      });


});


app.listen(3000, () => {
  console.log('Server listening on port 3000');
});