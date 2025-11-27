import { useState, useMemo, useRef } from "react";
import { Task, MaxHeap, AVLTree } from "./Classess.js";
import TaskForm from "./TaskForm.jsx";
import SearchForm from "./SearchForm.jsx";
import TaskList from "./TaskList.jsx";
import DeleteForm from "./DeleteForm.jsx";
import UpdateForm from "./UpdateForm.jsx";

function TaskManagerSystem() {
  // 1. Inicializar las estructuras de datos solo una vez.
  const { heap, avlTree } = useMemo(() => {
    const heapInstance = new MaxHeap();
    const avlTreeInstance = new AVLTree();
    return { heap: heapInstance, avlTree: avlTreeInstance };
  }, []);

  // 2. Estado para manejar y renderizar la lista de tareas.
  const [tasks, setTasks] = useState([]);

  // 3. Estado para manejar mensajes de la aplicación (éxito, error, búsqueda).
  const [message, setMessage] = useState("");

  const [heapArray, setHeapArray] = useState([]);
  const [avlArray, setAvlArray] = useState([]);
  const [avlVisual, setAvlVisual] = useState(""); // Para print del árbol

  // ===== Lógica del Sistema =====

  const idCounter = useRef(1);

  // Inserta la tarea en ambas estructuras.
  const handleAddTask = (newTaskData) => {
    // Generar un ID autoincremental.
    const id = idCounter.current;
    idCounter.current = id + 1;

    // Convertir prioridad de string a número.
    const priorityMap = { Baja: 1, Media: 2, Alta: 3 };
    const numericPriority = priorityMap[newTaskData.priority] || 1;

    try {
      const newTask = new Task(
        id,
        newTaskData.description,
        numericPriority,
        newTaskData.dueDate
      );

      // Insertar en el Heap (para prioridad).
      heap.insert(newTask);

      // Insertar en el AVL (para indexación).
      avlTree.insert(newTask.id, newTask);

      setMessage(
        `Tarea ${newTask.description} agregada con ID ${id} y Prioridad ${newTaskData.priority}.`
      );

      refreshTaskList();
    } catch (error) {
      setMessage(`Error al agregar tarea: ${error.message}`);
    }
  };

  // Actualiza una tarea por ID: elimina del Heap, actualiza campos y re-inserta.
  const handleUpdateTask = (payload) => {
    const parseId = parseInt(payload.id);
    if (isNaN(parseId)) {
      setMessage(`Por favor, introduce un ID numérico válido.`);
      return;
    }

    const existing = avlTree.search(parseId);
    if (!existing) {
      setMessage(`No existe tarea con ID ${parseId} en el índice.`);
      return;
    }

    // Remover del Heap (si está) para poder cambiar la prioridad sin romper el invariante
    const removedFromHeap = heap.removeById(parseId);

    // Mapear prioridad textual a numérica
    const priorityMap = { Baja: 1, Media: 2, Alta: 3 };
    const numericPriority = priorityMap[payload.priority] || existing.priority;

    // Actualizar campos en el mismo objeto para mantener referencias compartidas (AVL)
    existing.description = payload.description;
    existing.priority = numericPriority;
    existing.dueDate = payload.dueDate;

    // Reinsertar al heap con la nueva prioridad si se eliminó con éxito o si no estaba, insertarlo igual
    heap.insert(existing);

    setMessage(
      `Tarea actualizada: (ID ${parseId}) → Desc: "${existing.description}", Prioridad: ${payload.priority}, Vence: ${existing.dueDate}.`
    );
    refreshTaskList();
  };

  // Función para extraer la tarea más prioritaria del Heap y eliminarla del AVL.
  const handleCompleteTopTask = () => {
    const topTask = heap.extractMax(); // Elimina del Heap.

    if (topTask) {
      // Eliminar del AVL para actualizar el índice.
      avlTree.delete(topTask.id);
      setMessage(
        `Tarea completada: ${topTask.description} (ID: ${topTask.id}).`
      );
      refreshTaskList();
    } else {
      setMessage(`La cola de prioridad está vacía. No hay tareas urgentes.`);
    }
  };

  // Función para buscar una tarea en el AVL por ID.
  const handleSearchTask = (id) => {
    const parseId = parseInt(id);
    if (isNaN(parseId)) {
      setMessage(`Por favor, introduce un ID numérico válido.`);
      return;
    }

    // Buscar tarea usando el índice AVL.
    const foundTask = avlTree.search(parseId);

    if (foundTask) {
      setMessage(
        `Tarea encontrada: ID ${parseId}: ${foundTask.description} (Prioridad: ${foundTask.priority})`
      );
    } else {
      setMessage(`Tarea con ID ${parseId} no encontrada en el índice.`);
    }
  };

  // Función para eliminar una tarea por ID: quita del AVL y del Heap. (completar tarea)
  const handleDeleteTaskById = (id) => {
    const parseId = parseInt(id);
    if (isNaN(parseId)) {
      setMessage(`Por favor, introduce un ID numérico válido.`);
      return;
    }

    const existing = avlTree.search(parseId);
    if (!existing) {
      setMessage(`No existe tarea con ID ${parseId} en el índice.`);
      return;
    }

    // Eliminar del AVL
    avlTree.delete(parseId);
    // Eliminar también del Heap (arbitrario por ID)
    const removed = heap.removeById(parseId);

    if (removed) {
      setMessage(
        `Tarea completada: ${removed.description} (ID: ${parseId}). Índice AVL ajustado y heap actualizado.`
      );
    } else {
      setMessage(
        `Tarea con ID ${parseId} eliminada del AVL. No estaba presente en el heap (posible desincronización).`
      );
    }

    refreshTaskList();
  };

  // Función para actualizar la lista de tareas visibles en la GUI.
  const refreshTaskList = () => {
    // Usa el método In-order del AVL para obtener todas las tareas activas
    const currentTasks = avlTree.getTasksInOrder();
    setTasks(currentTasks); // Actualiza el estado que alimenta el TaskList
    setMessage((prev) => prev + " | Lista de tareas visible actualizada.");

    setHeapArray([...heap.heap]);
    setAvlArray(avlTree.getTasksInOrder());
    setAvlVisual(avlTree.printAVL());
  };

  // 4. Renderizar la GUI
  return (
    <div className="bg-white shadow-xl rounded-xl p-6 space-y-6 border border-gray-200">
      <header>
        <h1 className="text-gray-600">
          Heap para prioridad + AVL para indexación
        </h1>
      </header>

      <section className="controls space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Operaciones</h2>

        <div className="space-y-4">
          <TaskForm onAddTask={handleAddTask} />

          <button
            onClick={handleCompleteTopTask}
            className="w-full py-2 px-4 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
          >
            Completar tarea más prioritaria (Heap)
          </button>

          <UpdateForm onUpdateTask={handleUpdateTask} />

          <SearchForm onSearchTask={handleSearchTask} />

          <DeleteForm onDeleteTask={handleDeleteTaskById} />
        </div>
      </section>

      <hr className="border-gray-300" />

      <section className="output space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Salida del Sistema
        </h2>

        <div className="message-box p-4 border border-dashed border-gray-500 rounded-lg min-h-10">
          {message}
        </div>

        {/* Usar el componente TaskList para mostrar el estado */}
        <TaskList tasks={tasks} />
      </section>

      <section className="space-y-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-700">
          Estructuras Internas
        </h2>

        {/* === HEAP === */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Heap (array interno)
          </h3>

          <ul className="space-y-2">
            {heapArray.map((task) => (
              <li
                key={task.id}
                className="text-gray-700 border-b border-gray-100 pb-1"
              >
                <strong className="text-gray-900">ID {task.id}</strong> —{" "}
                {task.description}{" "}
                <span className="text-blue-600 font-medium">
                  (P{task.priority})
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* === AVL EN ORDEN === */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            AVL (En orden)
          </h3>

          <ul className="space-y-2">
            {avlArray.map((task) => (
              <li
                key={task.id}
                className="text-gray-700 border-b border-gray-100 pb-1"
              >
                <strong className="text-gray-900">ID {task.id}</strong> —{" "}
                {task.description}{" "}
                <span className="text-blue-600 font-medium">
                  (P{task.priority})
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* === AVL VISUAL === */}
        <div className="bg-gray-900 p-4 rounded-lg shadow border border-gray-800">
          <h3 className="text-lg font-semibold text-blue-300 mb-3">
            AVL (estructura del árbol)
          </h3>

          <pre className="bg-gray-800 text-blue-400 p-3 rounded-lg overflow-x-auto text-sm border border-gray-700">
            {avlVisual}
          </pre>
        </div>
      </section>
    </div>
  );
}

export default TaskManagerSystem;
