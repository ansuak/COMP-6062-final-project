const express = require('express');
const fsp = require('fs').promises;
const app = express();
const port = 5001;
const path = 'data.json';

//Middleware to parse JSON req. body
app.use(express.json());

app.get('/api', (req, res) => {

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
      connected: json.bluetooth.connected });
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
          res.send({ newdevice: json.bluetooth.devices.find(device => device.id === reqId) });
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

//Use path parameters to get the next song
app.get('/api/playlist/:id', (req, res, next) => {
  const nextId = Number(req.params.id);
  fsp.readFile('data.json')
    .then((data) => {
      const json = JSON.parse(data);
      let songs = json.playlist;
      if(nextId > songs.length) {
        nextId = 1;
      }
      //const foundItem = songs.find((song) => song.id === nextId);
      res.send(songs.find((song) => song.id === nextId));
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