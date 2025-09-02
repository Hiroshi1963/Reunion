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
  const { name, email, comment } = req.body || {};
  const timestamp = new Date().toISOString();

  // 改行をエスケープ文字に置換
  const safeComment = comment.replace(/\r?\n/g, "\\n");
  const line = `${timestamp}\t${name}\t${email}\t${safeComment}\n`;

  const filePath = path.join(__dirname, 'registrations.txt');

  fs.appendFile(filePath, line, (err) => {
    if (err) {
      console.error("書き込みエラー:", err);
      return res.status(500).json({ success: false, message: '保存に失敗しました' });
    }
    res.json({ success: true, message: '登録完了！' });
  });
});


// Optional: endpoint to download registrations (simple, no auth!)
app.get('/registrations.txt', (req, res) => {
  const filePath = path.join(__dirname, 'registrations.txt');
  res.sendFile(filePath, err => { if (err) res.status(404).send('No registrations yet'); });
});

// 登録済みリスト取得用API
app.get('/registrations', (req, res) => {
  const filePath = path.join(__dirname, 'registrations.txt');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: "ファイル読み込み失敗" });
    }

    const lines = data.trim().split('\n').map(line => {
      // タブで分割、コメント列も読み込む
      const [timestamp, name, email, comment] = line.split('\t');
      return { timestamp, name, email, comment };
    });

    res.json(lines);
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

