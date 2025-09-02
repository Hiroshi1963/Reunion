// Node.js + Express backend
// This script serves index.html and accepts POST /register to append to registrations.txt


const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());


// Serve static files from current directory
app.use(express.static(__dirname));


// Helper: simple email/name validation
function isValidName(n){ return typeof n === 'string' && n.trim().length <= 100 && n.trim().length > 0; }
function isValidEmail(e){ return typeof e === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e); }


app.post('/register', (req, res) => {
try {
const { name, email } = req.body || {};
if (!isValidName(name) || !isValidEmail(email)) {
return res.status(400).json({ error: '名前またはメールアドレスの形式が不正です' });
}


const safeName = String(name).replace(/\r|\n/g, ' ');
const safeEmail = String(email).replace(/\r|\n/g, ' ');
const timestamp = new Date().toISOString();


// Append line: ISO_TIMESTAMP NAME EMAIL\n
const line = `${timestamp}\t${safeName}\t${safeEmail}\n`;
const filePath = path.join(__dirname, 'registrations.txt');


fs.appendFile(filePath, line, { encoding: 'utf8', flag: 'a' }, (err) => {
if (err) {
console.error('Failed to append:', err);
return res.status(500).json({ error: '登録情報の保存に失敗しました' });
}
return res.json({ message: '登録ありがとうございます' });
});
} catch (err) {
console.error(err);
res.status(500).json({ error: 'サーバーエラー' });
}
});


// Optional: endpoint to download registrations (simple, no auth!)
app.get('/registrations.txt', (req, res) => {
const filePath = path.join(__dirname, 'registrations.txt');
res.sendFile(filePath, err => { if (err) res.status(404).send('No registrations yet'); });
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

