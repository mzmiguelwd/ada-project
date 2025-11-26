import { useState } from "react";

const DeleteForm = ({ onDeleteTask }) => {
  const [deleteId, setDeleteId] = useState("");

  const handleChange = (e) => {
    // Solo números
    const value = e.target.value.replace(/[^0-9]/g, "");
    setDeleteId(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (deleteId) {
      onDeleteTask(deleteId);
    } else {
      alert("Por favor, ingresa el ID de la tarea a completar.");
    }

    setDeleteId("");
  };

  return (
    <div className="p-5 border border-gray-300 rounded-lg bg-gray-50 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Completar Tarea por ID</h3>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          name="deleteId"
          value={deleteId}
          onChange={handleChange}
          required
          placeholder="ID Único de la Tarea"
          className="grow px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
        />

        <button
          type="submit"
          className="px-4 py-2 rounded-lg font-medium bg-amber-600 text-white hover:bg-amber-700 transition cursor-pointer"
        >
          Completar
        </button>
      </form>
    </div>
  );
};

export default DeleteForm;
