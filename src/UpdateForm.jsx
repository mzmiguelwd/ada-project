import { useState } from "react";

const UpdateForm = ({ onUpdateTask }) => {
  const [form, setForm] = useState({
    id: "",
    description: "",
    priority: "Media",
    dueDate: new Date().toISOString().substring(0, 10),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "id") {
      // Solo números para el ID
      setForm((prev) => ({ ...prev, id: value.replace(/[^0-9]/g, "") }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.id) {
      alert("Ingresa un ID válido para actualizar.");
      return;
    }
    onUpdateTask({ ...form });
    // Opcional: no limpiar el ID para permitir actualizaciones consecutivas
    setForm((prev) => ({ ...prev, description: "", priority: "Media" }));
  };

  return (
    <div className="p-5 border border-gray-300 rounded-lg bg-gray-50 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Actualizar Tarea por ID</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="font-medium text-gray-700">ID</label>
          <input
            type="text"
            name="id"
            value={form.id}
            onChange={handleChange}
            required
            placeholder="ID de la tarea a actualizar"
            className="px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-medium text-gray-700">Descripción</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            placeholder="Nueva descripción"
            className="px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-medium text-gray-700">Prioridad</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            required
            className="px-2 py-2 border rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
          >
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-medium text-gray-700">Fecha de Vencimiento</label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            required
            className="px-3 py-2 border rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 rounded-lg font-medium bg-purple-600 text-white hover:bg-purple-700 transition cursor-pointer"
        >
          Actualizar Tarea
        </button>
      </form>
    </div>
  );
};

export default UpdateForm;
