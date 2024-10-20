const knex = require("../database/knex")
const AppError = require("../utils/AppError")

class MovieNotesController {
    async create(req, res) {
        const { title, description, rating, movie_tags } = req.body
        const user_id = req.user.id

        if (rating > 5 || rating < 1) {
            throw new AppError("Rating precisa estar entre 1 e 5.")
        }

        const [movie_note_id] = await knex("movie_notes").insert({
            title,
            description,
            rating,
            user_id,
        })

        const movieTagsInsert = movie_tags.map((name) => {
            return {
                movie_note_id,
                name,
                user_id,
            }
        })

        await knex("movie_tags").insert(movieTagsInsert)

        return res.json()
    }

    async show(req, res) {
        const { id } = req.params

        const movieNote = await knex("movie_notes").where({ id }).first()
        const movieTags = await knex("movie_tags")
            .where({ movie_note_id: id })
            .orderBy("name")

        return res.json({
            ...movieNote,
            movieTags,
        })
    }

    async delete(req, res) {
        const { id } = req.params

        await knex("movie_notes").where({ id }).delete()

        return res.json()
    }

    async index(req, res) {
        const { title, movie_tags } = req.query
        const user_id = req.user.id

        let movieNotes

        if (movie_tags) {
            const filterMovieTags = movie_tags
                .split(",")
                .map((movieTag) => movieTag.trim())

            movieNotes = await knex("movie_tags")
                .select([
                    "movie_notes.id",
                    "movie_notes.title",
                    "movie_notes.user_id",
                ])
                .where("movie_notes.user_id", user_id)
                .whereLike("movie_notes.title", `%${title}%`)
                .whereIn("name", filterMovieTags)
                .innerJoin(
                    "movie_notes",
                    "movie_notes.id",
                    "movie_tags.movie_note_id"
                )
                .orderBy("movie_notes.title")
        } else {
            movieNotes = await knex("movie_notes")
                .where({ user_id })
                .whereLike("title", `%${title}%`)
                .orderBy("title")
        }

        const userTags = await knex("movie_tags").where({
            user_id,
        })
        const movieNotesWithTags = movieNotes.map((movieNote) => {
            const movieNoteTags = userTags.filter(
                (movieTag) => movieTag.movie_note_id === movieNote.id
            )

            return {
                ...movieNote,
                movieTags: movieNoteTags,
            }
        })

        return res.json(movieNotesWithTags)
    }
}

module.exports = MovieNotesController
