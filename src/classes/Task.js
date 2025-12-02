/**
 * Define el objeto fundamental que encapsula los datos de una tarea
 * en el sistema.
 */
export class Task {
  /**
   * @param {*} id - ID único para indexación en el AVLTree.
   * @param {*} description - Descripción detallada de la tarea.
   * @param {*} priority - Prioridad numérica (3=Alta, 2=Media, 1=Baja) usada en el MaxHeap.
   * @param {*} dueDate - Fecha de vencimiento de la tarea.
   */
  constructor(id, description, priority, dueDate) {
    this.id = id;
    this.description = description;
    this.priority = priority;
    this.dueDate = dueDate;
  }
}
