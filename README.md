# サッカースタッツ管理システム用クライアントページ

## 作成背景（Background）
　SpringBootを使用したWebアプリケーション開発の学習成果として、サッカーの試合成績を管理できるRestAPIを作成しましたが、実際の登録や検索機能を使いやすくするためにこのCreate React Appによるクライアントページを作成しました。

　Webアプリケーション開発は[こちら](https://github.com/AijiY/FootballStatsManagement)で実施しています。

## 開発環境（Development Environment）
### 技術（Technologies）
![badge](https://img.shields.io/badge/Node.js-20.16.0-8CC84B.svg?logo=nodedotjs&logoColor=white)
![badge](https://img.shields.io/badge/npm-10.8.2-CB3837.svg?logo=npm&logoColor=white)
![badge](https://img.shields.io/badge/Javascript-276DC3.svg?logo=javascript&style=flat)


### ツール（Tools）
![badge](https://img.shields.io/badge/Visual%20Studio%20Code-1.95.0-007ACC.svg?logo=visual-studio-code&style=flat)
![badge](https://img.shields.io/badge/-Create%20React%20App-555.svg?logo=react&style=flat)
![badge](https://img.shields.io/badge/GitHub-%23181717?logo=github&logoColor=white)
![badge](https://img.shields.io/badge/GitHub_Actions-%232088FF?logo=githubactions&logoColor=white)
![badge](https://img.shields.io/badge/draw.io-FB9D3A.svg?logo=diagramsdotnet&logoColor=white)
![badge](https://img.shields.io/badge/Microsoft%20Clipchamp-007ACC.svg?logo=visual-studio-code&style=flat)
![badge](https://img.shields.io/badge/OBS%20Studio-30.2.3-302E31.svg?logo=obsstudio&logoColor=white)

## 機能（Function） 
- **登録** ：国～選手までの基本データ、および試合結果を登録できます。
- **検索** ：上記の基本データおよび子順位表や個人成績などを検索できます。
- **更新** ：選手情報の更新（名前、背番号の変更およびクラブの移籍）ができます。

## デモ動画（Demo Movie）
- **リーグ所属クラブ一覧の検索**<br>
![seach-clubs](https://github.com/user-attachments/assets/769fb2d8-97c5-46fd-ad03-01c5e3a567d1)
- **選手の検索**<br>
![search_player](https://github.com/user-attachments/assets/42ffba2c-ebfb-427b-962e-956838b4c580)
- **選手の登録**<br>
![register-players](https://github.com/user-attachments/assets/10c044ff-e2d9-4fd1-bdb4-cb41f24f058b)
- **試合結果の登録**<br>
![register-game-result](https://github.com/user-attachments/assets/23affa95-ea94-4e40-a56b-de67486833dd)

## ページ遷移図（Page Transition Diagram）
![PageTransitionDiagram drawio](https://github.com/user-attachments/assets/67af393f-18e3-42c5-b7b4-818c7ec0cd76)

## 工夫した点 (Points to Note)
- **登録後の挙動**<br>
ユーザーがデータを登録後に適切なページに遷移したり、所定の入力欄にフォーカスしたりして利便性を向上させています。
- **取得したデータのnullチェック**<br>
APIから取得したデータを用いてページ作成する際に、nullチェックを実施して不要なInternalServerErrrorが発生しないようにしています。

## 今後の課題（Future Improvements）
- **更新機能** ：クラブ情報の更新ページの追加
- **テスト実施** ：フロントエンドテストまたはE2Eテストの実施による品質の担保

## AWS構成（AWS Configuration）
※作成中
