import express, { Request, Response, NextFunction } from "express"
import cors from "cors"
import morgan from "morgan"
import routes from "./routes"
import env from "@/env"
import { HttpError } from "./utils/httpError"

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan("dev"))

app.use("/api", routes)

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
    message: err.message,
  })
})

app.use((req: Request, res: Response) => {
  handleNotFound(req, res)
})

app.listen(env.PORT, async () => {
  console.log(`Server running on port ${env.PORT}`)
})

function handleNotFound(req: Request, res: Response) {
  res.status(404)
  const accept = req.headers["accept"] || ""

  if (accept.includes("application/json")) {
    res.json({ message: "Nothing to see here. For more information see README. (https://github.com/ESCORIAL-SAIC/mbti-api/blob/main/README.md)" })
  } else {
    res.send("<pre>Nothing to see here. For more information see <a href=\"https://github.com/ESCORIAL-SAIC/mbti-api/blob/main/README.md\" target=\"_blank\">README</a>. (https://github.com/ESCORIAL-SAIC/mbti-api/blob/main/README.md)</pre>")
  }
}

export default app
