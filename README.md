<!-- FILE: README.md -->
# Event registration site


## 構成
- index.html : フロントエンド
- server.js : Node/Express サーバー（POST /register を受ける）
- registrations.txt : 登録データ（無ければ最初に書き込まれる）


## 起動方法 (ローカル)
1. Node.js がインストールされていることを確認（推奨: Node 16+）
2. ターミナルをプロジェクトフォルダで開く
3. `npm install`
4. `npm start` または `node server.js`
5. ブラウザで `http://localhost:3000/` を開く


## 注意点
- この実装は学習／簡易用途向けです。本番では以下を検討してください:
- HTTPS（TLS）設定
- 入力のより厳格な検証とサニタイズ
- 認証（登録一覧を誰でもダウンロードできないように）
- 大量アクセス時のロック競合対策やログローテーション