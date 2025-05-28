const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const { zodiacprofile, posandnegzodiacsign, zodiacsigntraits } = require("./alldata.json");

router.post("/personality-analysis", (req, res) => {
  const { sign } = req.body;

  if (!sign) {
    return res.status(400).json({ error: "Sign is required" });
  }

  const profile = zodiacprofile.find((z) => z.sign === sign)?.result.gn;
  const qualities = posandnegzodiacsign.find((z) => z.sign === sign)?.result.gn;
  const traits = zodiacsigntraits.find((z) => z.sign === sign)?.result.gn;


const manPath = path.join(__dirname, "Man", `${sign}Man.txt`);
const womanPath = path.join(__dirname, "Woman", `${sign}Woman.txt`);
const RealtraitPath = path.join(__dirname, "Traits", `${sign}Traits.txt`);

  
  // const manPath = path.join(__filename, "man", `${sign}Man.txt`);
  // const womanPath = path.join(__filename, "Woman", `${sign}Woman.txt`);
  // const RealtraitPath = path.join(__filename, "Traits", `${sign}Traits.txt`);

  // Read all files in sequence
  fs.readFile(manPath, "utf8", (errMan, manContent) => {
    if (errMan) {
      console.error("Error reading Man file:", errMan.message);
      return res.status(404).json({ error: "Man text file not found" });
    }

    fs.readFile(womanPath, "utf8", (errWoman, womanContent) => {
      if (errWoman) {
        console.error("Error reading Woman file:", errWoman.message);
        return res.status(404).json({ error: "Woman text file not found" });
      }

      fs.readFile(RealtraitPath, "utf8", (errTraits, traitsContent) => {
        if (errTraits) {
          console.error("Error reading Traits file:", errTraits.message);
          return res.status(404).json({ error: "Traits text file not found" });
        }

        // ✅ Moved inside the final callback
        res.json({
          profile,
          qualities,
          traits,
          Man: manContent,
          Woman: womanContent,
          realtraits: traitsContent,
        });
      });
    });
  });
});

module.exports = router;
