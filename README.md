# サッカースタッツ管理システム用クライアントページ

## 作成背景（Background）
　SpringBootを使用したWebアプリケーション開発の学習成果として、サッカーの試合成績を管理できるRestAPIを作成しましたが、実際の登録や検索機能を使いやすくするためにこのReactによるクライアントページを作成しました。

　Webアプリケーション開発は[こちら](https://github.com/AijiY/FootballStatsManagement)で実施しています。

## 開発環境（Development Environment）
### 技術（Technologies）
![badge](https://img.shields.io/badge/npm-10.8.2-CB3837.svg?logo=npm&logoColor=white)
![badge](https://img.shields.io/badge/Node.js-20.16.0-8CC84B.svg?logo=nodedotjs&logoColor=white)

### ツール（Tools）
![badge](https://img.shields.io/badge/Visual%20Studio%20Code-1.95.0-007ACC.svg?logo=visual-studio-code&style=flat)
![badge](https://img.shields.io/badge/-Create%20React%20App-555.svg?logo=react&style=flat)
![badge](https://img.shields.io/badge/draw.io-FB9D3A.svg?logo=diagramsdotnet&logoColor=white)
![badge](https://img.shields.io/badge/Microsoft%20Clipchamp-007ACC.svg?logo=visual-studio-code&style=flat)
![badge](https://img.shields.io/badge/OBS%20Studio-30.2.3-302E31.svg?logo=obsstudio&logoColor=white)

## 機能（Function） 
- **登録** ：国～選手までの基本データ、および試合結果を登録できます。
- **検索** ：上記の基本データおよび子順位表や個人成績などを検索できます。

## ページ遷移図（Page Transition Diagram）
![PageTransitionDiagram drawio](https://github.com/user-attachments/assets/08815c38-5f97-41a1-b6ad-855fc1b904b2)

## 工夫した点 (Points to Note)
- **登録後の挙動**<br>
ユーザーがデータを登録後に適切なページに遷移したり、所定の入力欄にフォーカスしたりして利便性を向上させています。
- **取得したデータのnullチェック**<br>
APIから取得したデータを用いてページ作成する際に、nullチェックを実施して不要なInternalServerErrrorが発生しないようにしています。

## 今後の課題（Future Improvements）
- **更新機能** ：クラブおよび選手情報の更新ページの追加
- **テスト実施** ：フロントエンドテストまたはE2Eテストの実施による品質の担保

## AWS構成（AWS Configuration）
※作成中
