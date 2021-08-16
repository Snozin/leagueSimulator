export class Team {
  constructor(name = "unnamed") {
    this.name = name
    this.points = 0
    this.goals = 0
    this.goalsAgainst = 0
    this.goalsDiff = 0
  }

  getName() {
    return this.name
  }

  // Retorna un número aleatorio de goles entre 0 y 10
  play() {
    const goals = Math.floor(Math.random() * 11)
    return goals
  }

  // Asigna los goles a favor y en contra a cada equipo
  setGoals(goals = 0, goalsAgainst = 0) {
    this.goals += goals
    this.goalsAgainst += goalsAgainst
    this.goalsDiff = this.goals - this.goalsAgainst
  }

  // Resetear los goles
  resetGoals() {
    this.goals = 0
    this.goalsAgainst = 0
    this.goalsDiff = 0
  }
}
