const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const router = express.Router();

// Connect to the SQLite Database
const db = new sqlite3.Database('palmreading.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Helper function to execute a query and return a promise
const dbQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
};

// Combined route to fetch all the data with nested structure
router.get('/all-data/:sid/:hid', async (req, res) => {
    const allData = {};
    const { sid, hid } = req.params; // Retrieve sid and hid from request parameters

    try {
        // allData.main = await dbQuery('SELECT * FROM main WHERE category = 0');

        const heartlineRow = await dbQuery('SELECT sdesc, imgname FROM main WHERE sname = ?', ['Heart Line Reading']);
        allData.heartline = {
            description: heartlineRow[0]?.sdesc,
            image: heartlineRow[0]?.imgname,
            questions: []
        };

        const heartlineQuestions = await dbQuery('SELECT qno, que FROM ques WHERE cid = 0 AND sid = ?', [sid]);

        const questionPromises = heartlineQuestions.map(async (question) => {
            const qno = question.qno;

            const heartlineOptions = await dbQuery('SELECT optno, opttxt FROM opts WHERE category = 0 AND sid = ? AND hid = ? AND qno = ?', [sid, hid, qno]);
            const answersRows = await dbQuery('SELECT * FROM ans WHERE sid = ? AND hid = ? AND cid = 0 AND qid = ?', [sid, hid, qno]);

            return {
                ...question,
                options: heartlineOptions,
                answers: answersRows
            };
        });

        allData.heartline.questions = await Promise.all(questionPromises);
        allData.heartline.questionCount = allData.heartline.questions.length;

        allData.hands = await dbQuery('SELECT * FROM hands WHERE sid = ? AND category = 0', [sid]);
        allData.handDetail = await dbQuery('SELECT * FROM hands WHERE sid = ? AND handid = ? AND category = 0', [sid, hid]);
        allData.imgForScroll = await dbQuery('SELECT img_name, img_labels, labelnames FROM imgForScroll WHERE sid = ?', [sid]);

        const imgAnsRow = await dbQuery(`
            SELECT imgans FROM hands 
            WHERE sid = (SELECT sid FROM main WHERE sname = ?) 
            AND category = 1`, ['Heart Line Reading']);

        allData.imgans = imgAnsRow[0];

        // Send the final response with all nested and organized data
        res.json(allData);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/fetch-dataaa', async (req, res) => {
    const sid = 5; // Keep sid constant as per your requirement
    const hidRange = [1, 10]; // hid from 1 to 10
    let result = [];
  
    try {
      for (let hid = hidRange[0]; hid <= hidRange[1]; hid++) {
        let currentHidData = { hid, questions: [] };
  
        // Fetch ques data (questions) for this hid
        const quesQuery = 'SELECT qno, que FROM ques WHERE sid = ? AND hid = ? AND cid = ?';
        await new Promise((resolve, reject) => {
          db.all(quesQuery, [sid, hid, 0], async (err, quesRows) => {
            if (err) {
              reject(err);
            } else if (quesRows.length > 0) {
              // For each question, fetch its options and answers
              for (const ques of quesRows) {
                let questionData = { qno: ques.qno, que: ques.que, opts: [], ans: [] };
  
                // Fetch options for the question
                const optsQuery = 'SELECT optno, opttxt FROM opts WHERE sid = ? AND hid = ? AND qno = ? AND category = ?';
                await new Promise((resolve, reject) => {
                  db.all(optsQuery, [sid, hid, ques.qno, 0], (err, optsRows) => {
                    if (err) {
                      reject(err);
                    } else if (optsRows.length > 0) {
                      questionData.opts = optsRows; // Add options to the questionData
                    } else {
                      questionData.opts = `No options found for question qno=${ques.qno}`;
                    }
                    resolve();
                  });
                });
  
                // Fetch answers for the question
                const ansQuery = 'SELECT * FROM ans WHERE sid = ? AND hid = ? AND qid = ?';
                await new Promise((resolve, reject) => {
                  db.all(ansQuery, [sid, hid, ques.qno], (err, ansRows) => {
                    if (err) {
                      reject(err);
                    } else if (ansRows.length > 0) {
                      questionData.ans = ansRows; // Add answers to the questionData
                    } else {
                      questionData.ans = `No answers found for question qno=${ques.qno}`;
                    }
                    resolve();
                  });
                });
  
                // Add this question data (including options and answers) to the currentHidData
                currentHidData.questions.push(questionData);
              }
            } else {
              currentHidData.questions = `No questions found for hid=${hid}`;
            }
            resolve();
          });
        });
  
        // Push the data for this hid into the final result
        result.push(currentHidData);
      }
  
      res.json(result); // Send the result back as a JSON response
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

module.exports = router;
