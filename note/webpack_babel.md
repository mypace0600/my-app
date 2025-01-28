## Webpack and Babel

---

### 1. **Webpack**

#### 역할:

- **모듈 번들러(Module Bundler)**: 여러 파일(JavaScript, CSS, 이미지 등)을 하나 또는 여러 개의 파일로 묶어주는(bundle) 도구입니다.
- **의존성 관리**: 프로젝트의 모든 모듈(라이브러리, 컴포넌트 등) 간의 의존성을 분석하고, 최적화된 형태로 묶어줍니다.

#### 주요 기능:

- **Entry**: 애플리케이션의 시작점(진입점)을 지정합니다. (예: `index.js`)
- **Output**: 번들링된 파일을 저장할 경로와 파일 이름을 지정합니다. (예: `dist/bundle.js`)
- **Loaders**: JavaScript 외의 파일(예: CSS, 이미지, 폰트)을 처리할 수 있도록 도와줍니다.
  - 예: `babel-loader`는 JavaScript 파일을 트랜스파일링합니다.
- **Plugins**: 번들링 과정에서 추가적인 작업을 수행합니다.
  - 예: `HtmlWebpackPlugin`은 HTML 파일을 자동으로 생성하고 번들 파일을 연결합니다.
- **Mode**: 개발(`development`) 또는 프로덕션(`production`) 모드를 설정할 수 있습니다.

#### 간단한 예시:

```javascript
// webpack.config.js
const path = require("path");

module.exports = {
  entry: "./src/index.js", // 진입점
  output: {
    path: path.resolve(__dirname, "dist"), // 출력 경로
    filename: "bundle.js", // 출력 파일 이름
  },
  module: {
    rules: [
      {
        test: /\.js$/, // .js 파일에 대해
        exclude: /node_modules/, // node_modules 제외
        use: "babel-loader", // babel-loader 사용
      },
    ],
  },
  plugins: [], // 플러그인 설정
  mode: "development", // 모드 설정
};
```

---

### 2. **Babel**

#### 역할:

- **JavaScript 트랜스파일러(Transpiler)**: 최신 JavaScript 문법(ES6+, JSX 등)을 구형 브라우저에서도 동작할 수 있는 호환 가능한 코드로 변환합니다.
- **크로스 브라우징 지원**: 최신 문법을 사용하면서도, 모든 브라우저에서 동작하는 코드를 생성할 수 있습니다.

#### 주요 기능:

- **Presets**: 미리 정의된 설정을 사용하여 특정 JavaScript 버전(예: ES6, React)을 지원합니다.
  - 예: `@babel/preset-env`는 최신 JavaScript 문법을 변환합니다.
  - 예: `@babel/preset-react`는 JSX 문법을 변환합니다.
- **Plugins**: 특정 문법이나 기능을 변환하기 위한 추가 도구입니다.
  - 예: `@babel/plugin-transform-arrow-functions`는 화살표 함수를 일반 함수로 변환합니다.

#### 간단한 예시:

```javascript
// babel.config.json
{
  "presets": [
    "@babel/preset-env", // 최신 JavaScript 문법 변환
    "@babel/preset-react" // JSX 문법 변환
  ],
  "plugins": [] // 추가 플러그인
}
```

---

### Webpack과 Babel의 관계

- **Webpack**은 모듈 번들러로, 프로젝트의 모든 파일을 하나로 묶는 역할을 합니다.
- **Babel**은 JavaScript 파일을 트랜스파일링하여 최신 문법을 구형 브라우저에서도 동작할 수 있도록 변환합니다.
- Webpack은 Babel을 로더(`babel-loader`)로 사용하여 JavaScript 파일을 처리합니다.

---

### 요약

- **Webpack**:
  - 모듈 번들러.
  - 여러 파일을 하나로 묶고, 의존성을 관리.
  - 로더와 플러그인을 통해 다양한 파일 처리.
- **Babel**:
  - JavaScript 트랜스파일러.
  - 최신 JavaScript 문법을 구형 브라우저에서 동작하는 코드로 변환.
  - 프리셋과 플러그인을 통해 특정 문법 지원.

---

### 함께 사용하는 이유

- **Webpack**은 프로젝트의 모든 파일을 번들링하고, **Babel**은 JavaScript 파일을 트랜스파일링하여 브라우저 호환성을 확보합니다.
- 이 두 도구를 함께 사용하면, 최신 문법과 모듈 시스템을 사용하면서도 모든 브라우저에서 동작하는 웹 애플리케이션을 개발할 수 있습니다. 😊
