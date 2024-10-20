const { Router } = require("express")

const SessionsController = require("../controllers/Sessions.Controller")
const sessionController = new SessionsController()

const sessionsRoutes = Router()
sessionsRoutes.post("/", sessionController.create)

module.exports = sessionsRoutes
