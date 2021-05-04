// This file will retrieve game data and is run in isolation for the first run so
// that it can load the data before any module or command is run
const { StartTasks } = require('../tasks')
StartTasks()