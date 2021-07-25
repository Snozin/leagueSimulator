export class League {
  constructor(name = "Euro League") {
    this.name = name;
    this.randomizedTeams = [];
    this.groups = [];

    this.playOffWinners = [];
    this.quarterWinners = [];
    this.semifinalWinners = [];
  }

  startLeague(teams = []) {
    // TODO finalizar logica de liga. Extraer los mensajes
    // al archivo main.
    console.log("\n====================================");
    console.log("||***|| Comienza el torneo! ||***||");
    console.log("====================================\n");

    this.raffleTeams(teams);
    this.makeGroups(this.randomizedTeams);
    console.log(this.groups)
    // console.table(this.groups, ['members'])

    // console.log("==================");
    // console.log("|!| Participantes: \n");
    // this.randomizedTeams.forEach((team) => console.log("|·|", team.name));
    // console.log("==================");

    let aux = [...this.randomizedTeams];
    // this.playOffWinners = this.playMatches(aux);
    // console.log("Playoff:", this.playOffWinners);

    aux = [...this.playOffWinners];
    // this.quarterWinners = this.playMatches(aux);
    // console.log("Quarters:", this.quarterWinners);

    // aux = [...this.quarterWinners]
    // this.semifinalWinners = this.playMatches(aux)
    // console.log('Semifinal:', this.semifinalWinners)

    // this.playPlayoffs();
    // this.playQuarterFinals();
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

  playPlayoffs() {
    // TODO refactor para extrapolarlo al método principal
    const participants = [...this.randomizedTeams];

    console.log("\n====================================");
    console.log("||***|| PlayOffs! ||***||");
    console.log("====================================\n");

    this.playOffWinners = this.playMatches(participants);

    console.log("==================");
    console.log("|!| Clasificados PlayOff: \n");
    this.playOffWinners.forEach((team) => console.log("|·|", team.name));
    console.log("==================");
  }

  playQuarterFinals() {
    // TODO refactor extrapolarlo al método principal
    const participants = [...this.playOffWinners];

    console.log("\n====================================");
    console.log("||***|| Cuartos de Final! ||***||");
    console.log("====================================\n");

    this.quarterWinners = this.playMatches(participants);

    console.log("==================");
    console.log("|!| Clasificados Cuartos de Final: \n");
    this.quarterWinners.forEach((team) => console.log("|·|", team.name));
    console.log("==================");
  }

  playSemifinals() {
    //TODO Guardar los 2 equipos que se enfrentan por el 3 y 4
    // puesto y los 2 que se enfrentan por el 1 y 2 puesto
    const participants = [...this.quarterWinners];

    const teamA = participants[0];
    const teamB = participants[participants.length - 1];

    const teamAGoals = teamA.play();
    const teamBGoals = teamB.play();
  }

  playMatches(teams = [], winners = []) {
    // TODO cambiar la lógica para escoger el orden de los partidos
    // en función de lo que responda Jordi
    // Recibe un array de equipos participantes y devuelve un array de ganadores
    if (teams.length >= 2) {
      let teamA = teams[0];
      let teamB = teams[teams.length - 1];
      console.log("==================");
      console.log("|!| Jugando... \n");
      console.log(`|·| ${teamA.name} VS ${teamB.name}`);
      console.log(`==================`);

      let teamAGoals = teamA.play();
      let teamBGoals = teamB.play();

      // Si no hay empate en el partido:
      if (teamAGoals !== teamBGoals) {
        // Settear goles de cada equipo
        teamA.setGoals(teamA, teamAGoals, teamBGoals);
        teamB.setGoals(teamB, teamBGoals, teamAGoals);

        console.log(`|!| Resultado: \n`);
        console.log(
          `|·| ${teamA.name}: ${teamAGoals}  VS  ${teamB.name}: ${teamBGoals}`
        );

        if (teamAGoals > teamBGoals) {
          // Guardar los ganadores
          winners.push(teams.shift());
          teams.pop();
          console.log(`|!| Ganador ${teamA.name}!! `);
        } else {
          winners.push(teams.pop());
          teams.shift();
          console.log(`|!| Ganador ${teamB.name}!! `);
        }
        console.log(`==================\n\n`);
        this.playMatches(teams, winners);
      } else {
        // Si hay empate se vuelve a jugar el partido
        console.log(`|!| Resultado: \n`);
        console.log(`|!| Empate a ${teamAGoals} !!!`);
        console.log(`|!| Volviendo a jugar partido...`);
        this.playMatches(teams, winners);
      }
    } else {
      console.log("|!| Fin de la ronda");
    }
    return winners;
  }

  // Crea los 6 grupos de 4 equipos
  makeGroups(teams = [], group = 0) {
    // Condición de salida de la recursividad
    if (teams.length == 0) {
      return console.log("Grupos finalizados");
    }

    // El parámetro group recibido será el nombre del grupo
    const names = {
      0: 'A',
      1: 'B',
      2: 'C',
      3: 'D',
      4: 'E',
      5: 'F',
    }

    const newGroup = {
      group: `${names[group]}`,
      members: [],
    };

    // Añadir 4 elementos al array miembros del grupo
    let counter = 0;
    while (counter < 4) {
      newGroup.members.push(teams.shift());
      counter++;
    }

    // Añadir cada grupo de equipos al array final y repetir
    this.groups.push(newGroup);
    this.makeGroups(teams, ++group);
  }

  displayResults() {
    // TODO recibe cosas y las muestra en forma de tabla
  }
}
