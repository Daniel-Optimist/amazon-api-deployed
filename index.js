const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config(); // configured to be able to read the keys in .env files
const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();
app.use(cors({ origin: true })); // origin set to true for all cors to work
app.use(express.json());

//get request
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Success!",
  });
});

// post request for payment :sending payment from basket ; payment intent creation; async coz we make a call to stripe and it returns a promise
app.post("/payment/create", async (req, res) => {
  // payment from user using query
  const total = req.query.total;
  //   stripe process only payment>0
  if (total > 0) {
    // console.log("payment received", total);
    // res.send(total);
    //  note stripe.paymentIntents is plural
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
    });
    console.log(paymentIntent);
    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
    });
  } else {
    res.status(403).json({
      message: "total payment must be greater than 0",
    });
  }
});

app.listen(5000, (err) => {
  if (err) throw err;
  console.log("Amazon-clone server running on port :5000, http://localhost:5000");
});

// exports.api = onRequest(app); // our app is being served via firebase using firebase's onRequest method instead of listening by itself; the firebase emmulator generates a local(http://127.0.0.1) api endpoint with port number (5001) and our project name registered in firebase for listening: http://127.0.0.1:5001/clone-dangetu/us-central1/api 
