const express = require("express");
const serverless = require("serverless-http");
const nodemailer = require("nodemailer");
const app = express();
/*
const PORT = process.env.PORT || 5500;
*/
const router = express.Router();
/*
app.use(express.static("public"));
app.use(express.urlencoded({ extend: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/", (req, res) => {
  console.log(req.body);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "nam.testeur@gmail.com",
      pass: "pass@_Axn,fju",
    },
  });

  const mailOptions = {
    from: "nam.testeur@gmail.com",
    to: req.body.email,
    subject: `Recrutement : ${req.body.first} ${req.body.last}`,
    text: "test",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      //console.log(error);
      res.send("error");
    } else {
      //console.log("email sent " + info.response);
      res.send("success");
    }
  });
});
*/
app.use(`/.netlify/functions/server`, router);

//app.use("/", (req, res) => res.sendFile(__dirname + "../public/index.html"));

/*app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/", (req, res) => {
  console.log(req.body);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "nam.testeur@gmail.com",
      pass: "pass@_Axn,fju",
    },
  });

  const mailOptions = {
    from: "nam.testeur@gmail.com",
    to: req.body.email,
    subject: `Recrutement : ${req.body.first} ${req.body.last}`,
    text: "test",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      //console.log(error);
      res.send("error");
    } else {
      //console.log("email sent " + info.response);
      res.send("success");
    }
  });
});

app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
});*/

module.exports = app;

module.exports.handler = serverless(app);
/*
const nodemailer = require("nodemailer");
*/
exports.handler = async function (event, context, callback) {
  // Parse the JSON text received.
  const body = JSON.parse(event.body);

  // Build an HTML string to represent the body of the email to be sent.
  const html = `<div style="margin: 20px auto;">test</div>`;

  // Generate test SMTP service account from ethereal.email. Only needed if you
  // don't have a real mail account for testing
  //let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "nam.testeur@gmail.com",
      pass: "pass@_Axn,fju",
    },
  });

  const mailOptions = {
    from: "nam.testeur@gmail.com",
    to: body.email,
    subject: `Recrutement : ${body.first} ${body.last}`,
    text: "test",
  };

  try {
    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        //console.log(error);
        res.send("error");
      } else {
        //console.log("email sent " + info.response);
        res.send("success");
      }
    });
    // Log the result
    console.log(info);
    callback(null, { statusCode: 200, body: JSON.stringify(info) });
  } catch (error) {
    // Catch and log error.
    callback(error);
  }
};
