const express = require("express");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const app = express();
app.use(bodyParser.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
//middleware
app.use(express.json());

// cloudnary
cloudinary.config({
  cloud_name: "dbk1ngrem",
  api_key: "323467126297456",
  api_secret: "Y4t2hn4GWGx6GAmbm7p7qepDKUM",
});

app.get("/myget", (req, res) => {
  console.log(req.body);
  res.send(req.query);
});

// multiple files
app.post("/mypost", async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  let result;
  let imageArray = [];

  // case - multiple images

  if (req.files) {
    for (let index = 0; index < req.files.samplefile.length; index++) {
      let result = await cloudinary.uploader.upload(
        req.files.samplefile[index].tempFilePath,
        {
          folder: "users",
        }
      );

      imageArray.push({
        public_id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }

  // ### use case for single image
  // let file = req.files.samplefile;
  // result = await cloudinary.uploader.upload(file.tempFilePath, {
  //   folder: "users",
  // });

  console.log(result);

  let details = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    result,
    imageArray,
  };
  console.log(details);

  res.send(details);
});

app.get("/getform", (req, res) => {
  res.render("getform");
});

app.get("/postform", (req, res) => {
  res.render("postform");
});

app.listen(3000, () => console.log("listning on port 3000"));
