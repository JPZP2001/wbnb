import Info from './components/Weather/Info'
import Scene from './components/Weather/Scene'

function App() {
  return (
    <div className="w-screen h-screen relative bg-gradient-to-b from-blue-500 to-blue-700">
      <div className="relative container mx-auto px-4 py-8 z-50">
        <h1 style={{marginLeft: "10%", fontSize: "4vh", marginTop: "50px"}}>
          Weather but not boring
        </h1>
        <div style={{ position: "absolute", left: "2.5%", zIndex: 10, width: "40vw" }}>
          <Info />
        </div>
      </div>

      <div className="absolute inset-0 z-0" style={{ position: "absolute", right: 0, zIndex: 0 }}>
        <Scene />
      </div>
    </div>
  )
}

export default App