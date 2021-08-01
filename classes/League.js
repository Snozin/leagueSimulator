export class League {
  constructor(name = "Euro League") {
    this.name = name;
    this.randomizedTeams = [];
    this.groups = [];
    this.pointsPerWin = 3;
    this.pointsPerDraw = 1;
    this.cualifiedTeams = {};

    this.semifinalWinners = [];
    this.semifinalLosers = [];
  }

  startLeague(teams = []) {
    // TODO finalizar logica de liga.

    // Configurar fase de grupos
    this.setupGroupStage(teams);

    // Jugar la fase de grupos
    this.playGroupStage(this.groups);

    // Configurar los playoff
    this.setupPlayoffs(this.groups);

    // Jugar los playoff
    this.playPlayoffs(this.cualifiedTeams);

    // Jugar los cuartos de final
    this.playQuarterFinals(this.cualifiedTeams);

    // jugar la semifinal
    this.playSemifinals(this.cualifiedTeams);

    // Jugar final
    this.playFinal(this.semifinalWinners);
  }

  // Configurar la fase de equipos
  setupGroupStage(teams) {
    // Mezclar aleatoriamente el array de equipos
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

  // Jugar la fase de grupos y mostrar los resultados ordenados por
  // puntos > diferencia de goles > alfabético
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
  sortGroups(teams = []) {
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

  // Crear la configuración de equipos clasificados para los playoff
  setupPlayoffs(groups = []) {
    const firsts = [];
    const seconds = [];
    const thirds = [];
    groups.forEach((group) => {
      firsts.push(group.members.shift());
      seconds.push(group.members.shift());
      thirds.push(group.members.shift());
    });
    // Ordenar los terceros
    this.sortGroups(thirds);
    // Descartar los 2 últimos
    thirds.pop();
    thirds.pop();

    // total: 16 /2  = 8
    let index = 0;
    while (index < 8) {
      index++;
      this.cualifiedTeams[`q${index}`] = [];
      if (firsts.length > 0) {
        this.cualifiedTeams[`q${index}`].push(firsts.shift(), seconds.pop());
      }
      if (index > 6) {
        this.cualifiedTeams[`q${index}`].push(thirds.shift(), thirds.pop());
      }
    }
    // La tabla de clasificación queda:
    // A1 B1 C1 D1 E1 F1 ?3 ?3
    // F2 E2 D2 C2 B2 A2 ?3 ?3
    // Es un poco triqui, pero cumple que no se repitan del mismo grupo.
  }

  playPlayoffs(cualifiedTeams = {}) {
    console.log("\n======================================");
    console.log("||***|| Octavos de Final ||***||");
    console.log("======================================\n");
    Object.values(cualifiedTeams).forEach((team, index) => {
      const winner = this.knockoutMatch(team[0], team[1]);
      console.log(
        `${team[0].name} ${team[0].goals} - ${team[1].goals} ${team[1].name} => ${team[winner].name}`
      );
      this.cualifiedTeams[`q${index + 1}`] = team[winner];
    });
  }

  playQuarterFinals(cualifiedTeams = {}) {
    console.log("\n======================================");
    console.log("||***|| Cuartos de Final ||***||");
    console.log("======================================\n");
    const quarterTeams = Object.values(cualifiedTeams);
    this.cualifiedTeams = {};

    for (let i = 0; i <= quarterTeams.length + 1; i++) {
      const match = [quarterTeams.shift(), quarterTeams.pop()];
      const winner = this.knockoutMatch(match[0], match[1]);
      console.log(
        `${match[0].name} - ${match[0].goals} ${match[1].goals} ${match[1].name} => ${match[winner].name}`
      );
      this.cualifiedTeams[`q${i + 1}`] = match[winner];
    }
  }

  // Retornar 0 si gana A o 1 si gana B. Si tienen los mismos
  // goles se vuelve a jugar.
  knockoutMatch(teamA, teamB) {
    teamA.resetGoals();
    teamB.resetGoals();

    const goalsA = teamA.play();
    const goalsB = teamB.play();

    if (goalsA == goalsB) {
      this.knockoutMatch(teamA, teamB);
    }

    teamA.setGoals(goalsA);
    teamB.setGoals(goalsB);

    if (goalsA > goalsB) {
      return 0;
    } else {
      return 1;
    }
  }

  playSemifinals(cualifiedTeams = {}) {
    console.log("\n======================================");
    console.log("||***|| Semifinal ||***||");
    console.log("======================================\n");
    const semifinalTeams = Object.values(cualifiedTeams);
    let q1 = [];
    let q2 = [];
    for (let i = 0; i < semifinalTeams.length; i++) {
      if (i % 2 === 0) {
        q2.push(semifinalTeams[i]);
      } else {
        q1.push(semifinalTeams[i]);
      }
    }
    const q1index = this.knockoutMatch(q1[0], q1[1]);
    const q2index = this.knockoutMatch(q2[0], q2[1]);

    let aux = [...q1];
    let q1Winner = aux.splice(q1index, 1).pop();

    this.semifinalLosers = [...aux];

    aux = [...q2];
    let q2Winner = aux.splice(q2index, 1).pop();

    console.log(
      `${q1[0].name} ${q1[0].goals} - ${q1[1].goals} ${q1[1].name} => ${q1Winner.name} `
    );
    console.log(
      `${q2[0].name} ${q2[0].goals} - ${q2[1].goals} ${q2[1].name} => ${q2Winner.name} `
    );
    this.semifinalLosers.push([...aux].pop());
    this.semifinalWinners.push(q1Winner, q2Winner);


    console.log("\n======================================");
    console.log("||***|| Tercer y Cuarto Puesto ||***||");
    console.log("======================================\n");

    const third = this.knockoutMatch(
      this.semifinalLosers[0],
      this.semifinalLosers[1]
    );
    
    console.log(
      `${this.semifinalLosers[0].name} ${this.semifinalLosers[0].goals} - ${this.semifinalLosers[1].goals} ${this.semifinalLosers[1].name} => ${this.semifinalLosers[third].name}`
    );
  }

  playFinal(teams = []) {
    console.log("\n======================================");
    console.log("||***|| Final ||***||");
    console.log("======================================\n");

    const winner = this.knockoutMatch(teams[0], teams[1]);
    console.log(
      `${teams[0].name} ${teams[0].goals} - ${teams[1].goals} ${teams[1].name} => ${teams[winner].name}`
    );

    console.log("\n======================================");
    console.log(`||***|| ${teams[winner].name} Campeón!!||***||`);
    console.log("======================================\n");
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
