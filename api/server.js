const express = require('express');
const fsp = require('fs').promises;
const app = express();
const port = 5001;
const path = 'data.json';

//Middleware to parse JSON req. body
app.use(express.json());

// function readJsonFile(filePath){
//   try {
//     fsp.readFile(filePath)
//     .then((data) => {
//     const json = JSON.parse(data);
//     return json;
//   })
//   }
//   catch(err) {
//     console.error('Error reading JSON file:', err);
//   }
// }

app.get('/api', (req, res) => {
 
  // const data = readJsonFile(path);
  // console.log(data);
  // res.send(data);
  res.send("Hello World");
});

app.get('/api/volume', (req, res, next) => {
  fsp.readFile(path)
    .then((data) => {
      const json = JSON.parse(data);
      res.send({ volume: json.volume });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Data file not found or corrupt');
    });
});

app.put('/api/volume', (req, res, next) => {
  fsp.readFile(path)
    .then((data) => {
      const json = JSON.parse(data);
      const newVol = Number(req.body.volume);
      newVol? json.volume = newVol: res.status(400).send('Invalid Volume data');           
      fsp.writeFile(path, JSON.stringify(json))
        .then(() => {
          res.send({ volume: Number(req.body.volume) });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Data file not found or corrupt');
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Data file not found or corrupt');
      });
});

//GET - list all devices
app.get('/api/bluetooth', (req, res, next) => {
  fsp.readFile(path)
    .then((data) => {
      const json = JSON.parse(data);
      res.send({ bluetooth: json.bluetooth.devices });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Data file not found or corrupt');
    });
});

//GET - return the connected device
app.get('/api/bluetooth/connected', (req, res, next) => {
  fsp.readFile(path)
  .then((data) => {
    const json = JSON.parse(data);
    res.send({
      "connected device id": json.bluetooth.connected });
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Data file not found or corrupt')
  });
});

//PUT - Set the connected device
app.put('/api/bluetooth/connected', (req, res, next) => {
  const reqId = Number(req.body.connected);
  fsp.readFile(path)
    .then((data) => {
      const json = JSON.parse(data);
      if(json.bluetooth.devices.some(device => device.id === reqId))
      {
        json.bluetooth.connected = reqId;
        fsp.writeFile('data.json', JSON.stringify(json))
        .then(() => {
          res.send({ connected: Number(req.body.connected) });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Connected device updation failed');
        });
      }
      else {
        res.status(400).json({ error: 'Device not found' });
      }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Data file not found or corrupt');
      });
});

// Path params
app.get('/api/songs/:id', (req, res) => {
  res.send(req.params.id);
  console.log(req.query);
});

//Use query string parameters to get the next song
app.get('/api/playlist', (req, res, next) => {
  const nextId = Number(req.query.id);
  fsp.readFile('data.json')
    .then((data) => {
      const json = JSON.parse(data);
      let songs = json.playlist;1
      if(nextId > songs.length) {
        nextId = 1;
      }
      const foundItem = songs.find((item) => item.id === nextId);
      if(foundItem == null)
      {
        res.send('Song not found');
      }
      const response = {
        current_song_id: nextId,
        song: foundItem
      };
      res.json(response);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Data file not found or corrupt');
    });
  
  //res.send(req.query.id);
});

const logError = (err, req, res, next) => {
  console.error(err);
  next(err);
};

const handleError = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).send('An error occured');
};

// Error handling middleware
app.use(logError);
app.use(handleError);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});