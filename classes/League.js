export class League {
  constructor(name = "Euro League") {
    this.name = name;
    this.randomizedTeams = [];
    this.groups = [];
    this.pointsPerWin = 3;
    this.pointsPerDraw = 1;

    this.playOffWinners = [];
    this.quarterWinners = [];
    this.semifinalWinners = [];
  }

  startLeague(teams = []) {
    // TODO finalizar logica de liga.

    // Configurar fase de grupos
    this.setupGroupStage(teams);

    // Jugar la fase de grupos
    this.playGroupStage(this.groups);
  }

  // Configurar la fase de equipos
  setupGroupStage(teams) {
    this.raffleTeams(teams);

    // Crear los 6 grupos de 4 equipos mezclados antes
    this.makeGroups(this.randomizedTeams);

    // Ordenar los equipos en 3 jornadas para que cada equipo del
    // grupo se enfrente con los demás del grupo
    this.allVsAll(this.groups);

    // Mostrar por consola los grupos resultantes
    this.displayGroups(this.groups);
  }

  raffleTeams(teams = []) {
    if (teams.length > 0) {
      const randomIndex = Math.floor(Math.random() * teams.length);

      this.randomizedTeams.push(teams.splice(randomIndex, 1));
      this.raffleTeams(teams);
    } else {
      this.randomizedTeams = this.randomizedTeams.flat();
    }
  }

  makeGroups(teams = [], group = 0) {
    // Condición de salida de la recursividad
    if (teams.length == 0) {
      return;
    }

    // El parámetro group recibido será el nombre del grupo
    const names = {
      0: "Grupo A",
      1: "Grupo B",
      2: "Grupo C",
      3: "Grupo D",
      4: "Grupo E",
      5: "Grupo F",
    };
    const newGroup = {
      groupName: `${names[group]}`,
      matchDays: { day1: [], day2: [], day3: [] },
      members: [],
    };

    // Añadir 4 equipos al array miembros del grupo
    let counter = 0;
    while (counter < 4) {
      newGroup.members.push(teams.shift());
      counter++;
    }

    // Añadir cada grupo de equipos al array grupos y repetir
    this.groups.push(newGroup);
    this.makeGroups(teams, ++group);
  }

  allVsAll(groups = []) {
    /** DISCLAIMER: Algoritmo improvisado intentando simplificar el de clase. Sorry! **/
    const randomizeMatches = (teams, matchDays) => {
      const matches = [];
      /** En cada iteración se juegan 1 partido fijo: [i] VS 4, y un partido opcional:
       * [i] VS 3, siempre que [i] != 3. Cuando se incumple la condición se añade el
       * partido 1 VS 2 faltante. */
      for (let i = 0; i < teams.length - 1; i++) {
        matches.push(teams[i], teams[teams.length - 1]);
        if (teams[i] !== teams[teams.length - 2]) {
          matches.push(teams[i], teams[teams.length - 2]);
        } else {
          matches.push(teams[0], teams[1]);
        }
      }
      /** Salida esperada:
       * 1 VS 4
       * 1 VS 3
       * -- -- --
       * 2 VS 4
       * 2 VS 3
       * -- -- --
       * 3 VS 4
       * 1 VS 2
       */

      // Solución loca para que un equipo no juegue 2 partidos el mismo día
      let teamCounter = 0;
      let matchCounter = 0;
      while (matches.length > 0) {
        if (teamCounter < 4) {
          if (matchCounter !== 1) {
            matchDays[`day${matchCounter + 1}`].push(matches.pop());
          }
          if (matchCounter == 1 && teamCounter < 2) {
            matchDays[`day${matchCounter + 1}`].push(matches.pop());
          }
          if (matchCounter == 1 && teamCounter > 1) {
            matchDays[`day${matchCounter + 1}`].push(matches.shift());
          }
          teamCounter++;
        }
        if (teamCounter == 4) {
          teamCounter = 0;
          matchCounter++;
        }
      }
      /** Salida esperada:
       * 1 VS 2
       * 3 VS 4
       * -- -- --
       * 2 VS 3
       * 1 VS 4
       * -- -- --
       * 2 VS 4
       * 1 VS 3
       */
    };

    // Recorrer los grupos y crear las jornadas aleatorias
    groups.forEach((group) => {
      randomizeMatches(group.members, group.matchDays);
    });
  }

  displayGroups(groups = []) {
    console.log("======================================");
    console.log("||***|| Grupos y equipos ||***||");
    console.log("======================================");

    groups.forEach((group) => {
      console.log(`\n[!] ${group.groupName}`);
      console.log("========================");

      group.members.forEach((team) => {
        console.log(`[-] ${team.name}`);
      });
      let counter = 0;
      for (const day in group.matchDays) {
        counter++;
        console.log(`\n[!] Jornada ${counter}:`);

        for (let i = 0; i < group.matchDays[day].length; i += 2) {
          console.log(
            "[-]",
            group.matchDays[day][i].name,
            "VS",
            group.matchDays[day][i + 1].name
          );
        }
      }
    });
  }

  // Mostrar los resultados de la fase de grupos ordenados por puntos
  playGroupStage(groups = []) {
    console.log("\n\n======================================");
    console.log("||***|| Comienza la EUROCOPA!! ||***||");
    console.log("======================================");

    groups.forEach((group) => {
      const { matchDays } = group;
      let counter = 0;
      for (const day in matchDays) {
        const [team1, team2, team3, team4] = matchDays[day];
        counter++;
        console.log("\n________________________\n");
        console.log(`[!] ${group.groupName} - Jornada ${counter}:`);
        console.log("========================");
        const [goals1, goals2] = this.playMatch(team1, team2);
        console.log(`[-] ${team1.name} ${goals1} - ${team2.name} ${goals2}`);

        const [goals3, goals4] = this.playMatch(team3, team4);
        console.log(`[-] ${team3.name} ${goals3} - ${team4.name} ${goals4}`);
        this.sortGroups(group.members);
        console.table(group.members);
      }
    });
  }

  // Enfrentar 2 equipos y asignar puntos por victoria o empate y retornar
  // los goles obtenidos por cada equipo.
  playMatch(teamA, teamB) {
    const goalsA = teamA.play();
    const goalsB = teamB.play();

    teamA.setGoals(goalsA, goalsB);
    teamB.setGoals(goalsB, goalsA);

    if (goalsA > goalsB) {
      teamA.points += this.pointsPerWin;
    } else if (goalsA === goalsB) {
      teamA.points += this.pointsPerDraw;
      teamB.points += this.pointsPerDraw;
    } else {
      teamB.points += this.pointsPerWin;
    }
    return [goalsA, goalsB];
  }

  // Ordenar los equipos dentro del grupo en función de puntos,
  // diferencia de goles o alfabético.
  sortGroups(teams = this.groups[0].members) {
    for (let i = 0; i < teams.length; i++) {
      for (let j = 0; j < teams.length - i - 1; j++) {
        // Ordenar por mayor número de puntos
        if (teams[j].points < teams[j + 1].points) {
          let tmp = teams[j + 1];
          teams[j + 1] = teams[j];
          teams[j] = tmp;
        }
        // Ordenar por diferencia de goles si tienen mismos puntos
        if (teams[j].points == teams[j + 1].points) {
          if (teams[j].goalsDiff < teams[j + 1].goalsDiff) {
            let tmp = teams[j + 1];
            teams[j + 1] = teams[j];
            teams[j] = tmp;
          }
          // Ordenar alfabéticamente si tienen misma diferencia de goles
          if (teams[j].goalsDiff == teams[j + 1].goalsDiff) {
            if (teams[j].name > teams[j + 1].name) {
              let tmp = teams[j];
              teams[j] = teams[j + 1];
              teams[j + 1] = tmp;
            }
          }
        }
      }
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
}
