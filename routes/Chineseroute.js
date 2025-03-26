const express = require("express");
const router = express.Router();
const data = require("./chinesedata.json");

// Route to fetch all data
// router.get("/allthing", (req, res) => {
//     res.json(data); // Sending JSON response
// });

// Route to get Chinese Zodiac based on date of birth
router.get("/zodiac", (req, res) => {
    const { dateOfBirth } = req.query; // Read date from query params

    if (!dateOfBirth) {
        return res.status(400).json({ error: "Missing dateOfBirth parameter" });
    }

    try {
        const result = getChineseZodiac(dateOfBirth);
        res.json(result);
    } catch (error) {
        console.error("Error in /zodiac route:", error);
        res.status(500).json({ error: "Failed to fetch Chinese Zodiac data" });
    }
});

function getChineseZodiac(dateOfBirth) {
    let lang = getPreferredLanguage();
    let dob = new Date(dateOfBirth);

    if (isNaN(dob)) {
        throw new Error("Invalid date format");
    }

    const languageMap = {
        "en": "gn",
        "es": "es",
        "hi": "hi",
        "ru": "ru",
        "fr": "fr",
        "de": "de",
        "ko": "ko"
    };

    lang = languageMap[lang] || "gn"; // Default to 'gn' if unknown language

    const symbol = getSymbol(dob);

    const k = data["chinesezodiacprofile"];
    for (let i of k) {
        const m = i;
        const ranno = m["ranno"];
    
        if (ranno === String(symbol)) {
            const st = m["result"][lang];
            const animal = m["heading"][lang.trim()];
    
            const n = st.split("\n").map(line => line.trim()); // Trim whitespace for safety
    
            const qualities = n[0]?.split(":")[1]?.trim() || "";
            const moreCompatible = n[1]?.split(":")[1]?.trim() || "";
            const lessCompatible = n[2]?.split(":")[1]?.trim() || "";
            const luckySeason = n[3] || "";
            const luckyMonth = n[4] || "";
            const luckyStone = n[5]|| "";
            const luckyNumber = n[6]|| "";
            const luckyColor = n[7] || "";
            const polarity = n[8] || "";
    
            return {
                animal,
                qualities,
                moreCompatible,
                lessCompatible,
                luckySeason,
                luckyMonth,
                luckyStone,
                luckyNumber,
                luckyColor,
                polarity,
                
            };
        }
    }
    
    throw new Error("Zodiac symbol not found");
}

function getPreferredLanguage() {
    return "gn"; // Always return 'en' for English
}

function getSymbol(dateOfBirth) {
    const date = new Date(dateOfBirth);
    const formattedDate = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    const [year, month, day] = formattedDate.split("-");
    

    return getRabbo(day, month, year);
}

function getRabbo(day, month, year) {
    const animals = ["", "Pig", "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog"];
    const dateStringValue = parseInt(year + month + day, 10);
    let rannocz = 0;

    if ((dateStringValue >= 19210208 && dateStringValue <= 19220127) || 
        (dateStringValue >= 19330126 && dateStringValue <= 19340213) ||
        (dateStringValue >= 19450213 && dateStringValue <= 19460201) ||
        (dateStringValue >= 19570131 && dateStringValue <= 19580217) ||
        (dateStringValue >= 19690217 && dateStringValue <= 19700205) ||
        (dateStringValue >= 19810205 && dateStringValue <= 19820124) ||
        (dateStringValue >= 19930123 && dateStringValue <= 19940209) ||
        (dateStringValue >= 20050209 && dateStringValue <= 20060128) ||
        (dateStringValue >= 20170128 && dateStringValue <= 20180215) ||
        (dateStringValue >= 20290213 && dateStringValue <= 20300202)) {
        rannocz = 11;
    } else if ((dateStringValue >= 19120218 && dateStringValue <= 19130205) || 
               (dateStringValue >= 19240205 && dateStringValue <= 19250123) ||
               (dateStringValue >= 19360124 && dateStringValue <= 19370210) ||
               (dateStringValue >= 19480210 && dateStringValue <= 19490128) ||
               (dateStringValue >= 19600128 && dateStringValue <= 19610214) ||
               (dateStringValue >= 19720215 && dateStringValue <= 19730202) ||
               (dateStringValue >= 19840202 && dateStringValue <= 19850219) ||
               (dateStringValue >= 19960219 && dateStringValue <= 19970206) ||
               (dateStringValue >= 20080206 && dateStringValue <= 20090125) ||
               (dateStringValue >= 20200125 && dateStringValue <= 20210211)) {
        rannocz = 2;
    } else if ((dateStringValue >= 19130206 && dateStringValue <= 19140125) || 
               (dateStringValue >= 19250124 && dateStringValue <= 19260212) ||
               (dateStringValue >= 19370211 && dateStringValue <= 19380130) ||
               (dateStringValue >= 19490129 && dateStringValue <= 19500216) ||
               (dateStringValue >= 19610215 && dateStringValue <= 19620204) ||
               (dateStringValue >= 19730203 && dateStringValue <= 19740122) ||
               (dateStringValue >= 19850220 && dateStringValue <= 19860208) ||
               (dateStringValue >= 19970207 && dateStringValue <= 19980127) ||
               (dateStringValue >= 20090126 && dateStringValue <= 20100213) ||
               (dateStringValue >= 20210211 && dateStringValue <= 20220131)) {
        rannocz = 3;
    } else if ((dateStringValue >= 19140126 && dateStringValue <= 19150213) || 
               (dateStringValue >= 19260213 && dateStringValue <= 19270201) ||
               (dateStringValue >= 19380131 && dateStringValue <= 19390218) ||
               (dateStringValue >= 19500217 && dateStringValue <= 19510205) ||
               (dateStringValue >= 19620205 && dateStringValue <= 19630124) ||
               (dateStringValue >= 19740123 && dateStringValue <= 19750210) ||
               (dateStringValue >= 19860209 && dateStringValue <= 19870128) ||
               (dateStringValue >= 19980128 && dateStringValue <= 19990215) ||
               (dateStringValue >= 20100214 && dateStringValue <= 20110202) ||
               (dateStringValue >= 20220201 && dateStringValue <= 20230121)) {
        rannocz = 4;
    } else if ((dateStringValue >= 19150214 && dateStringValue <= 19160202) || 
               (dateStringValue >= 19270202 && dateStringValue <= 19280122) ||
               (dateStringValue >= 19390219 && dateStringValue <= 19400208) ||
               (dateStringValue >= 19510206 && dateStringValue <= 19520126) ||
               (dateStringValue >= 19630125 && dateStringValue <= 19640212) ||
               (dateStringValue >= 19750211 && dateStringValue <= 19760130) ||
               (dateStringValue >= 19870129 && dateStringValue <= 19880216) ||
               (dateStringValue >= 19990216 && dateStringValue <= 20000204) ||
               (dateStringValue >= 20110203 && dateStringValue <= 20120122) ||
               (dateStringValue >= 20230122 && dateStringValue <= 20240209)) {
        rannocz = 5;
    } else if ((dateStringValue >= 19160203 && dateStringValue <= 19170122) || 
               (dateStringValue >= 19280123 && dateStringValue <= 19290209) ||
               (dateStringValue >= 19400209 && dateStringValue <= 19410126) ||
               (dateStringValue >= 19520127 && dateStringValue <= 19530213) ||
               (dateStringValue >= 19640213 && dateStringValue <= 19650201) ||
               (dateStringValue >= 19760131 && dateStringValue <= 19770217) ||
               (dateStringValue >= 19880217 && dateStringValue <= 19890205) ||
               (dateStringValue >= 20000205 && dateStringValue <= 20010123) ||
               (dateStringValue >= 20120123 && dateStringValue <= 20130209) ||
               (dateStringValue >= 20240210 && dateStringValue <= 20250125)) {
        rannocz = 6;
    } else if ((dateStringValue >= 19170123 && dateStringValue <= 19180210) || 
               (dateStringValue >= 19290210 && dateStringValue <= 19300129) ||
               (dateStringValue >= 19410127 && dateStringValue <= 19420214) ||
               (dateStringValue >= 19530214 && dateStringValue <= 19540202) ||
               (dateStringValue >= 19650202 && dateStringValue <= 19660120) ||
               (dateStringValue >= 19770218 && dateStringValue <= 19780206) ||
               (dateStringValue >= 19890206 && dateStringValue <= 19900126) ||
               (dateStringValue >= 20010124 && dateStringValue <= 20020211) ||
               (dateStringValue >= 20130210 && dateStringValue <= 20140130) ||
               (dateStringValue >= 20250129 && dateStringValue <= 20260216)) {
        rannocz = 7;
    } else if (
        (dateStringValue >= 19180211 && dateStringValue <= 19190131) ||
        (dateStringValue >= 19300130 && dateStringValue <= 19310216) ||
        (dateStringValue >= 19420215 && dateStringValue <= 19430204) ||
        (dateStringValue >= 19540203 && dateStringValue <= 19550123) ||
        (dateStringValue >= 19660121 && dateStringValue <= 19670208) ||
        (dateStringValue >= 19780207 && dateStringValue <= 19790127) ||
        (dateStringValue >= 19900127 && dateStringValue <= 19910214) ||
        (dateStringValue >= 20020212 && dateStringValue <= 20030131) ||
        (dateStringValue >= 20140131 && dateStringValue <= 20150218) ||
        (dateStringValue >= 20260217 && dateStringValue <= 20270205)
      ) {
        rannocz = 8;
      } else if (
        (dateStringValue >= 19190201 && dateStringValue <= 19200219) ||
        (dateStringValue >= 19310217 && dateStringValue <= 19320205) ||
        (dateStringValue >= 19430205 && dateStringValue <= 19440124) ||
        (dateStringValue >= 19550124 && dateStringValue <= 19560211) ||
        (dateStringValue >= 19670209 && dateStringValue <= 19680129) ||
        (dateStringValue >= 19790128 && dateStringValue <= 19800215) ||
        (dateStringValue >= 19910215 && dateStringValue <= 19920203) ||
        (dateStringValue >= 20030201 && dateStringValue <= 20040121) ||
        (dateStringValue >= 20150219 && dateStringValue <= 20160207) ||
        (dateStringValue >= 20270206 && dateStringValue <= 20280125)
      ) {
        rannocz = 9;
      } else if (
        (dateStringValue >= 19200220 && dateStringValue <= 19210207) ||
        (dateStringValue >= 19320206 && dateStringValue <= 19330125) ||
        (dateStringValue >= 19440125 && dateStringValue <= 19450212) ||
        (dateStringValue >= 19560212 && dateStringValue <= 19570130) ||
        (dateStringValue >= 19680130 && dateStringValue <= 19690216) ||
        (dateStringValue >= 19800216 && dateStringValue <= 19810204) ||
        (dateStringValue >= 19920204 && dateStringValue <= 19930122) ||
        (dateStringValue >= 20040122 && dateStringValue <= 20050208) ||
        (dateStringValue >= 20160208 && dateStringValue <= 20170127) ||
        (dateStringValue >= 20280126 && dateStringValue <= 20290212)
      ) {
        rannocz = 10;
      } else if (
        (dateStringValue >= 19220128 && dateStringValue <= 19230215) ||
        (dateStringValue >= 19460202 && dateStringValue <= 19470121) ||
        (dateStringValue >= 19580218 && dateStringValue <= 19590207) ||
        (dateStringValue >= 19700206 && dateStringValue <= 19710126) ||
        (dateStringValue >= 19820125 && dateStringValue <= 19830212) ||
        (dateStringValue >= 19940210 && dateStringValue <= 19950130) ||
        (dateStringValue >= 20060129 && dateStringValue <= 20070217) ||
        (dateStringValue >= 20180216 && dateStringValue <= 20190204) ||
        (dateStringValue >= 20300203 && dateStringValue <= 20310122) ||
        (dateStringValue >= 19340214 && dateStringValue <= 19350203)
      ) {
        rannocz = 12;
      } else if (
        (dateStringValue >= 19230216 && dateStringValue <= 19240204) ||
        (dateStringValue >= 19350204 && dateStringValue <= 19360123) ||
        (dateStringValue >= 19470122 && dateStringValue <= 19480209) ||
        (dateStringValue >= 19590208 && dateStringValue <= 19600127) ||
        (dateStringValue >= 19710127 && dateStringValue <= 19720224) ||
        (dateStringValue >= 19830213 && dateStringValue <= 19840201) ||
        (dateStringValue >= 19950131 && dateStringValue <= 19960218) ||
        (dateStringValue >= 20070218 && dateStringValue <= 20080206) ||
        (dateStringValue >= 20190205 && dateStringValue <= 20200124) ||
        (dateStringValue >= 20310123 && dateStringValue <= 20320210)
      ) {
        rannocz = 1;
      } else {
        rannocz = 8;
      }
      
      return rannocz;
}

module.exports = router;