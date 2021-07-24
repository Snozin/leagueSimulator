export class League {
  constructor(name = "MyLeague") {
    this.name = name;
    this.randomizedTeams = [];
    this.roundWinners = [];
  }

  setPlayOff(teams = []) {
    console.log("\n====================================");
    console.log("||***|| Comienza el torneo! ||***||");
    console.log("====================================\n");
    // console.log(" Participantes: ");
    // console.log("Sorteando...");
    this.raffleTeams(teams);

    // console.log("El sorteo devuelve: ", this.randomizedTeams);
    // console.log("Los participantes son: ");
    // this.randomizedTeams.forEach((team) => console.log(team.name));

    this.playMatches(this.randomizedTeams);
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

  playMatches(teams = []) {
    /* Recibe el array randomizado, coge el primer y ultimo elemento y da un 
    resultado simulando jugar el partido */
    if (teams.length >= 2) {
      let teamA = teams[0];
      let teamB = teams[teams.length - 1];
      console.log("==================");
      console.log("|!| Jugando... \n");
      console.log(`|·| ${teamA.name} VS ${teamB.name} \n`);

      let teamAGoals = teamA.play();
      let teamBGoals = teamB.play();

      // Si no hay empate en el partido:
      if (teamAGoals !== teamBGoals) {
        // Settear goles a favor y en contra de cada equipo
        teamA.goals = teamAGoals;
        teamA.goalsAgainst = teamBGoals;

        teamB.goals = teamBGoals;
        teamB.goalsAgainst = teamAGoals;

        console.log(`|!| Resultados: \n`);
        console.log(
          `|·| ${teamA.name}: ${teamA.goals}  VS  ${teamB.name}: ${teamB.goals}`
        );

        // Guardar al ganador
        if (teamAGoals > teamBGoals) {
          this.roundWinners.push(teams.shift());
          teams.pop();
          console.log(`|!| ${teamA.name} ha ganado!! `);
        } else {
          this.roundWinners.push(teams.pop());
          teams.shift();
          console.log(`|!| ${teamB.name} ha ganado!! `);
        }
        console.log(`==================\n\n`);
        this.playMatches(teams);
      }
      // Si hay empate se vuelve a jugar el partido
      else {
        console.log(`|!| Resultados: \n`);
        console.log(`|!| Ha habido empate a ${teamAGoals}!!!`);
        console.log(`|!| Volviendo a jugar partido...`);
        this.playMatches(teams);
      }
    } else console.log("No quedan más partidos");
  }
}
