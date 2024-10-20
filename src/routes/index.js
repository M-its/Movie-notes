const { Router } = require("express")

const userRouter = require("./users.routes")
const movieNotesRouter = require("./movie_notes.routes")
const tagsRouter = require("./movie_tags.routes")
const sessionsRouter = require("./sessions.routes")

const routes = Router()

routes.use("/users", userRouter)
routes.use("/sessions", sessionsRouter)
routes.use("/movie_notes", movieNotesRouter)
routes.use("/movie_tags", tagsRouter)

module.exports = routes
