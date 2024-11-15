const express = require('express');
const Database = require('better-sqlite3');
const CryptoJS = require('crypto-js');
require("dotenv").config();

const router = express.Router();

// Connect to the SQLite Database
const db = new Database('palmreading.db', { verbose: console.log });

// Secret key for encryption (make sure this is secure)
const SECRET_KEY = process.env.encryptionkey ;

// Helper function to execute a query and return results
const dbQuery = (query, params = []) => {
    try {
        const stmt = db.prepare(query);
        return stmt.all(params);
    } catch (err) {
        throw new Error(err.message);
    }
};

// Helper function for encryption
const encryptData = (data) => {
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    return ciphertext;
};

// Combined route to fetch all the data with nested structure
router.get('/all-data/:sid/:hid', (req, res) => {
    const allData = {};
    const { sid, hid } = req.params; // Retrieve sid and hid from request parameters

    try {
        const heartlineRow = dbQuery('SELECT sdesc, imgname FROM main WHERE sname = ?', ['Heart Line Reading']);
        allData.heartline = {
            description: heartlineRow[0]?.sdesc,
            image: heartlineRow[0]?.imgname,
            questions: []
        };

        const heartlineQuestions = dbQuery('SELECT qno, que FROM ques WHERE cid = 0 AND sid = ?', [sid]);

        allData.heartline.questions = heartlineQuestions.map((question) => {
            const qno = question.qno;

            const heartlineOptions = dbQuery('SELECT optno, opttxt FROM opts WHERE category = 0 AND sid = ? AND hid = ? AND qno = ?', [sid, hid, qno]);
            const answersRows = dbQuery('SELECT * FROM ans WHERE sid = ? AND hid = ? AND cid = 0 AND qid = ?', [sid, hid, qno]);

            return {
                ...question,
                options: heartlineOptions,
                answers: answersRows
            };
        });

        allData.heartline.questionCount = allData.heartline.questions.length;
        allData.hands = dbQuery('SELECT * FROM hands WHERE sid = ? AND category = 0', [sid]);
        allData.handDetail = dbQuery('SELECT * FROM hands WHERE sid = ? AND handid = ? AND category = 0', [sid, hid]);
        allData.imgForScroll = dbQuery('SELECT img_name, img_labels, labelnames FROM imgForScroll WHERE sid = ?', [sid]);

        const imgAnsRow = dbQuery(`
            SELECT imgans FROM hands 
            WHERE sid = (SELECT sid FROM main WHERE sname = ?) 
            AND category = 1`, ['Heart Line Reading']);

        allData.imgans = imgAnsRow[0];

        // Encrypt and send the response
        res.json({ data: encryptData(allData) });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Another route example with `better-sqlite3`
router.get('/fetch-dataaa', (req, res) => {
    const sid = 5; // Keep sid constant as per your requirement
    const hidRange = [1, 10]; // hid from 1 to 10
    let result = [];

    try {
        for (let hid = hidRange[0]; hid <= hidRange[1]; hid++) {
            let currentHidData = { hid, questions: [] };

            const quesRows = dbQuery('SELECT qno, que FROM ques WHERE sid = ? AND hid = ? AND cid = ?', [sid, hid, 0]);

            if (quesRows.length > 0) {
                for (const ques of quesRows) {
                    let questionData = { qno: ques.qno, que: ques.que, opts: [], ans: [] };

                    // Fetch options for the question
                    const optsRows = dbQuery('SELECT optno, opttxt FROM opts WHERE sid = ? AND hid = ? AND qno = ? AND category = ?', [sid, hid, ques.qno, 0]);
                    questionData.opts = optsRows.length > 0 ? optsRows : `No options found for question qno=${ques.qno}`;

                    // Fetch answers for the question
                    const ansRows = dbQuery('SELECT * FROM ans WHERE sid = ? AND hid = ? AND qid = ?', [sid, hid, ques.qno]);
                    questionData.ans = ansRows.length > 0 ? ansRows : `No answers found for question qno=${ques.qno}`;

                    currentHidData.questions.push(questionData);
                }
            } else {
                currentHidData.questions = `No questions found for hid=${hid}`;
            }

            result.push(currentHidData);
        }

        // Encrypt and send the response
        res.json({ data: encryptData(result) });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
