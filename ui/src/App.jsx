import { useState, useEffect } from 'react'
import axios from 'axios';
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    axios.get("/api").then((response) => {
      console.log(response)
    })
  },[]);

  // useEffect(() => {
  //   axios.get('/api/volume')
  //     .then((response) => {
  //       console.log({response});
  //     });

  //   console.log('Execution continuing...');
  // }, []);
  return (
    <>
     <div>
      Hello
     </div>
    </>
  )
}

export default App
