const TaskList = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <p className="italix text-gray-600">
        No hay tareas activas en el sistema para mostrar.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <h3 className="text-lg font-semibold mb-3">
        Lista de Tareas Indexadas (Recorrido AVL In-order por ID)
      </h3>

      <table className="w-full border-collapse text-left shadow-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 border-b-2 border-gray-300">ID</th>
            <th className="p-3 border-b-2 border-gray-300">Descripción</th>
            <th className="p-3 border-b-2 border-gray-300">Prioridad</th>
            <th className="p-3 border-b-2 border-gray-300">Vencimiento</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className={getPriorityRowClass(task.priority)}>
              <td className="p-3 border-b border-gray-200">{task.id}</td>
              <td className="p-3 border-b border-gray-200">
                {task.description}
              </td>
              <td className="p-3 border-b border-gray-200">
                {getPriorityLabel(task.priority)}
              </td>
              <td className="p-3 border-b border-gray-200">{task.dueDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- Estilos de Apoyo de Prioridad con Tailwind ---

const getPriorityRowClass = (priority) => {
  if (priority === 3) return "bg-red-50"; // Alta
  if (priority === 2) return "bg-yellow-50"; // Media
  return "bg-blue-50"; // Baja
};

const getPriorityLabel = (priority) => {
  if (priority === 3)
    return <span className="font-bold text-red-600">Alta</span>;
  if (priority === 2)
    return <span className="font-bold text-yellow-600">Media</span>;
  if (priority === 1)
    return <span className="font-bold text-blue-600">Baja</span>;
  return "N/A";
};

export default TaskList;
