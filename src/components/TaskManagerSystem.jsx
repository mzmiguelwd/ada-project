import { useState, useMemo, useRef } from "react";

import { Task } from "../classes/Task.js";
import { MaxHeap } from "../classes/MaxHeap.js";
import { AVLTree } from "../classes/AVL.js";

import TaskForm from "../components/TaskForm.jsx";
import SearchForm from "../components/SearchForm.jsx";
import TaskList from "../components/TaskList.jsx";
import DeleteForm from "../components/DeleteForm.jsx";
import UpdateForm from "../components/UpdateForm.jsx";

function TaskManagerSystem() {
  // Inicializar las estructuras de datos solo una vez usando useMemo.
  const { heap, avlTree } = useMemo(() => {
    // Se crean las instancias de las estructuras de datos.
    const heapInstance = new MaxHeap();
    const avlTreeInstance = new AVLTree();
    return { heap: heapInstance, avlTree: avlTreeInstance };
  }, []); // El array vacío asegura que solo se ejecute una vez.

  // Estado para manejar y renderizar la lista de tareas visibles (obtenidas del AVL en orden).
  const [tasks, setTasks] = useState([]);
  // Estado para manejar mensajes de la aplicación (éxito, error, búsqueda) mostrados al usuario.
  const [message, setMessage] = useState("");
  // Estado para mostrar la representación en array del Heap (solo para debug).
  const [heapArray, setHeapArray] = useState([]);
  // Estado para mostrar la representación en array in-order del AVL (solo para debug).
  const [avlArray, setAvlArray] = useState([]);
  // Estado para la visualización del árbol AVL en formato ASCII Art.
  const [avlVisual, setAvlVisual] = useState("");
  // Estado para la visualización del árbol Heap en formato ASCII Art.
  const [heapVisual, setHeapVisual] = useState("");
  // Referencia para generar ID's únicos de tareas que persisten entre renders.
  const idCounter = useRef(1);

  // ===== Lógica del Sistema =====

  /**
   * Inserta la tarea tanto en el Heap (para prioridad) como en el AVL (para indexación).
   * @param {object} newTaskData - Datos de la tarea desde el formulario.
   */
  const handleAddTask = (newTaskData) => {
    // Generar un ID autoincremental.
    const id = idCounter.current;
    idCounter.current = id + 1;

    // Convertir prioridad de string ('Alta', 'Media', 'Baja') a número (3, 2, 1).
    const priorityMap = { Baja: 1, Media: 2, Alta: 3 };
    const numericPriority = priorityMap[newTaskData.priority] || 1;

    try {
      const newTask = new Task(
        id,
        newTaskData.description,
        numericPriority,
        newTaskData.dueDate
      );

      // 1. Insertar en el Heap (para gestión de la prioridad).
      heap.insert(newTask);

      // 2. Insertar en el AVL (para indexación por ID).
      avlTree.insert(newTask.id, newTask);

      setMessage(
        `✅ Tarea agregada: | ID "${id}" | "${newTask.description}" | Prioridad "${newTaskData.priority}" | Vencimiento "${newTaskData.dueDate}"`
      );

      refreshTaskList(); // Actualiza la interfaz.
    } catch (error) {
      setMessage(`❌ Error al agregar tarea: ${error.message}`);
    }
  };

  /**
   * Maneja la actualización de una tarea existente por su ID.
   * Requiere re-insertar en el Heap si la prioridad cambia.
   * @param {object} payload - Datos de la tarea a actualizar.
   */
  const handleUpdateTask = (payload) => {
    const parseId = parseInt(payload.id);
    if (isNaN(parseId)) {
      setMessage(`⚠️ ID Inválido: Por favor, introduce un ID numérico válido.`);
      return;
    }

    // 1. Buscar la tarea en el índice AVL para obtener la referencia.
    const existing = avlTree.search(parseId);
    if (!existing) {
      setMessage(
        `❌ Actualización Fallida: No existe tarea con ID "${parseId}" en el índice AVL.`
      );
      return;
    }

    // 2. Remover del Heap: Es necesario remover y re-insertar para garantizar que la nueva prioridad
    //    mantenga el invariante del Heap.
    heap.removeById(parseId);

    // Mapear prioridad textual a numérica y actualizar el objeto Task (referencia compartida).
    const priorityMap = { Baja: 1, Media: 2, Alta: 3 };
    const numericPriority = priorityMap[payload.priority] || existing.priority;

    existing.description = payload.description;
    existing.priority = numericPriority;
    existing.dueDate = payload.dueDate;

    // 3. Reinsertar al heap con la nueva prioridad.
    heap.insert(existing);

    setMessage(
      `🔄 Tarea actualizada: | ID "${parseId}" | "${existing.description}" | Prioridad "${payload.priority}" | Vencimiento "${existing.dueDate}"`
    );
    refreshTaskList();
  };

  /**
   * Extrae la tarea más prioritaria (raíz del Heap) y la elimina de ambas estructuras.
   */
  const handleCompleteTopTask = () => {
    // 1. Elimina y retorna la tarea de mayor prioridad del Heap.
    const topTask = heap.extractMax();

    if (topTask) {
      // 2. Eliminar del AVL para mantener la sincronización y el índice.
      avlTree.delete(topTask.id);
      setMessage(
        `✅ Tarea completada: | ID "${topTask.id}" | "${topTask.description}"`
      );
      refreshTaskList();
    } else {
      setMessage(`⚠️ La cola de prioridad está vacía. No hay tareas urgentes.`);
    }
  };

  /**
   * Buscar una tarea utilizando el índice AVL por su ID.
   * @param {string} id - ID de la tarea a buscar (en formato string).
   */
  const handleSearchTask = (id) => {
    const parseId = parseInt(id);
    if (isNaN(parseId)) {
      setMessage(`⚠️ Por favor, introduce un ID numérico válido.`);
      return;
    }

    // Buscar tarea usando el índice AVL (O(log n)).
    const foundTask = avlTree.search(parseId);

    if (foundTask) {
      setMessage(
        `✅ Tarea encontrada: | ID "${parseId}" | "${foundTask.description}" | Prioridad "${foundTask.priority}" |`
      );
    } else {
      setMessage(`⚠️ Tarea con ID "${parseId}" no encontrada en el índice.`);
    }
  };

  /**
   * Elimina una tarea por ID (función de "completar" arbitraria).
   * @param {string} id - ID de la tarea a eliminar (en formato string).
   */
  const handleDeleteTaskById = (id) => {
    const parseId = parseInt(id);
    if (isNaN(parseId)) {
      setMessage(`⚠️ Por favor, introduce un ID numérico válido.`);
      return;
    }

    const existing = avlTree.search(parseId);
    if (!existing) {
      setMessage(`⚠️ No existe tarea con ID ${parseId} en el índice.`);
      return;
    }

    // 1. Eliminar del AVL (mantener índice limpio).
    avlTree.delete(parseId);
    // 2. Eliminar también del Heap (operación O(n) + reequilibrio O(log n)).
    const removed = heap.removeById(parseId);

    if (removed) {
      setMessage(
        `✅ Tarea completada: | ID "${parseId}" | "${removed.description}"`
      );
    } else {
      setMessage(
        `Tarea con ID ${parseId} eliminada del AVL. No estaba presente en el heap (posible desincronización).`
      );
    }

    refreshTaskList();
  };

  /**
   * Función central para actualizar el estado de la GUI después de cualquier operación.
   * Obtiene los datos actualizados de las estructuras y genera las visualizaciones de debug.
   */
  const refreshTaskList = () => {
    // Usa el método In-order del AVL para obtener todas las tareas activas ordenadas por ID.
    const currentTasks = avlTree.getTasksInOrder();
    setTasks(currentTasks); // Actualiza la lista principal.
    setMessage((prev) => prev); // Mantiene el mensaje actual.

    // Actualiza los estados de debug para la interfaz:
    setHeapArray([...heap.heap]); // Array plano del Heap.
    setAvlArray(avlTree.getTasksInOrder()); // Array in-order del AVL.
    setHeapVisual(heap.printHeap()); // Visualización en ASCII Art del Heap.
    setAvlVisual(avlTree.printAVL()); // Visualización en ASCII Art del AVL.
  };

  // Renderizar la GUI
  return (
    <div className="bg-white shadow-2xl rounded-xl p-8 space-y-4 mx-auto max-w-5xl border border-gray-100">
      {/* ======================= ENCABEZADO Y ESTADO DEL SISTEMA ======================= */}
      <header className="text-center pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-extrabold text-orange-600">
          Task Manager Pro
        </h1>
        <p className="text-md text-gray-500 mt-1">
          Heap para prioridad + AVL para indexación
        </p>
      </header>

      {/* ======================= CONTROLES Y OPERACIONES DE TAREAS ======================= */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-orange-700 border-b pb-2">
          Herramientas de Tareas
        </h2>

        {/* Grid 2x2 para las funcionalidades principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TaskForm onAddTask={handleAddTask} />
          <UpdateForm onUpdateTask={handleUpdateTask} />
          <SearchForm onSearchTask={handleSearchTask} />
          <DeleteForm onDeleteTask={handleDeleteTaskById} />
        </div>

        {/* Componente de visualización del mensaje (éxito, error, estado) */}
        <div className="mt-4 p-3 bg-orange-50 border-l-4 border-orange-500 text-orange-800 rounded-md font-medium">
          {message || "Sistema listo. Agregue una tarea para empezar."}
        </div>

        {/* (EXTRACT MAX en Heap, DELETE en AVL) */}
        <button
          onClick={handleCompleteTopTask}
          className="w-full py-3 px-4 rounded-xl font-bold bg-orange-600 text-white shadow-xl cursor-pointer hover:bg-orange-700 transition transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-orange-300"
        >
          Completar Tarea Más Prioritaria (Heap)
        </button>
      </section>

      {/* ======================= LISTA DE TAREAS ACTIVAS ======================= */}
      <section className="space-y-6 pt-4 border-t border-gray-200">
        <h2 className="text-xl font-bold text-orange-700 border-b pb-2">
          Tareas Activas (Índice AVL)
        </h2>

        {/* Componente que renderiza la lista de tareas obtenidas del recorrido In-Order del AVL */}
        <TaskList tasks={tasks} />
      </section>

      {/* ======================= DEBUG: ESTRUCTURAS INTERNAS ======================= */}
      <section className="mt-8 pt-4 border-t border-gray-200 space-y-6">
        <h2 className="text-xl font-bold text-orange-900">
          Debug: Estructuras Internas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Heap */}
          <div className="bg-red-50 p-4 rounded-lg shadow-inner border-2 border-red-300">
            <h3 className="text-lg font-semibold text-red-800 mb-3">
              Heap (Array)
            </h3>

            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {heapArray.map((task, index) => (
                <li
                  key={task.id}
                  className="text-gray-700 border-b border-red-100 pb-1 text-sm flex justify-between items-center"
                >
                  <span className="font-mono text-xs bg-red-200 text-red-900 px-1 rounded mr-2">
                    Índice {index}
                  </span>{" "}
                  <pre>
                    | <strong>ID {task.id}</strong> | {task.description}
                  </pre>
                  <pre>
                    <span className="text-red-600 font-bold ml-auto">
                      | P {task.priority} |
                    </span>
                  </pre>
                </li>
              ))}
            </ul>
          </div>

          {/* AVL */}
          <div className="bg-blue-50 p-4 rounded-lg shadow-inner border-2 border-blue-300">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              AVL Tree (In-Order)
            </h3>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {avlArray.map((task) => (
                <li
                  key={task.id}
                  className="text-gray-700 border-b border-blue-100 pb-1 text-sm flex justify-between items-center"
                >
                  <pre>
                    | <strong>ID {task.id}</strong> | {task.description}
                  </pre>
                  <pre>
                    <span className="text-blue-600 font-bold ml-auto">
                      | P {task.priority} |
                    </span>
                  </pre>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* HEAP Visual */}
          <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-red-400 mb-3">
              Heap (Visualización de Estructura)
            </h3>
            <pre className="bg-gray-800 text-red-300 p-3 rounded-lg overflow-x-auto text-sm border border-gray-700 whitespace-pre-wrap">
              {heapVisual || "Árbol Heap vacío"}
            </pre>
          </div>

          {/* AVL Visual */}
          <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-orange-400 mb-3">
              AVL Tree (Visualización de Estructura)
            </h3>
            <pre className="bg-gray-800 text-orange-300 p-3 rounded-lg overflow-x-auto text-sm border border-gray-700 whitespace-pre-wrap">
              {avlVisual || "Árbol AVL vacío"}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TaskManagerSystem;
