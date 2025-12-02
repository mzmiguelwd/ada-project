/**
 * Implementa una cola de prioridad basada en un árbol binario completo
 * almacenado en un array. La tarea con la mayor prioridad numérica
 * siempre se encuentra en la raíz (índice 0).
 */
export class MaxHeap {
  // Inicializa el arreglo interno que representa la estructura del montículo.
  constructor() {
    this.heap = []; // Array que almacena los objetos Task.
  }

  // ===== Métodos de Ayuda para Navegación =====

  getParentIndex = (i) => Math.floor((i - 1) / 2);
  getLeftChildIndex = (i) => 2 * i + 1;
  getRightChildIndex = (i) => 2 * i + 2;

  // Intercambia dos elementos en el array del montículo.
  swap = (i, j) => {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  };

  // ===== Lógica de Inserción (Sift Up) =====

  /**
   * Inserta una nueva tarea en el montículo.
   * @param {Task} task - La tarea a insertar.
   */
  insert = (task) => {
    // Añadir la nueva tarea al final del array.
    this.heap.push(task);

    // Reordenar hacia arriba (Sift Up) para restaurar la propiedad Max-Heap.
    this.siftUp(this.heap.length - 1);
  };

  /**
   * Reestablece la propiedad Max-Heap moviendo un nodo hacia arriba.
   * Se utiliza después de una inserción.
   * @param {number} index - Índice del nodo a "subir".
   */
  siftUp = (index) => {
    let current = index;
    let parent = this.getParentIndex(current);

    // Mientras no sea la raíz y la prioridad del hijo sea mayor que la del padre.
    while (
      current > 0 &&
      this.heap[current].priority > this.heap[parent].priority
    ) {
      this.swap(current, parent);
      current = parent;
      parent = this.getParentIndex(current);
    }
  };

  // ===== Lógica de Extracción (Sift Down) =====

  /**
   * Extrae la tarea con la mayor prioridad (la raíz del montículo).
   * @returns {Task | null} La tarea extraída, o null si el montículo está vacío.
   */
  extractMax = () => {
    if (this.heap.length === 0) {
      return null;
    }

    if (this.heap.length === 1) {
      return this.heap.pop();
    }

    // Guardar el máximo (la raíz).
    const max = this.heap[0];

    // Mover el último elemento a la raíz.
    this.heap[0] = this.heap.pop();

    // Reordenar hacia abajo (Sift Down).
    this.siftDown(0);

    // Devolver el máximo.
    return max;
  };

  /**
   * Reestablece la propiedad Max-Heap moviendo un nodo hacia abajo.
   * Se utiliza después de una extracción o reemplazo de la raíz.
   * @param {number} index - Índice del nodo a "bajar".
   */
  siftDown = (index) => {
    let current = index;
    const lastIndex = this.heap.length - 1;

    // Repetir mientras el nodo tenga al menos un hijo.
    while (this.getLeftChildIndex(current) <= lastIndex) {
      let left = this.getLeftChildIndex(current);
      let right = this.getRightChildIndex(current);
      let largest = current;

      // Determinar cuál es el nodo con la mayor prioridad entre el padre, el hijo izquierdo y el hijo derecho.

      // Verificar hijo izquierdo.
      if (
        left <= lastIndex &&
        this.heap[left].priority > this.heap[largest].priority
      ) {
        largest = left;
      }

      // Verificar hijo derecho.
      if (
        right <= lastIndex &&
        this.heap[right].priority > this.heap[largest].priority
      ) {
        largest = right;
      }

      // Si el mayor es el nodo actual, hemos terminado.
      if (largest === current) {
        break;
      }

      // Intercambiar y continuar el Sift Down.
      this.swap(current, largest);
      current = largest;
    }
  };

  // ===== Eliminación arbitraria por ID =====

  // Elimina del heap la tarea con el ID dado y reequilibra el montículo.
  /**
   * Elimina una tarea específica por su ID y reequilibra el montículo.
   * Se utiliza en la función de actualización o eliminación forzada.
   * @param {number} id - ID único de la tarea a eliminar.
   * @returns {Task | null} La tarea eliminada, o null si no se encuentra.
   */
  removeById = (id) => {
    if (this.heap.length === 0) return null;

    // Buscar el índice del elemento con ese ID.
    const index = this.heap.findIndex((task) => task.id === id);
    if (index === -1) return null;

    const lastIndex = this.heap.length - 1;

    // Si es el último elemento, solo hacer pop.
    if (index === lastIndex) {
      return this.heap.pop();
    }

    // Guardar el eliminado para retornarlo.
    const removed = this.heap[index];

    // Mover el último elemento a la posición del eliminado.
    this.heap[index] = this.heap[lastIndex];
    this.heap.pop();

    // Reequilibrar: podría necesitar subir o bajar.
    this.siftDown(index);
    this.siftUp(index);

    return removed;
  };

  /**
   * Genera una representación visual del Max Heap
   * para fines de depuración. Muestra el ID de la tarea.
   * @returns {string} La representación en cadena del árbol.
   */
  printHeap = () => {
    if (this.heap.length === 0) {
      return "Montículo vacío.";
    }

    let result = [];

    const printNode = (index, prefix, isLeft) => {
      if (index >= this.heap.length) {
        return;
      }

      const leftChildIndex = this.getLeftChildIndex(index);
      const rightChildIndex = this.getRightChildIndex(index);
      const task = this.heap[index];

      // Formato del nodo: ID
      const nodeInfo = `${task.id}`;

      // 1. Imprime el hijo derecho (se visualiza arriba a la izquierda)
      printNode(rightChildIndex, prefix + (isLeft ? "│   " : "    "), false);

      // 2. Imprime el nodo actual
      // El nodo raíz (index 0) será inicialmente `┌── ID` cuando isLeft es false
      result.push(prefix + (isLeft ? "└── " : "┌── ") + nodeInfo);

      // 3. Imprime el hijo izquierdo (se visualiza abajo a la derecha)
      printNode(leftChildIndex, prefix + (isLeft ? "    " : "│   "), true);
    };

    // Comenzar desde la raíz (índice 0).
    // El tercer argumento (isLeft = false) indica que el primer nodo no es hijo izquierdo de nadie.
    printNode(0, "", false);

    // Ajustar la raíz.
    // El último elemento añadido al 'result' es la raíz (debido al orden de impresión).
    // Quitamos el prefijo "┌── " que le pone la función recursiva y ponemos "└── " (o simplemente nada, pero siguiendo el estilo de rama).
    if (result.length > 0) {
      // Reemplazamos el "┌── " del nodo raíz con un "└── " o simplemente eliminamos los 4 espacios del prefijo.
      // Para ser coherentes con el estilo AVL:
      result[result.length - 1] = result[result.length - 1].replace(
        "┌── ",
        "└── "
      );
    }

    return result.join("\n");
  };
}
