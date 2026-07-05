import express from "express"
import getEnv from "./utils/validateEnv.js"
import router from "./router/index.js"

const app = express()
const { PORT } = getEnv()

app.use("/products", router)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})