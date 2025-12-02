import { Task } from "./Task";

/**
 * Representa un nodo individual en el Árbol AVL.
 * La clave de ordenamiento es el ID de la tarea.
 */
export class AVLNode {
  /**
   * @param {number} id - La clave de ordenamiento del nodo (ID de la tarea).
   * @param {Task} task - El objeto Task asociado con esta clave.
   */
  constructor(id, task) {
    this.key = id;
    this.task = task;
    this.left = null; // Puntero al hijo izquierdo.
    this.right = null; // Puntero al hijo derecho.
    // La altura se inicializa a 1 (un nodo hoja tiene altura 1). Es crucial para el balanceo.
    this.height = 1;
  }
}

// ----------------------------------------------------------------------

/**
 * Implementa un Árbol AVL.
 * Se utiliza como índice principal para buscar, actualizar y eliminar tareas
 * por su ID único, garantizando un tiempo de búsqueda O(log n).
 */
export class AVLTree {
  // Inicializa la raíz del árbol a nula.
  constructor() {
    this.root = null;
  }

  // ===== Métodos de Ayuda =====

  // Retorna la altura de un nodo. Retorna 0 si el nodo es nulo.
  getHeight = (node) => (node ? node.height : 0);

  // Retorna el máximo de dos números.
  getMax = (a, b) => (a > b ? a : b);

  /**
   * Calcular el factor de equilibrio (Altura izquierda - Altura derecha).
   * Un factor de equilibrio de -1, 0, o 1 indica un nodo balanceado.
   * @param {AVLNode} node - El nodo para calcular el factor.
   * @returns {number} Factor de equilibrio.
   */
  getBalanceFactor = (node) => {
    if (!node) {
      return 0;
    }

    return this.getHeight(node.left) - this.getHeight(node.right);
  };

  // ===== Rotaciones =====

  /**
   * Realiza una Rotación Simple a la Derecha (Right Rotation).
   * Necesaria para balancear casos Izquierda-Izquierda (LL) o Izquierda-Derecha (LR).
   * @param {AVLNode} y - La raíz del subárbol desbalanceado.
   * @returns {AVLNode} La nueva raíz (x).
   */
  rotateRight = (y) => {
    const x = y.left;
    const T2 = x.right;

    // Realizar la rotación. (Y se convierte en hijo derecho de X).
    x.right = y;
    y.left = T2;

    // Actualizar las alturas de los nodos afectados (y luego x).
    y.height = this.getMax(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    x.height = this.getMax(this.getHeight(x.left), this.getHeight(x.right)) + 1;

    // Retornar la nueva raíz del subárbol rotado.
    return x;
  };

  /**
   * Realiza una Rotación Simple a la Izquierda (Left Rotation).
   * Necesaria para balancear casos Derecha-Derecha (RR) o Derecha-Izquierda (RL).
   * @param {AVLNode} x - La raíz del subárbol desbalanceado.
   * @returns {AVLNode} La nueva raíz (y).
   */
  rotateLeft = (x) => {
    const y = x.right;
    const T2 = y.left;

    // Realizar la rotación. (X se convierte en hijo izquierdo de Y).
    y.left = x;
    x.right = T2;

    // Actualizar las alturas de los nodos afectados (x luego y).
    x.height = this.getMax(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    y.height = this.getMax(this.getHeight(y.left), this.getHeight(y.right)) + 1;

    // Retornar la nueva raíz del subárbol rotado.
    return y;
  };

  // ===== Lógica de Inserción =====

  /**
   * Punto de entrada público para la inserción.
   * @param {number} id - La clave única (ID de la tarea).
   * @param {Task} task - El objeto Task a almacenar.
   */
  insert = (id, task) => {
    this.root = this.insertNode(this.root, id, task);
  };

  /**
   * Función recursiva para insertar un nodo y reequilibrar el árbol.
   * @param {AVLNode} node - El nodo actual.
   * @param {number} id - La clave a insertar.
   * @param {Task} task - La tarea a insertar.
   * @returns {AVLNode} La raíz del subárbol después de la inserción y balanceo.
   */
  insertNode = (node, id, task) => {
    // Inserción estándar de BST (Caso base).
    if (!node) {
      return new AVLNode(id, task);
    }

    if (id < node.key) {
      node.left = this.insertNode(node.left, id, task);
    } else if (id > node.key) {
      node.right = this.insertNode(node.right, id, task);
    } else {
      // Clave duplicada, no se permite en este caso de uso.
      return node;
    }

    // Actualizar la altura del nodo actual.
    node.height =
      1 + this.getMax(this.getHeight(node.left), this.getHeight(node.right));

    // Obtener el factor de equilibrio para verificar el desbalance.
    const balance = this.getBalanceFactor(node);

    // Realizar rotaciones si el nodo está desbalanceado (balance > 1 o balance < -1)

    // Caso Rotación Izquierda-Izquierda (LL): inserción en subárbol izq. de nodo izq.
    if (balance > 1 && id < node.left.key) {
      return this.rotateRight(node);
    }

    // Caso Rotación Derecha-Derecha (RR): inserción en subárbol der. de nodo der.
    if (balance < -1 && id > node.right.key) {
      return this.rotateLeft(node);
    }

    // Caso Rotación Izquierda-Derecha (LR): Rotación Izquierda + Rotación Derecha.
    if (balance > 1 && id > node.left.key) {
      node.left = this.rotateLeft(node.left); // Convierte LR en LL.
      return this.rotateRight(node);
    }

    // Caso Rotación Derecha-Izquierda (RL): Rotación Derecha + Rotación Izquierda.
    if (balance < -1 && id < node.right.key) {
      node.right = this.rotateRight(node.right); // Convierte RL en RR.
      return this.rotateLeft(node);
    }

    // Retornar el nodo (si está balanceado o después de rotar).
    return node;
  };

  // ===== Lógica de Búsqueda =====

  /**
   * Punto de entrada público para la búsqueda.
   * @param {number} id - ID de la tarea a buscar.
   * @returns {Task | null} El objeto Task, o null si no se encuentra.
   */
  search = (id) => {
    return this.searchNode(this.root, id);
  };

  /**
   * Función recursiva para buscar un nodo por ID.
   * @param {AVLNode} node - El nodo actual.
   * @param {number} id - La clave a buscar.
   * @returns {Task | null} El objeto Task o null.
   */
  searchNode = (node, id) => {
    // Si el nodo es nulo o encontramos la clave (ID).
    if (!node || node.key === id) {
      return node ? node.task : null;
    }

    // Búsqueda recursiva: Si la clave es menor, buscar a la izquierda.
    if (id < node.key) {
      return this.searchNode(node.left, id);
    }

    // Búsqueda recursiva: Si la clave es mayor, buscar a la derecha.
    if (id > node.key) {
      return this.searchNode(node.right, id);
    }
  };

  // ===== Lógica de Eliminación =====

  /**
   * Encuentra el nodo con la clave (ID) mínima en un subárbol.
   * Se utiliza para encontrar el sucesor in-order en la eliminación.
   * @param {AVLNode} node - La raíz del subárbol.
   * @returns {AVLNode} El nodo con el valor mínimo.
   */
  getMinValueNode = (node) => {
    let current = node;

    // Bucle para encontrar a la hoja más a la izquierda.
    while (current.left !== null) {
      current = current.left;
    }
    return current;
  };

  /**
   * Punto de entrada público para la eliminación.
   * @param {number} id - ID de la tarea a eliminar.
   */
  delete = (id) => {
    this.root = this.deleteNode(this.root, id);
  };

  /**
   * Función recursiva para eliminar un nodo por ID y reequilibrar el árbol.
   * @param {AVLNode} node - El nodo actual.
   * @param {number} id - La clave a eliminar.
   * @returns {AVLNode | null} La nueva raíz del subárbol después de la eliminación/balanceo.
   */
  deleteNode = (node, id) => {
    if (node === null) {
      return node;
    }

    // Eliminación estándar de BST (recorrer el árbol).
    if (id < node.key) {
      // La clave está en el subárbol izquierdo.
      node.left = this.deleteNode(node.left, id);
    } else if (id > node.key) {
      // La clave está en el subárbol derecho.
      node.right = this.deleteNode(node.right, id);
    } else {
      // Hemos encontrado el nodo a eliminar.

      // Caso 1: Nodo con 0 o 1 hijo.
      if (node.left === null || node.right === null) {
        let temp = node.left === null ? node.right : node.left;

        // Caso 1.0 hijos (es una hoja): retorna null.
        if (temp === null) {
          node = null;
        }

        // Caso 1.1 hijo: el hijo reemplaza al nodo.
        else {
          node = temp;
        }
      }
      // Caso 2: Nodo con 2 hijos.
      else {
        // Obtener el sucesor in-order (el menor en el subárbol derecho).
        let temp = this.getMinValueNode(node.right);

        // Copiar los datos del sucesor in-order a este nodo.
        node.key = temp.key;
        node.task = temp.task;

        // Eliminar el sucesor in-order recursivamente.
        node.right = this.deleteNode(node.right, temp.key);
      }
    }

    // Si el nodo se hizo nulo (caso 0 hijos), retornar.
    if (node === null) {
      return node;
    }

    // Actualizar altura y Factor de Equilibrio.
    node.height =
      this.getMax(this.getHeight(node.left), this.getHeight(node.right)) + 1;
    const balance = this.getBalanceFactor(node);

    // Realizar rotaciones (si hay desbalance).

    // Desbalance en el subárbol izquierdo (balance > 1).
    if (balance > 1) {
      // Caso Izquierda-Izquierda (LL).
      if (this.getBalanceFactor(node.left) >= 0) {
        return this.rotateRight(node);
      }

      // Caso Izquierda-Derecha (LR).
      if (this.getBalanceFactor(node.left) < 0) {
        node.left = this.rotateLeft(node.left);
        return this.rotateRight(node);
      }
    }

    // Desbalance en el subárbol derecho (Balance < -1).
    if (balance < -1) {
      // Caso Derecha-Derecha (RR).
      if (this.getBalanceFactor(node.right) <= 0) {
        return this.rotateLeft(node);
      }

      // Caso Derecha-Izquierda (RL).
      if (this.getBalanceFactor(node.right) > 0) {
        node.right = this.rotateRight(node.right);
        return this.rotateLeft(node);
      }
    }

    return node;
  };

  // ===== Lógica de Recorrido =====

  /**
   * Realiza un recorrido in-order (ascendente por ID) en el AVL Tree
   * para obtener la lista completa y ordenada de tareas.
   * @returns {Task[]} Un array de objetos Task, ordenados por ID.
   */
  getTasksInOrder = () => {
    const tasks = [];
    this.inOrderTraversal(this.root, tasks);
    return tasks;
  };

  /**
   * Función auxiliar recursiva para el recorrido in-order.
   * @param {AVLNode} node - El nodo actual.
   * @param {Task[]} tasks - El array donde se almacenan las tareas.
   */
  inOrderTraversal = (node, tasks) => {
    if (node !== null) {
      // 1. Recorrer subárbol izquierdo (valores menores).
      this.inOrderTraversal(node.left, tasks);
      // 2. Procesar el nodo actual (añadir la tarea).
      tasks.push(node.task);
      // 3. Recorrer subárbol derecho (valores mayores).
      this.inOrderTraversal(node.right, tasks);
    }
  };

  /**
   * Genera una representación visual del Árbol AVL
   * para fines de depuración. Muestra la clave (ID) del nodo.
   * @param {AVLNode} node [node=this.root] - El nodo inicial.
   * @param {string} prefix [prefix=""] - Prefijo de indentación.
   * @param {boolean} isLeft [isLeft=true] - Indica si el nodo es hijo izquierdo.
   * @returns {string} La representación en cadena del árbol.
   */
  printAVL = (node = this.root, prefix = "", isLeft = true) => {
    if (!node) return "";

    let result = "";

    if (node.right) {
      result += this.printAVL(
        node.right,
        prefix + (isLeft ? "│   " : "    "),
        false
      );
    }

    // Muestra la clave del nodo (ID).
    result += prefix + (isLeft ? "└── " : "┌── ") + node.key + "\n";

    if (node.left) {
      result += this.printAVL(
        node.left,
        prefix + (isLeft ? "    " : "│   "),
        true
      );
    }

    return result;
  };
}
