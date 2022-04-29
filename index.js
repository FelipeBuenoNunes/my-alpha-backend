const express = require('express');
const app = express();
const cors = require('cors');
const routes = require("./src/routes/routes");
const cookieParser = require('cookie-parser');
require('dotenv/config');

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use("/", routes);




app.use(express.static('./src'));


module.exports

app.listen(process.env.PORT_SERVER, err => {
  if(err){
      console.log("There was a problem", err);
      return;
  }
  console.log(`Working...`, process.env.PORT_SERVER);
})