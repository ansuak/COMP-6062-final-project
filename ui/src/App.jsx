import { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [volume, setVolume] = useState(5);
  const [showVolume, setShowVolume] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState('n/a')
  const [bluetoothDevice, setBluetoothDevice] = useState('');
  const [showBluetoothScreen, setShowBluetoothScreen] = useState(false);
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [isPlay, setIsPlay] = useState(false)
  const [currentSong, setCurrentSong] = useState('');
  const audioPlaybackRef = useRef(null);
  useEffect(() => {
    axios.get("/api").then((response) => {
      console.log(response)
      getVolume(5);
      getplaylist(1);
      listBluetooth();
      connectedBluetoothDevice();
    })
  },[]);

  const handleVolume = (newVolume) => {
    setVolume(newVolume);
    changeVolume(newVolume);
   }

  //fetching current volume from data.json
  const getVolume =() => {
    axios.get('/api/volume')
      .then((response) => {
        console.log({response});
        setVolume(response.data.volume);
      }).catch(err => console.error(err)) 
  }

  //updating the volume in file
  const changeVolume= (newVol) => {
    axios.put('/api/volume', {volume: newVol})
    .then((response) => {
      setVolume(response.data.volume);
    }).catch(err => console.error(err))   
  }
  const handleBluetooth = () => {
    setShowBluetoothScreen(true);
    listBluetooth();
  }
  //List all blueetooth devices available
  const listBluetooth = () =>{
    axios.get('/api/bluetooth')
      .then((response) => {
        setBluetoothDevice(response.data.bluetooth);
      }).catch(err => console.error(err)) 
  }

  //fetch the connected blueetooth device
  const connectedBluetoothDevice = () => {
    axios.get('/api/bluetooth/connected')
      .then((response) => {
        setConnectedDevice(response.data.connected);
        console.log(response.data.connected);
        
      }).catch(err => console.error(err)) 
  }

  //Set the connected device
  const changeDevices = (newDev) => {
    axios.put('/api/bluetooth/connected', {connected: newDev})
    .then((response) => {
      setConnectedDevice(response.data.newdevice);
      console.log(response.data.newdevice)
    }).catch(err => console.error(err))
  }
  
  const nextTrack = () => {
    const nextId = (currentSong.id + 1) > 5 ? 1: currentSong.id + 1;
    getplaylist(nextId);
  }
  const getplaylist = (songId) => {
    axios.get(`/api/playlist/${songId}`)
    .then(response => {
      console.log(response)
      setCurrentSong(response.data);
    })
    .catch(err => console.error(err))
  }

  const backToaudio = () => {
    setShowBluetoothScreen(false);
    window.location.reload();
  }
   
  return (
    <>
      {!showBluetoothScreen?
      <div className="audio-player">
      <div>
        <img src={currentSong.albumArt} alt="Album Art" />
        <h2>{currentSong.title}</h2>
        <p>{currentSong.artist}</p>
        <p>Connected Bluetooth Device: {connectedDevice ? connectedDevice : 'n/a'}</p>
      </div>
      <audio
        ref={audioPlaybackRef}
        controls
        src={currentSong.src}
        >
     </audio>

      <div>
      <button onClick={() => handleVolume(volume-1)}>Volume Down</button>
        <input
        type="range"
        id="volume-slider"
        min="0"
        max="10"
        step="1"
        value={volume}
        onChange={(e) => handleVolume(parseInt(e.target.value, 10))}
        onMouseEnter={() => setShowVolume(true)}
        onMouseLeave={() => setShowVolume(false)}
      />
      <button onClick={() => handleVolume(volume+1)}>Volume Up</button>
      {showVolume && <span className="volume-label">{volume}</span>}
      </div>

    <button onClick={() => setIsPlay(!isPlay)}>{isPlay ? 'Pause' : ' Play'}</button>
    <button onClick={() => setIsPlay(false) }>Stop</button>
    <button onClick={() => setLoopEnabled(true)}>
        {loopEnabled ? 'Loop On' : 'Loop Off'}
      </button>
    <button onClick={() => nextTrack()}>Next Track</button>
      <button onClick={() => handleBluetooth()}>Bluetooth</button>
    
    </div>
       :
       <div>
      <h1>Bluetooth Devices Screen</h1>
      <ul>
        {bluetoothDevice && bluetoothDevice.map(device => (
          <li key={device.id}>
            {device.name}
            {bluetoothDevice && bluetoothDevice.id === device.id ? (
              <button onClick={() => changeDevices(null)}>Disconnect</button>
            ) : (
              <button onClick={() => changeDevices(device.id)}>Connect</button>
            )}
          </li>
        ))}
      </ul>
      <button onClick={backToaudio}>Back to Audio Screen</button>
    </div>
      }
    </>
  )
}

export default App
