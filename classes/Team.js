export class Team {
  constructor(name = "unnamed") {
    //TODO Añadir propiedades necesarias para la comparativa
    this.name = name;
    this.points = 0;
    this.goals = 0;
    this.goalsAgainst = 0;
    this.goalsDiff = 0;
  }

  getName() {
    return this.name;
  }

  // Retorna un número aleatorio de goles entre 0 y 10
  play() {
    const goals = Math.floor(Math.random() * 11);
    return goals;
  }

  // Asigna los goles a favor y en contra a cada equipo
  setGoals(goals, goalsAgainst) {
    this.goals += goals
    this.goalsAgainst += goalsAgainst
    this.goalsDiff = this.goals - this.goalsAgainst;
  }

  //   // Asigna los goles a favor y en contra a cada equipo
  // setGoals(team, goals, goalsAgainst) {
  //   team.goals += goals
  //   team.goalsAgainst += goalsAgainst
  // }
}
