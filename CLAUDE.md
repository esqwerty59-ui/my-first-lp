# CLAUDE.md

## プロジェクト概要

ランディングページ（CAFÉ MORI）および自己紹介作成のプロジェクトです。

## 使用技術

- HTML / CSS / JavaScript

## ファイル配置ルール

- `index.html`, `profile/index.html`… ページ本体
- `style.css`, `profile/style.css`… スタイル（CSS はすべてここにまとめる。HTML 内の `<style>` やインラインスタイルは使わない）
- `script.js`, `profile/script.js`… 動き・インタラクション（JavaScript はすべてここにまとめる。HTML 内の `<script>` やインラインのイベント属性は使わない）

## 禁止事項

- 動作確認用の `console.log` は残さない
- 使用していないCSSは残さない
- 外部ライブラリは勝手に入れない
- 言及していないファイルは直さない

## 補足情報

- インデントの幅は2スペースにする
- クラスはBEM形式で命名する
- 色はCSS変数を用いて決定する
- コメントは日本語で書く
