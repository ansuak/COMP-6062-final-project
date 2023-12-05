const express = require('express');
const fsp = require('fs').promises;
const app = express();
const port = 5001;

//Middleware to parse JSON req. body
app.use(express.json());

app.get('/api', (req, res) => {
  res.send('Hello World!')
});

app.get('/api/volume', (req, res, next) => {
  fsp.readFile('data.json')
    .then((data) => {
      const json = JSON.parse(data);
      res.send({ volume: json.volume });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Data file not found or corrupt');
    });
});

app.put('/api/volume', (req, res) => {
  fsp.readFile('data.json')
    .then((data) => {
      const json = JSON.parse(data);
      json.volume = Number(req.body.volume);
      fsp.writeFile('data.json', JSON.stringify(json))
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
  fsp.readFile('data.json')
    .then((data) => {
      const json = JSON.parse(data);
      res.send({ bluetooth: json.bluetooth });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Data file not found or corrupt');
    });
});

//GET - return the connected device
app.get('/api/bluetooth/connected', (req, res, next) => {
  fsp.readFile('data.json')
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

// Path params
app.get('/api/songs/:id', (req, res) => {
  res.send(req.query.id);
  console.log(req.query);
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