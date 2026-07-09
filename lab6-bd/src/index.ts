import express from "express";
import cors from "cors";
import getEnv from "./utils/validateEnv.js";
import router from "./router/index";

const app = express();
const { PORT } = getEnv();

app.use(cors());
app.use(express.json());
app.use("/products", router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
