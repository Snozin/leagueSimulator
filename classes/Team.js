export class Team {
  constructor(name = 'unnamed',) {
    //TODO Añadir propiedades necesarias para la comparativa
    this.name = name
    this.points = 0
  }

  getName() {
    return this.name
  }

  playVS() {
    //TODO Implementar lógica de jugar contra otro equipo
  }
}