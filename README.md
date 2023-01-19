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
| lg                 | 小さなノート PC など               | `992px` ~  |
| xl                 | 小さなデスクトップ PC など         | `1200px` ~ |
| xxl                | 大きなモニターなど                 | `1480px` ~ |

## インストール

`head` 要素内に `olayout.min.css` をリンクするだけでインストールは完了です。

```html
<link rel="stylesheet" href="olayout.min.css" />
```

## 初期設定

自身で用意した CSS のカスタムプロパティを使って、デザインカンプで使われているコンテンツ幅、余白、配色、書体などを設定できます。
以下のカスタムプロパティを上書きすることが可能です。（変更する可能性あり）

| カスタムプロパティ名  | 説明                                       | 初期値       |
| --------------------- | ------------------------------------------ | ------------ |
| --ol-content-width    | コンテンツ幅                               | `1280`       |
| --ol-space-min        | 最小の余白量                               | `8`          |
| --ol-space-xxsmall    | xxsmall サイズの余白量                     | `16`         |
| --ol-space-xsmall     | xsmall サイズの余白量                      | `24`         |
| --ol-space-small      | small サイズの余白量                       | `40`         |
| --ol-space-medium     | medium サイズの余白量                      | `64`         |
| --ol-space-large      | large サイズの余白量                       | `88`         |
| --ol-space-xlarge     | xlarge サイズの余白量                      | `96`         |
| --ol-space-xxlarge    | xxlarge サイズの余白量                     | `112`        |
| --ol-space-max        | 最大の余白量                               | `120`        |
| --ol-base-color       | ベースカラー（削除するかも）               | `#fff`       |
| --ol-main-color       | メインカラー（削除するかも）               | `#116ec5`    |
| --ol-accent-color     | アクセントカラー（削除するかも）           | `#e4d558`    |
| --ol-light-color      | 明るい背景用カラー（削除するかも）         | `#efefef`    |
| --ol-dark-color       | 暗い背景用カラー（削除するかも）           | `#101010`    |
| --ol-primary-font-set | 日本語用フォントファミリー（削除するかも） | `sans-serif` |
| --ol-en-font-set      | 欧文用フォントファミリー（削除するかも）   | `sans-serif` |

これらをカスタムプロパティを必要に応じて自身のスタイルシートの中で上書きすることができます。
（px は不要です）

```css
:root {
  /* コンテンツ幅 */
  --ol-content-width: 1200;

  /* スペース量 */
  --ol-space-large: 80;
  --ol-space-max: 160;

  /* 色 */
  --ol-main-color: #116ec5;

  /* 書体 */
  --ol-primary-font-set: "Noto Sans JP", "游ゴシック", "Yu Gothic", "游ゴシック体", "YuGothic", sans-serif;
  --en-primary-font-set: "Inter", sans-serif;
}
```

## Reset

ブラウザのデフォルトスタイルの CSS が入っています。
基本的には俺流の Reset CSS である「[OresetCSS](https://github.com/hilosiva/oreset.css)」がベースになっています。

- 全ての要素は box-sizing: border-box をデフォルトで継承する
- 不必要な margin 、 padding、 border を排除
- 文字サイズのリセットは行わない
- font-feature-settings による文字詰め
- line-height は 1.5 　をデフォルトにする
- html 要素に scroll-behavior: smooth を指定
- アクセシビリティに考慮

## Container & Spacer

### センタリング

ボックスのセンタリングやブロック間の余白などを調整できます。

ボックスをコンテンツ幅でセンタリングする場合 `ol-container` クラスを設定します。

なお、デバイス幅によってコンテンツ幅のセンタリングを有効・無効を切り分けたい時は以下のカスタムデータ属性を使って、デバイス幅ごとに有効と無効を切り分けれます。

| カスタムデータ属性 | 説明                               | 属性値                                                       |
| ------------------ | ---------------------------------- | ------------------------------------------------------------ |
| data-enabled       | センタリングを有効にするデバイス幅 | `ブレイクポイント名`<br>（半角スペース区切りで複数指定可能） |
| data-disabled      | センタリングを無効にするデバイス幅 | `ブレイクポイント名`<br>（半角スペース区切りで複数指定可能） |

#### 全てのデバイス幅でセンタリングをする例

```html
<div class="ol-container">...</div>
```

##### PC のみセンタリングをする例

```html
<div class="ol-container" data-enabled="lg">...</div>
```

##### スマホのみセンタリングをする例

```html
<div class="ol-container" data-disabled="md">...</div>
```

##### スマホと PC でセンタリングをする例（タブレットのみ無効）

```html
<div class="ol-container" data-enabled="min lg" data-disabled="md">...</div>
```

### ブロック間の余白

ブロック間の上下の余白や左右の余白を指定する場合は `ol-spacer` クラスを設定します。
なお、余白量は以下のカスタムデータ属性を使って指定します。また、背景色を指定することもできます。

| カスタムデータ属性 | 説明                       | 属性値                                                                                                                                                                                                                                                                                                                                                          |
| ------------------ | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data-x             | ブロックの左右の余白を調整 | 左右: `ブレイクポイント名:スペースサイズ名`<br>左のみ: `ブレイクポイント名:スペースサイズ名Left`<br>右のみ: `ブレイクポイント名:スペースサイズ名Right`<br>左右の余白をリセット: `ブレイクポイント名:reset`<br>左の余白をリセット: `ブレイクポイント名:resetLeft`<br>右の余白をリセット: `ブレイクポイント名:resetRight`<br>（半角スペース区切りで複数指定可能） |
| data-y             | ブロックの上下の余白を調整 | 上下: `ブレイクポイント名:スペースサイズ名`<br>上のみ: `ブレイクポイント名:スペースサイズ名Top`<br>下のみ: `ブレイクポイント名:スペースサイズ名Bottom`<br>上下の余白をリセット: `ブレイクポイント名:reset`<br>上の余白をリセット: `ブレイクポイント名:resetTop`<br>下の余白をリセット: `ブレイクポイント名:resetBottom`<br>（半角スペース区切りで複数指定可能） |
| data-bg            | ブロックの背景色           | `base`, `main`, `accent`, `light`, `dark` のいずれか                                                                                                                                                                                                                                                                                                            |

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
基本的には俺流のフレキシブルレイアウト CSS である「[OlexCSS](https://github.com/hilosiva/Olexcss)」がベースになっています。

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
| data-cols          | グリッド数の指定 | `ブレイクポイント名:グリッド数`<br>（半角スペース区切りで複数指定可能） |

グリッド数は、例えばどの画面幅でもピッタリ半分半分の 2 段組みにしたかったら、12 分割のグリッドシステムなので、1 段につき 6 グリッド（列）ずつ使えばちょうど半分になるわけです。（12 分割 ÷ 2 段 = 6 グリッド）

つまり `data-cols` 属性に `min:6` と指定すると、どのデバイスでも 2 つのボックスをちょうど半分ずつにわけることができます。

このように１行の合計が 12 グリッドになるように調整するように、グリッド数を指定すれば OK です。

なので、3 段組みにしたければ、`min:4` を 3 つ並べればいいですし、4 段組みにしたければ、`min:3` を 4 つ並べれば OK です。`min:8` と `min:4` などの組み合わせで 12 グリッドを使っても大丈夫です。

あとは各デバイス（ブレークポイント）ごとで必要なグリッド数（列数）が異なる場合は、各ブレークポイントごとのブレイクポイント名とグリッド数（列数）を半角スペース区切りで指定すれば自由にレイアウト可能です。

```html
<div class="ol-grid">
  <div class="ol-grid__item" data-cols="min:12 md:4 lg:6">A</div>
  <div class="ol-grid__item" data-cols="min:6 md:4 lg:3">B</div>
  <div class="ol-grid__item" data-cols="min:6 md:4 lg:3">C</div>
</div>
```

### ガーター

Grid Item Grid Container に `data-gutter` 属性を使ってブレイクポイント名とスペース量のサイズを指定する。

| カスタムデータ属性 | 説明             | 属性値                                                                      |
| ------------------ | ---------------- | --------------------------------------------------------------------------- |
| data-gutter        | グリッド間の余白 | `ブレイクポイント名:スペースサイズ`<br>（半角スペース区切りで複数指定可能） |

```html
<div class="ol-grid" data-gutter="min:small md:medium lg:large">
  <div class="ol-grid__item" data-cols="min:12 md:4 lg:6">A</div>
  <div class="ol-grid__item" data-cols="min:6 md:4 lg:3">B</div>
  <div class="ol-grid__item" data-cols="min:6 md:4 lg:3">C</div>
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
<div class="ol-grid" data-gutter="min:small md:medium lg:large" data-align="xxs:center">
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
<div class="ol-grid" data-gutter="min:small md:medium lg:large">
  <div class="ol-grid__item">A</div>
  <div class="ol-grid__item" data-align="xxs:right xxs:middle">B</div>
  <div class="ol-grid__item">C</div>
</div>
```
