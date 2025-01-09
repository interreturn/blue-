const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const CryptoJS = require('crypto-js');
require("dotenv").config();

const router = express.Router();

// Connect to the SQLite Database
const db = new sqlite3.Database('palmreading.db', (err) => {
    if (err) {
        console.error('Failed to connect to SQLite database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Secret key for encryption (make sure this is secure)
const SECRET_KEY = process.env.encryptionkey;

// Helper function for encryption
const encryptData = (data) => {
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    return ciphertext;
};

// Helper function to execute a query and return results (Promise-based)
const dbQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err.message);
            } else {
                resolve(rows);
            }
        });
    });
};

// Combined route to fetch all the data with nested structure
router.get('/all-data/:sid/:hid', async (req, res) => {
    const allData = {};
    const { sid, hid } = req.params;

    try {
        const heartlineRow = await dbQuery('SELECT sdesc, imgname FROM main WHERE sname = ?', ['Heart Line Reading']);
        allData.heartline = {
            description: heartlineRow[0]?.sdesc,
            image: heartlineRow[0]?.imgname,
            questions: []
        };

        const heartlineQuestions = await dbQuery('SELECT qno, que FROM ques WHERE cid = 0 AND sid = ?', [sid]);
        allData.heartline.questions = await Promise.all(
            heartlineQuestions.map(async (question) => {
                const qno = question.qno;

                const heartlineOptions = await dbQuery('SELECT optno, opttxt FROM opts WHERE category = 0 AND sid = ? AND hid = ? AND qno = ?', [sid, hid, qno]);
                const answersRows = await dbQuery('SELECT * FROM ans WHERE sid = ? AND hid = ? AND cid = 0 AND qid = ?', [sid, hid, qno]);

                return {
                    ...question,
                    options: heartlineOptions,
                    answers: answersRows
                };
            })
        );

        allData.heartline.questionCount = allData.heartline.questions.length;
        allData.hands = await dbQuery('SELECT * FROM hands WHERE sid = ? AND category = 0', [sid]);
        allData.handDetail = await dbQuery('SELECT * FROM hands WHERE sid = ? AND handid = ? AND category = 0', [sid, hid]);
        allData.imgForScroll = await dbQuery('SELECT img_name, img_labels, labelnames FROM imgForScroll WHERE sid = ?', [sid]);

        const imgAnsRow = await dbQuery(`
            SELECT imgans FROM hands 
            WHERE sid = (SELECT sid FROM main WHERE sname = ?) 
            AND category = 1`, ['Heart Line Reading']);

        allData.imgans = imgAnsRow[0];

        // Encrypt and send the response
        res.json({ data: encryptData(allData) });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Another route example with `sqlite3`
router.get('/fetch-dataaa', async (req, res) => {
    const sid = 5; // Keep sid constant as per your requirement
    const hidRange = [1, 10]; // hid from 1 to 10
    let result = [];

    try {
        for (let hid = hidRange[0]; hid <= hidRange[1]; hid++) {
            let currentHidData = { hid, questions: [] };

            const quesRows = await dbQuery('SELECT qno, que FROM ques WHERE sid = ? AND hid = ? AND cid = ?', [sid, hid, 0]);

            if (quesRows.length > 0) {
                currentHidData.questions = await Promise.all(
                    quesRows.map(async (ques) => {
                        let questionData = { qno: ques.qno, que: ques.que, opts: [], ans: [] };

                        // Fetch options for the question
                        const optsRows = await dbQuery('SELECT optno, opttxt FROM opts WHERE sid = ? AND hid = ? AND qno = ? AND category = ?', [sid, hid, ques.qno, 0]);
                        questionData.opts = optsRows.length > 0 ? optsRows : `No options found for question qno=${ques.qno}`;

                        // Fetch answers for the question
                        const ansRows = await dbQuery('SELECT * FROM ans WHERE sid = ? AND hid = ? AND qid = ?', [sid, hid, ques.qno]);
                        questionData.ans = ansRows.length > 0 ? ansRows : `No answers found for question qno=${ques.qno}`;

                        return questionData;
                    })
                );
            } else {
                currentHidData.questions = `No questions found for hid=${hid}`;
            }

            result.push(currentHidData);
        }

        // Encrypt and send the response
        res.json({ data: encryptData(result) });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

module.exports = router;
