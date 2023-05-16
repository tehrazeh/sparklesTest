import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios'

type DataType = Array<Array<string>> // type of initial data that returns
type Rarities = { // type of modified data to track checked status
  rarity: string[],
  isChecked: boolean
}

function App() {

  // state that preserves the data
  const [data, setData] = useState<Rarities[]>([])

  // retrieve the data from the server
  useEffect(() => {
    axios.get<DataType>('http://reshade.io:1234/').then(response => {
      const rarities = response.data.map(rarity => { // transform the data to add property to track checked
        return {
          rarity,
          isChecked: false
        }
      })
      setData(rarities)
    })
  }, [])


  // logs information about all clicked rarities on each update/click
  useEffect(() => {
    console.log(data)
  }, [data])

  const options = data.map(element => {
    return <div className='rarityContainer' key={element.rarity[1]}>
      <input type="checkbox" className='checkBox' name={element.rarity[0]}
        onChange={(e) => handleChange(e)}
        checked={element.isChecked || false}
      />
      <p>{element.rarity[0]}</p>
    </div>
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    const tempRarities = data.map(rarityInstance => {
      return rarityInstance.rarity[0] === name ? { ...rarityInstance, isChecked: checked } : rarityInstance
    })
    setData(tempRarities)
  }

  return (
    <div className="App">
      <div className='rarityContainer'>
        <input type="checkbox" className='checkBox' onChange={(e) => {
          const tempRarities = data.map(rarityInstance => {
            return { ...rarityInstance, isChecked: e.target.checked }
          })
          setData(tempRarities)
        }}
          checked={data.filter(element => element.isChecked !== true).length < 1}
        />
        <p>All</p>
      </div>
      {options}
    </div>
  );
}

export default App;