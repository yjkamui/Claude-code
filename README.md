# Cryptogram - 暗号解読ゲーム

英語の名言を暗号解読するパズルゲームのiOSアプリです。

## ゲームルール

- 英文の名言がアルファベット→数字に暗号化されて表示されます
- ステージ開始時に4〜5文字がヒントとして公開されます
- 数字をタップして対応するアルファベットを当ててください
- ライフは各ステージ3つ。0になるとゲームオーバー
- 全ての文字を解読するとステージクリア

## iOSアプリとしてビルド

### 必要なもの

- macOS
- Xcode 15以上
- Node.js 18以上
- CocoaPods (`sudo gem install cocoapods`)

### 手順

```bash
# 1. 依存パッケージをインストール
npm install

# 2. WebアセットをiOSプロジェクトに同期
npx cap sync ios

# 3. Xcodeでプロジェクトを開く
npx cap open ios
```

Xcodeで開いたら：
1. 左のナビゲータで **App** プロジェクトを選択
2. **Signing & Capabilities** でチーム（Apple Developer アカウント）を設定
3. 接続したiPhoneまたはシミュレーターを選択
4. **▶ Run** でビルド＆実行

### App Storeに公開する場合

1. Xcodeで **Product > Archive** を実行
2. **Distribute App** からApp Store Connectにアップロード

## PWAとしてiPhoneに追加（Xcodeなし）

Xcodeがなくても、Safariからホーム画面に追加できます：

1. `www/index.html` をWebサーバーにアップロード（GitHub Pages等）
2. iPhoneのSafariでアクセス
3. 共有ボタン → 「ホーム画面に追加」
4. フルスクリーンアプリとして起動されます

## プロジェクト構成

```
├── www/                    Web版のゲーム本体
│   ├── index.html          ゲームのHTML/CSS/JS
│   ├── manifest.json       PWAマニフェスト
│   └── assets/             アイコン画像
├── ios/                    iOS Xcodeプロジェクト
│   └── App/
├── capacitor.config.ts     Capacitor設定
├── scripts/                ビルドスクリプト
└── package.json
```
