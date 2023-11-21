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
  return (
    <>
     <div>
      Hello
     </div>
    </>
  )
}

export default App
