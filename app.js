if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const errorHandler = require("./middlewares/errorHandler");
const app = express();
const port = 3000;
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use(require("./routes/index"));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
