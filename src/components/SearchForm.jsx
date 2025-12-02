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
    <div className="p-5 border border-orange-300 rounded-xl bg-white shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-orange-700">
        Buscar Tarea por ID (AVL)
      </h3>

      <form onSubmit={handleSubmit} className="flex gap-3">
        {/* Campo de ID de Búsqueda */}
        <input
          type="text"
          name="searchId"
          value={searchId}
          onChange={handleChange}
          required
          placeholder="ID Único de la Tarea"
          className="grow px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition duration-150"
        />

        <button
          type="submit"
          className="px-4 py-2 rounded-lg font-bold bg-sky-600 text-white shadow-md hover:bg-sky-700 transition duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          Buscar
        </button>
      </form>
    </div>
  );
};

export default SearchForm;
