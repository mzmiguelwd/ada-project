import TaskManagerSystem from "./components/TaskManagerSystem.jsx";

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h1 className="text-xl font-bold mb-6 text-gray-700">
        Proyecto Final: Análisis y Diseño de Algoritmos I - Brandon Lasprilla
        (2417592) y Juan Manjarrez (2415330)
      </h1>

      <div className="w-full max-w-7xl">
        <TaskManagerSystem />
      </div>
    </div>
  );
}

export default App;
