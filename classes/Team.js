export class Team {
  constructor(name = "unnamed") {
    //TODO Añadir propiedades necesarias para la comparativa
    this.name = name;
    this.points = 0;
    this.goals = 0;
    this.goalsAgainst = 0;
  }

  getName() {
    return this.name;
  }

  play() {
    //Retorna un número aleatorio de goles entre 0 y 10
    const goals = Math.floor(Math.random() * 11);
    return goals;
    console.log("Toy juegando, ", goals);
  }
}
