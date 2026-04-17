import express from 'express'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const app = express();
const port = 3000;
const baseURL = "https://api.rawg.io/api/games";

app.use(express.static("public"))
app.set("view engine", "ejs")

function randomNumber(MIN, MAX) {
    return Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
}

const genres = [
    { id: 4, name: 'Action' },
    { id: 5, name: 'RPG' },
    { id: 2, name: 'Shooter' },
    { id: 3, name: 'Adventure' },
    { id: 10, name: 'Puzzle' },
    { id: 1, name: 'Racing' },
    { id: 6, name: 'Indie' },
    { id: 83, name: 'Platformer' },
]

app.get("/", (req, res) => {
    res.render("index.ejs")
})

app.get("/outcomes", async (req, res) => {
    try {
        console.log('API Key being used:', process.env.APIKey)
        let data = await axios.get(`${baseURL}`, {
            params: {
                key: process.env.APIKey,
                page: randomNumber(1, 100),
                page_size: 3
            }
        });

        res.json(data.data.results)
    } catch (error) {
        console.log(error)
    }
})

app.listen(port, () => {
    console.log(`We up yall w/ the gang: ${port}`)
})