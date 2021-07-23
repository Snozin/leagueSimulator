import { League as L } from "./classes/League.js";
import { Team as T } from "./classes/Team.js";
import { teams as teamNames } from "./teams.js";

const liga = new L("De la justicia");
const prr = new T();

const teams = teamNames.map((team) => {
  return new T(team);
});

// console.log("name:", teams);
// console.log("name:", prr.getName());
// console.log("name:", liga.setPlayOffs([{name: 'Paco'},{name:'Hulio'},{name:'Juan'},{name:'Ana'},{name:'Tonio'},{name:'Jordi'},{name:'Alice'}]));
// console.log(liga.setPlayOffs(teams));

liga.setPlayOffs(teams);



// let equipos = "";

// liga.teamsR.forEach(
//   (equipo) => (equipos += `${equipo.name} <br>`));

// document.body.innerHTML = equipos;

/*
Pruebas para mostrar en navegador

let names = ''

teams.forEach(team => names += `${team.name} <br>`)


document.body.innerHTML = names;

*/
