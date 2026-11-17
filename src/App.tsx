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
  const [nev, setNev] = useState("");
  const [meret, setMeret] = useState<number>(40);
  const [limited, setLimited] = useState(false);
  const [megjelenes, setMegjelenes] = useState<Date>();
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
  }, [])
  async function newShuu(e) {
    e.preventDefault();
    const ujTzipu = {
      nev,
      meret,
      limited,
      megjelenes: megjelenes?.toISOString().split("T")[0]
    }
    try {
      const response = await fetch("http://localhost:3000/shuuz", {
        "method": "POST",
        "headers": {
          "Content-Type": "application/json"
        },
        "body": JSON.stringify(ujTzipu)
      });
      if (!response.ok) {
        throw new Error("Hiba az adatfelvételnél");
      }
      const tzipu = await response.json() as Shuu;
      setShuuz((elozo) => [...elozo, tzipu]);
    }
    catch (error) {
      if (error instanceof Error) {
        console.error(error);
      }
    }
    finally {
      setNev("");
      setMeret(40);
      setLimited(false);
      let temp = new Date();
      setMegjelenes(temp);
    }
  }
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
                <td>{shuu.limited ? "Igen" : "Nem"}</td>
                <td>{shuu.megjelenes.toString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>Úly tzipű</h2>
        <form onSubmit={newShuu}>
          <label htmlFor="name" className='form-label'>Tzipű newe</label>
          <input className='form-control mb-3' type="text" name="name" onChange={(e) => setNev(e.target.value)} value={nev}/>
          <label htmlFor="meret">Mérede</label>
          <input type="number" name="meret" className='form-control mb-3' value={meret} onChange={(e) => setMeret(e.target.valueAsNumber)}/>
          <label htmlFor="limited">Limidált?</label>
          <input type="checkbox" name="limited" onChange={() => setLimited(most => !most)}/> <br />
          <label htmlFor="megjelenes">Mekjelenézs idelye</label>
          <input type="date" name="megjelenes" className='form-control mb-3' onChange={(e) => setMegjelenes(e.target.valueAsDate != null ? e.target.valueAsDate : megjelenes)}/>
          <button type="submit" className='btn btn-primary'>Felwédel</button>
        </form>
      </div>
    </>
  )
}

export default App
