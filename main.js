import { League } from "./classes/League.js"
import { Team } from "./classes/Team.js"
import { teams as teamNames } from "./teams.js"

const liga = new League("Eurocopa")
const teams = teamNames.map((team) => {
  return new Team(team)
})

liga.startLeague(teams)
