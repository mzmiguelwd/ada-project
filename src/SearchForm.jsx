import { useState } from "react";

const SearchForm = ({ onSearchTask }) => {
  const [searchId, setSearchId] = useState("");

  const handleChange = (e) => {
    // Asegura que solo se ingresen números.
    const value = e.target.value.replace(/[^0-9]/g, "");
    setSearchId(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (searchId) {
      onSearchTask(searchId);
    } else {
      alert("Por favor, ingresa un ID para buscar.");
    }

    setSearchId("");
  };

  return (
    <div className="p-5 border border-gray-300 rounded-lg bg-gray-50 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Buscar Tarea por ID (AVL)</h3>

      <form onSubmit={handleSubmit} className="flex gap-3">
        {/* Campo de ID de Búsqueda */}
        <input
          type="text"
          name="searchId"
          value={searchId}
          onChange={handleChange}
          required
          placeholder="ID Único de la Tarea"
          className="grow px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
        />

        <button
          type="submit"
          className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
        >
          Buscar
        </button>
      </form>
    </div>
  );
};

export default SearchForm;
