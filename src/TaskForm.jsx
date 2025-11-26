import { useState } from "react";

const TaskForm = ({ onAddTask }) => {
  // Estado local para manejar los valores del formulario.
  const [taskData, setTaskData] = useState({
    description: "",
    priority: "Media", // Valor por defecto.
    dueDate: new Date().toISOString().substring(0, 10), // Fecha de hoy por defecto.
  });

  // Maneja los cambios en los campos del formulario.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Maneja el envío del formulario.
  const handleSubmit = (e) => {
    e.preventDefault();

    // LLamamos a la función principal para insertar la tarea en Heap y AVL.
    onAddTask(taskData);

    // Resetear el formulario después del envío.
    setTaskData({
      description: "",
      priority: "Media",
      dueDate: new Date().toISOString().substring(0, 10),
    });
  };

  return (
    <div className="p-5 border border-gray-300 rounded-lg bg-gray-50 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Agregar Nueva Tarea</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Campo: Descripción */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-gray-700">Descripción</label>
          <input
            type="text"
            name="description"
            value={taskData.description}
            onChange={handleChange}
            required
            placeholder="Ej: Estudiar para el examen"
            className="px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        {/* Campo: Prioridad */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-gray-700">Prioridad</label>
          <select
            name="priority"
            value={taskData.priority}
            onChange={handleChange}
            required
            className="px-2 py-2 border rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
          >
            {/* Recordatorio: Alta=3, Media=2, Baja=1 */}
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>

        {/* Campo: Fecha de Vencimiento */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-gray-700">
            Fecha de Vencimiento
          </label>
          <input
            type="date"
            name="dueDate"
            value={taskData.dueDate}
            onChange={handleChange}
            required
            className="px-3 py-2 border rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition cursor-pointer"
        >
          Insertar Tarea
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
