HTML5 Game Framework
===
這是一個在台北科技大學資訊工程系大二物件導向程式設計實習課程中使用的遊戲框架，該遊戲框架將HTML底層的canvas操作進行封裝，讓學生可以不需具有canvas底層物件的知識，也能撰寫遊戲。

Change Log
---
### v3.1.1
#### Bugs Fixed
1. 修正框架HTML檔案結構問題
2. 修改預設編碼方式為utf-8

### v3.1
#### Features
1. Optimize功能可以透過`Framework.Config.isOptimize`進行調整，預設為關閉

### v3.0
#### Features
1. Enhancement capture & replay

### v2.1
#### Features
1. Capture & Replay

Directory Tree Structure
---
```
HTML5 Game Framework/
├── demo/ 一些遊戲專案
│   ├── AngryBird_demo Box2D 練習專案
│   ├── OOPLab_Sample 練習專案
│   └── bombman 炸彈超人的遊戲Demo
├── doc/ 關於框架使用的文件
├── src/ 框架程式碼根目錄
└── test/ 框架測試
    └── UnitTest/ 框架單元測試
```
