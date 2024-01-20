const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/routes");
const morgan = require("morgan");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(morgan("dev"));

app.use("/", routes);

app.listen(port, () => {
  console.log(`Server listen: ${port}`);
});
