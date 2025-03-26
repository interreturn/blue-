const express = require("express");
const router = express.Router();
const { nameAnalysisData, firstLetter,nameTrueMeaning , nameSecretsPositive, nameSecretsNegative} = require("./Nameanalysis-data.js");

function nameAnalysis(name) {
  let upperName = name.toUpperCase();
  let nameParts = upperName.split(" ");
  let tempData = [...nameAnalysisData]; // Copy to prevent modification
  let result = {};

  // Function to get analysis for a given name string
  function analyzeLetters(nameStr) {
    let analysisResult = [];
    let tempCopy = [...tempData]; // Copy again to prevent reuse conflicts

    for (let char of nameStr) {
      if (tempCopy.length === 0) break; // Prevent errors if empty
      let randomIndex = Math.floor(Math.random() * tempCopy.length);
      let analysis = tempCopy[randomIndex];
      tempCopy.splice(randomIndex, 1); // Remove used element

      analysisResult.push({ letter: char, meaning: analysis });
    }

    return analysisResult;
  }

  if (nameParts.length > 1) {
    // If space is present, treat as first and second name
    result.firstName = analyzeLetters(nameParts[0]);
    result.secondName = analyzeLetters(nameParts[1]);
  } else {
    // If no space, analyze full name
    result.fullName = analyzeLetters(upperName);
  }

  // Always include first letter as a string, not an object
  result.firstLetter = upperName[0];

  return result;
}



function Firstletter(name) {
  let r = name.toUpperCase().split(""); 
  return firstLetter[r[0]]; // Return the analysis for the first letter
}

function Truemeaning(name){
  let res = "";
  let upperName = name.toUpperCase().split(""); 

  for (let letter of upperName) {
    if (nameTrueMeaning[letter]) {
      let randomMeaning = nameTrueMeaning[letter][Math.floor(Math.random() * nameTrueMeaning[letter].length)];
      res += randomMeaning + " ";
    }
  }

  return res.trim();
  
}

function getNameSecret(name) {
  let resultPositive = [];
  let resultNegative = [];

  let upperName = name.toUpperCase().split("");

  for (let char of upperName) {
    let data = nameSecretsPositive[char]?.[Math.floor(Math.random() * nameSecretsPositive[char].length)];
    if (data) resultPositive.push(data);
  }

  for (let char of upperName) {
    let data = nameSecretsNegative[char]?.[Math.floor(Math.random() * nameSecretsNegative[char].length)];
    if (data) resultNegative.push(data);
  }

  return {
    positives: resultPositive.join(", "),
    negatives: resultNegative.join(", ")
  };
}


router.post("/nameanalysis", (req, res) => {
  let name = req.body.name; // Extract only the first word
  let response = nameAnalysis(name);
  let firstLetterAnalysis = Firstletter(name);
  let Namemeaning=Truemeaning(name);
  let namesecrets =getNameSecret(name)

  res.json({ success: true, analysis: response, firstLetterMeaning: firstLetterAnalysis , NameMeaning:Namemeaning , NameSecrets:namesecrets});
});

module.exports = router;
