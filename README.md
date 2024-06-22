# muwum-eslint-config

This package provides a shared ESLint configuration for Muwum's personal projects.

## Installation

```bash
npm install --save-dev https://github.com/MuwuM/muwum-eslint-config
```

## Usage

Add it to your `eslint.config.mjs`.

### electron + vue + typescript

```javascript
import muwum from 'muwum-eslint-config';

export default [
  muwum.electron.vue.ts,
  // other configurations
];
```
