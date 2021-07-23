export class League {
  constructor(name = "MyLeague") {
    this.name = name;
    this.randomizedTeams = [];
  }

  setPlayOffs(teams = []) {
    console.log("Sorteando...");
    this.raffleTeams(teams);

    // console.log("El sorteo devuelve: ", this.randomizedTeams);
    console.log("Los participantes son: ");
    this.randomizedTeams.forEach((team) => console.log(team.name));
  }

  raffleTeams(teams = []) {
    // Mezcla aleatoriamente el array recibido
    if (teams.length > 0) {
      const randomIndex = Math.floor(Math.random() * teams.length);

      this.randomizedTeams.push(teams.splice(randomIndex, 1));
      this.raffleTeams(teams);
    } else {
      this.randomizedTeams = this.randomizedTeams.flat();
    }
  }

  faceTeams(teamA, TeamB) {
    //TODO Recibe 2 equipos y llama a su metodo play para simular un partido
  }
}
