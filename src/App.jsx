import TaskManagerSystem from "./TaskManagerSystem";

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-amber-700">
        Sistema de Gestión Tareas con Heap + AVL
      </h1>

      <div className="w-full max-w-3xl">
        <TaskManagerSystem />
      </div>
    </div>
  );
}

export default App;
