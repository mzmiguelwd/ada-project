export class Task {
  constructor(id, description, priority, dueDate) {
    // ID Único para el índice AVL.
    this.id = id;
    this.description = description;

    // La prioridad debe ser un valor numérico para el Heap.
    // Alta=3, Media=2, Baja=1.
    this.priority = priority;

    this.dueDate = dueDate;
  }
}

// La tarea con la mayor prioridad (número) sube a la cima.
export class MaxHeap {
  constructor() {
    this.heap = [];
  }

  // ===== Métodos de Ayuda para Navegación =====

  getParentIndex = (i) => Math.floor((i - 1) / 2);
  getLeftChildIndex = (i) => 2 * i + 1;
  getRightChildIndex = (i) => 2 * i + 2;

  swap = (i, j) => {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  };

  // ===== Lógica de Inserción (Sift Up) =====

  insert = (task) => {
    // Añadir la nueva tarea al final del array.
    this.heap.push(task);

    // Reordenar hacia arriba (Sift Up) para restaurar la propiedad Max-Heap.
    this.siftUp(this.heap.length - 1);
  };

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

  // Método para obtener la tarea más prioritaria y eliminarla.
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
  removeById = (id) => {
    if (this.heap.length === 0) return null;

    // Buscar el índice del elemento con ese ID.
    const index = this.heap.findIndex((t) => t.id === id);
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
}

export class AVLNode {
  constructor(id, task) {
    // El ID de la tarea es la clave de ordenamiento del árbol.
    this.key = id;
    this.task = task;
    this.left = null;
    this.right = null;
    // La altura se inicializa a 1 (un nodo hoja tiene altura 1).
    this.height = 1;
  }
}

export class AVLTree {
  constructor() {
    this.root = null;
  }

  // ===== Métodos de Ayuda =====

  // Retorna la altura de un nodo. Retorna 0 si el nodo es nulo.
  getHeight = (node) => (node ? node.height : 0);

  // Retorna el máximo de dos números.
  getMax = (a, b) => (a > b ? a : b);

  // Calcular el factor de equilibrio (Altura izquierda - Altura derecha).
  getBalanceFactor = (node) => {
    if (!node) {
      return 0;
    }

    return this.getHeight(node.left) - this.getHeight(node.right);
  };

  // ===== Rotaciones =====

  rotateRight = (y) => {
    const x = y.left;
    const T2 = x.right;

    // Realizar la rotación.
    x.right = y;
    y.left = T2;

    // Actualizar las alturas.
    y.height = this.getMax(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    x.height = this.getMax(this.getHeight(x.left), this.getHeight(x.right)) + 1;

    // Retornar la nueva raíz del subárbol rotado.
    return x;
  };

  rotateLeft = (x) => {
    const y = x.right;
    const T2 = y.left;

    // Realizar la rotación.
    y.left = x;
    x.right = T2;

    // Actualizar las alturas.
    x.height = this.getMax(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    y.height = this.getMax(this.getHeight(y.left), this.getHeight(y.right)) + 1;

    // Retornar la nueva raíz del subárbol rotado.
    return y;
  };

  // ===== Lógica de Inserción =====

  insert = (id, task) => {
    this.root = this.insertNode(this.root, id, task);
  };

  insertNode = (node, id, task) => {
    // Inserción estándar de BST.
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

    // Caso Rotación Izquierda-Izquierda (LL).
    if (balance > 1 && id < node.left.key) {
      return this.rotateRight(node);
    }

    // Caso Rotación Derecha-Derecha (RR).
    if (balance < -1 && id > node.right.key) {
      return this.rotateLeft(node);
    }

    // Caso Rotación Izquierda-Derecha (LR).
    if (balance > 1 && id > node.left.key) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }

    // Caso Rotación Derecha-Izquierda (RL).
    if (balance < -1 && id < node.right.key) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }

    // Retornar el nodo (si está balanceado o después de rotar).
    return node;
  };

  // ===== Lógica de Búsqueda =====

  search = (id) => {
    return this.searchNode(this.root, id);
  };

  searchNode = (node, id) => {
    // Si el nodo es nulo o encontramos la clave (ID).
    if (!node || node.key === id) {
      return node ? node.task : null;
    }

    // Si la clave es menor, buscar a la izquierda.
    if (id < node.key) {
      return this.searchNode(node.left, id);
    }

    // Si la clave es mayor, buscar a la derecha.
    if (id > node.key) {
      return this.searchNode(node.right, id);
    }
  };

  // ===== Lógica de Eliminación =====

  getMinValueNode = (node) => {
    let current = node;

    // Bucle para encontrar a la hoja más a la izquierda.
    while (current.left !== null) {
      current = current.left;
    }
    return current;
  };

  delete = (id) => {
    this.root = this.deleteNode(this.root, id);
  };

  deleteNode = (node, id) => {
    if (node === null) {
      return node;
    }

    // Eliminación estándar de BST.
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
        let temp = null;
        if (node.left === null) {
          temp = node.right;
        } else {
          temp = node.left;
        }

        // Caso 0 hijos (es una hoja): retorna null.
        if (temp === null) {
          temp = node;
          node = null;
        }

        // Caso 1 hijo: el hijo reemplaza al nodo.
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

        // Eliminar el sucesor in-order (el nodo que copiamos).
        node.right = this.deleteNode(node.right, temp.key);
      }
    }

    // Si el árbol solo tenía un nodo.
    if (node === null) {
      return node;
    }

    // Actualizar altura.
    node.height =
      this.getMax(this.getHeight(node.left), this.getHeight(node.right)) + 1;

    // Obtener factor de equilibrio.
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

  // Realiza un recorrido in-order (ascendente por ID) en el AVL Tree.
  getTasksInOrder = () => {
    const tasks = [];
    this.inOrderTraversal(this.root, tasks);
    return tasks;
  };

  inOrderTraversal = (node, tasks) => {
    if (node !== null) {
      this.inOrderTraversal(node.left, tasks);
      tasks.push(node.task);
      this.inOrderTraversal(node.right, tasks);
    }
  };

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
