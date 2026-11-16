import { useEffect, useState } from 'react'
import './App.css'

interface Shuu {
  id: string
  shuu: string
  meret: number
  limited: boolean
  megjelenes: Date
}

function App() {
  const [shuuz, setShuuz] = useState<Shuu[]>([]);
  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("http://localhost:3000/shuuz")
        if (!response.ok) {
          throw new Error("Hiba az adatbeltöltésnél")
        }
        const data = await response.json() as Shuu[];
        setShuuz(data);
      }
      catch (error) {
        if (error instanceof Error) {
          console.error(error)
        }
      }
    }
    load()
  })
  return (
    <>
      <div className="container">
        <h1>Tzipűk</h1>
        <h2>Tzipű lizsda</h2>
        <table className="table table-hover table-bordered">
          <thead>
            <tr>
              <th>Név</th>
              <th>Méret</th>
              <th>Limitált</th>
              <th>Megjelenés dátuma</th>
            </tr>
          </thead>
          <tbody>
            { shuuz.map(shuu => (
              <tr key={shuu.id}>
                <td>{shuu.shuu}</td>
                <td>{shuu.meret}</td>
                <td>{shuu.limited}</td>
                <td>{shuu.megjelenes.toString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default App
