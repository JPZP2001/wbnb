import Info from './components/Weather/Info'
import Scene from './components/Weather/Scene'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Weather but not boring
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Info />
          <Scene />
        </div>
      </div>
    </div>
  )
}

export default App