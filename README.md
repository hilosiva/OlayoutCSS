# Olayout CSS

Olayout は 俺流の「これさえあればだいたいのレイアウトができるんじゃない？」CSS フレームワークです。
主に以下の機能で成り立っています。

## 主な機能

- Reset
- Container & Spacer
- Grid System

### ブレイクポイント

ブレイクポイントは以下のようになっています。
なおブレイクポイントは「min-width」を採用していています。

| ブレイクポイント名 | 用途                               | デバイス幅 |
| ------------------ | ---------------------------------- | ---------- |
| min                | 全てのデバイス                     | `0` ~      |
| xxs                | iPhone7、8 など                    | `375px` ~  |
| xs                 | iPhone12 Pro Max など              | `414px` ~  |
| sm                 | 大きなスマホ、小さなタブレットなど | `576px` ~  |
| md                 | iPad など                          | `768px` ~  |
| lg                 | 小さなノート PC など               | `1024px` ~ |
| xl                 | 小さなデスクトップ PC など         | `1280px` ~ |
| xxl                | 大きなモニターなど                 | `1440px` ~ |

## インストール

`head` 要素内に `olayout.css` をリンクするだけでインストールは完了です。

CDN を利用する場合は、下記のようにしてください。
（ベータ版）

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/hilosiva/OlayoutCSS@beta/dist/olayout.css" />
```

## 初期設定

自身で用意した CSS のカスタムプロパティを使って、デザインカンプで使われているコンテンツ幅、余白、配色、書体などを設定できます。
以下のカスタムプロパティを上書きすることが可能です。（変更する可能性あり）

| カスタムプロパティ名  | 説明                                       | 初期値                                                       |
| --------------------- | ------------------------------------------ | ------------------------------------------------------------ |
| --ol-sm-design-width  | スマホのデザインカンプの幅                 | `375`                                                        |
| --ol-md-design-width  | タブレットのデザインカンプの幅             | `768`                                                        |
| --ol-lg-design-width  | PC のデザインカンプの幅                    | `1440`                                                       |
| --ol-space            | スペース量の基準値                         | `8`                                                          |
| --ol-base-color       | ベースカラー（削除するかも）               | `#fff`                                                       |
| --ol-main-color       | メインカラー（削除するかも）               | `#116ec5`                                                    |
| --ol-accent-color     | アクセントカラー（削除するかも）           | `#e4d558`                                                    |
| --ol-light-color      | 明るい背景用カラー（削除するかも）         | `#efefef`                                                    |
| --ol-dark-color       | 暗い背景用カラー（削除するかも）           | `#101010`                                                    |
| --ol-primary-font-set | 日本語用フォントファミリー（削除するかも） | `-apple-system, BlinkMacSystemFont, "Yu Gothic", sans-serif` |
| --ol-en-font-set      | 欧文用フォントファミリー（削除するかも）   | `"Helvetica Neue", "Helvetica", "Arial", sans-serif;`        |
| --ol-scroll-behavior  | ページ内スクロールの設定                   | `smooth`                                                     |

これらをカスタムプロパティを必要に応じて自身のスタイルシートの中で上書きすることができます。
（px は不要です）

```css
:root {
  /* カンプサイズ */
  --ol-sm-design-width: 320;
  --ol-lg-design-width: 1920;

  /* スペース量の基準値 */
  --ol-space: 10;

  /* 色 */
  --ol-main-color: #116ec5;

  /* 書体 */
  --ol-primary-font-set: "Noto Sans JP", sans-serif;
  --en-font-set: "Inter", sans-serif;

  /* ページ内スクロールの種類 */
  --ol-scroll-behavior: auto;
}
```

## Reset

ブラウザのデフォルトスタイルの CSS が入っています。
基本的には俺流の Reset CSS である「[OresetCSS](https://github.com/hilosiva/oreset.css)」がベースになっています。

- 全ての要素は box-sizing: border-box をデフォルトで継承する
- 不必要な margin 、 padding、 border を排除
- 文字サイズのリセットは行わない
- アクセシビリティに考慮

### カスタマイズ

ページの背景色、文字色、ベースとなる行の高さなどを CSS のカスタムプロパティを上書きすることで設定できます。

| 項目                   | カスタムプロパティ名         | 初期値   |
| ---------------------- | ---------------------------- | -------- |
| 行の高さ               | `--ol-base-line-height`      | `1.5`    |
| 文字間                 | `--ol-base-letter-spacing`   | `0.05em` |
| オプティカルメトリクス | `--ol-base-feature-settings` | `"pkna"` |

#### カスタマイズ例

```css
:root {
  --ol-base-color: #efefef;
  --ol-primary-font-set: "Noto Sans JP", sans-serif;
  --ol-base-feature-settings: "palt";
}
```

## Container

ボックスをコンテンツ幅でセンタリングする場合 `ol-container` クラスを設定します。

```html
<div class="ol-container">...</div>
```

デフォルトでは、横幅 `90%`、最大幅 `1280px` でボックスをセンタリングします。

なお、カスタムデータ属性を使うことで、デバイス幅によってのコンテンツ幅や最大値などを指定できます。

### data-width - センタリングする幅

センタリングする際のボックス幅は、`data-width`属性を用いて設定します。
属性値には `ブレイクポイント名:サイズ名` で指定します。

なお、値は半角スペース区切りで複数指定が可能です。

サイズ名は以下の表を参考にして指定してください。

| サイズ名 | 幅              |
| -------- | --------------- |
| `xsmall` | `70%`           |
| `small`  | `80%`           |
| `medium` | `90%`（初期値） |
| `large`  | `95%`           |
| `auto`   | `auto`          |

#### 全ての画面サイズでボックスの幅を `95%` にする例

```html
<div class="ol-container" data-width="min:large">...</div>
```

#### 1024px 以上の画面サイズでボックスの幅を `90%` にする例

```html
<div class="ol-container" data-width="lg:large">...</div>
```

#### 0px 以上の画面サイズでは `80%`、768px 以上の画面幅では、`90%`、1024px 以上の画面サイズでは `auto` にする例

```html
<div class="ol-container" data-width="min:small md:medium lg:large">...</div>
```

### data-max - センタリングする最大幅

センタリングする際のボックスの最大幅は、`data-max`属性を用いて設定します。
つまり、ここで指定した以上にボックスが大きくならいようにできます。

属性値には `ブレイクポイント名:サイズ名` で指定します。

なお、値は半角スペース区切りで複数指定が可能です。

サイズ名はデフォルトでは以下の数値になっています。

| サイズ名  | 最大幅             |
| --------- | ------------------ |
| `small`   | `640px`            |
| `medium`  | `768px`            |
| `large`   | `1024px`           |
| `xlarge`  | `1280px`（初期値） |
| `xxlarge` | `1440px`           |
| `none`    | `none`             |

#### 全ての画面サイズでボックスの最大幅を `1440px` にする例

```html
<div class="ol-container" data-max="min:xxlarge">...</div>
```

#### 1024px 以上の画面サイズでボックスの最大幅を `768px` にする例

```html
<div class="ol-container" data-width="min:small" data-max="lg:medium">...</div>
```

#### 0px 以上の画面サイズでは `640px`、768px 以上の画面幅では、最大幅をなし、1024px 以上の画面サイズでは `1440px` にする例

```html
<div class="ol-container" data-max="min:small md:none lg:xxlarge">...</div>
```

### カスタマイズ

ボックスの最大幅はカスタムプロパティを上書きすることで、カスタマイズが可能です。

| サイズ名  | カスタムプロパティ名     | 初期値  |
| --------- | ------------------------ | ------- |
| `small`   | `--ol-sm-content-width`  | `640px` |
| `medium`  | `--ol-md-content-width`  | `768px` |
| `large`   | `--ol-lg-content-width`  | `1024x` |
| `xlarge`  | `--ol-xl-content-width`  | `1280x` |
| `xxlarge` | `--ol-xxl-content-width` | `1440x` |

`data-max`属性を指定していない場合は、`xlarge` のサイズが自動的に`data-max`属性にセットされます。

#### カスタマイズ例

```css
:root {
  --ol-sm-content-width: 600;
  --ol-lg-content-width: 960;
}
```

### data-align - ボックスの位置

デフォルトでは、真ん中にボックスがセンタリングされますが、水平位置を指定することができます。

ボックスの位置は、`data-align`属性を用いて設定します。

属性値には `ブレイクポイント名:位置名` で指定します。

なお、値は半角スペース区切りで複数指定が可能です。

位置名はデフォルトでは以下の数値になっています。

| サイズ名 | 位置             |
| -------- | ---------------- |
| `left`   | 左               |
| `right`  | 右               |
| `center` | 　中央（初期値） |

#### 全てのデバイス幅でボックスを右によさせる例

```html
<div class="ol-container" data-align="min:right">...</div>
```

##### 画面サイズが 1024px 以上 のみセンタリングをする例

```html
<div class="ol-container" data-align="lg:center">...</div>
```

## Spacer

ボックス間の余白や、ボックス内の各要素間のギャップを指定する場合は、`ol-spacer` クラスを設定します。

```html
<div class="ol-spacer">...</div>
```

### margin によるスペース

マージンによるスペースには以下の属性が使えます。

| カスタムデータ属性 | 説明                 | 属性値                                                              |
| ------------------ | -------------------- | ------------------------------------------------------------------- |
| data-my            | 上下のマージンを調整 | `ブレイクポイント名:基準スペース量に対する倍率`<br>（最大倍率：30） |
| data-mt            | 上のマージンを調整   | `ブレイクポイント名:基準スペース量に対する倍率`<br>（最大倍率：30） |
| data-mb            | 下のマージンを調整   | `ブレイクポイント名:基準スペース量に対する倍率`<br>（最大倍率：30） |
| data-mx            | 左右のマージンを調整 | `ブレイクポイント名:基準スペース量に対する倍率`<br>（最大倍率：30） |
| data-ml            | 左のマージンを調整   | `ブレイクポイント名:基準スペース量に対する倍率`<br>（最大倍率：30） |
| data-mr            | 右のマージンを調整   | `ブレイクポイント名:基準スペース量に対する倍率`<br>（最大倍率：30） |

どの属性も、属性値は半角スペース区切りで複数指定可能です。

基準スペースは、初期設定で設定したスペース量のことで、デフォルトは `8`
となっています。

つまり、デフォルトの場合は、`8`に対する倍率を指定することが可能です。

例えば `data-my="min:2"` と指定した場合は、 `8` の 2 倍 である　`16px` のマージンが上下に設定されます。

### ブロック間の余白

ブロック間の上下の余白や左右の余白を指定する場合は `ol-spacer` クラスを設定します。
なお、余白量は以下のカスタムデータ属性を使って指定します。また、背景色を指定することもできます。

#### 全てのデバイスで上下に `small` サイズの余白をあける例

```html
<div class="ol-spacer" data-y="min:small">...</div>
```

#### スマホで上に `small` サイズ、PC で上に `large` サイズの余白をあける例

```html
<div class="ol-spacer" data-y="min:smallTop lg:largeTop">...</div>
```

#### スマホで上下に `small` サイズ、PC で上に `large` サイズの余白、下は余白なしにする例

```html
<div class="ol-spacer" data-y="min:small lg:largeTop lg:resetBottom">...</div>
```

#### ブロックの背景を `light` にする例

```html
<div class="ol-spacer" data-bg="light">...</div>
```

## Grid System

横並びのレイアウトに便利なグリッドシステムが使えます。
`display: grid` を活用したレイアウト手法です。

### Grid Container と Grid Item

グリッドシステムを利用するには Grid Container（ `ol-grid` ） と Grid Item（ `ol-grid__item` ） を用意する必要があります。
以下のようにマークアップすることで、Grid Item が横並びになります。

```html
<div class="ol-grid">
  <div class="ol-grid__item">A</div>
  <div class="ol-grid__item">B</div>
  <div class="ol-grid__item">C</div>
</div>
```

### 12 カラムグリッドシステム

12 カラムを基準としたグリッドシステムを利用するには、
Grid Item に `data-caols` 属性を使ってブレイクポイント名とグリッド数を指定します。

| カスタムデータ属性 | 説明             | 属性値                                                                  |
| ------------------ | ---------------- | ----------------------------------------------------------------------- |
| data-col           | グリッド数の指定 | `ブレイクポイント名:グリッド数`<br>（半角スペース区切りで複数指定可能） |

グリッド数は、例えばどの画面幅でもピッタリ半分半分の 2 段組みにしたかったら、12 分割のグリッドシステムなので、1 段につき 6 グリッド（列）ずつ使えばちょうど半分になるわけです。（12 分割 ÷ 2 段 = 6 グリッド）

つまり `data-col` 属性に `min:6` と指定すると、どのデバイスでも 2 つのボックスをちょうど半分ずつにわけることができます。

このように１行の合計が 12 グリッドになるように調整するように、グリッド数を指定すれば OK です。

なので、3 段組みにしたければ、`min:4` を 3 つ並べればいいですし、4 段組みにしたければ、`min:3` を 4 つ並べれば OK です。`min:8` と `min:4` などの組み合わせで 12 グリッドを使っても大丈夫です。

あとは各デバイス（ブレークポイント）ごとで必要なグリッド数（列数）が異なる場合は、各ブレークポイントごとのブレイクポイント名とグリッド数（列数）を半角スペース区切りで指定すれば自由にレイアウト可能です。

```html
<div class="ol-grid">
  <div class="ol-grid__item" data-col="min:12 md:4 lg:6">A</div>
  <div class="ol-grid__item" data-col="min:6 md:4 lg:3">B</div>
  <div class="ol-grid__item" data-col="min:6 md:4 lg:3">C</div>
</div>
```

### ギャップ

Grid Item Grid Container に `data-gap` 属性を使ってブレイクポイント名とスペース量のサイズを指定する。

| カスタムデータ属性 | 説明             | 属性値                                                                      |
| ------------------ | ---------------- | --------------------------------------------------------------------------- |
| data-gap           | グリッド間の余白 | `ブレイクポイント名:スペースサイズ`<br>（半角スペース区切りで複数指定可能） |

```html
<div class="ol-grid" data-gap="min:small md:medium lg:large">
  <div class="ol-grid__item" data-col="min:12 md:4 lg:6">A</div>
  <div class="ol-grid__item" data-col="min:6 md:4 lg:3">B</div>
  <div class="ol-grid__item" data-col="min:6 md:4 lg:3">C</div>
</div>
```

### 位置揃え

#### Grid Container の位置揃え

Grid Item 全体の位置揃えをするには、Grid Container に data-align 属性を使って揃える位置を表すキーワードを指定する。
なお、水平方向と垂直方向を同時に指定する場合は、半角スペースで区切る。

| カスタムデータ属性 | 説明 | 属性値                                                                                                                                                                                                                                                                                                                                                                |
| ------------------ | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data-align         | 位置 | `ブレイクポイント名:start` ・・・ 左揃え<br> `ブレイクポイント名:center` ・・・ 中央揃え<br> `ブレイクポイント名:end` ・・・ 右揃え<br>`ブレイクポイント名:justify` ・・・ 両端揃え<br>`ブレイクポイント名:top` ・・・ 上揃え<br>`ブレイクポイント名:middle` ・・・ 中央揃え<br>`ブレイクポイント名:bottom` ・・・ 下揃え<br><br>（半角スペース区切りで複数指定可能） |

```html
<div class="ol-grid" data-gap="min:small md:medium lg:large" data-align="xxs:center">
  <div class="ol-grid__item">A</div>
  <div class="ol-grid__item">B</div>
  <div class="ol-grid__item">C</div>
</div>
```

#### Grid Item の位置揃え

Grid Item に個別で位置を指定することもできます。

| カスタムデータ属性 | 説明 | 属性値                                                                                                                                                                                                                                                                                                                |
| ------------------ | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data-align         | 位置 | `ブレイクポイント名:start` ・・・ 左揃え<br> `ブレイクポイント名:center` ・・・ 中央揃え<br> `ブレイクポイント名:end` ・・・ 右揃え<br>`ブレイクポイント名:top` ・・・ 上揃え<br>`ブレイクポイント名:middle` ・・・ 中央揃え<br>`ブレイクポイント名:bottom` ・・・ 下揃え<br><br>（半角スペース区切りで複数指定可能） |

```html
<div class="ol-grid" data-gap="min:small md:medium lg:large">
  <div class="ol-grid__item">A</div>
  <div class="ol-grid__item" data-align="xxs:right xxs:middle">B</div>
  <div class="ol-grid__item">C</div>
</div>
```
