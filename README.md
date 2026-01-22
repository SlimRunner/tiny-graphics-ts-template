# tiny-graphics.js

This project adds type declarations for the modules in tiny graphics. Here is the link to the original project:
- https://github.com/encyclopedia-of-code/tiny-graphics-js

This project is intended to generate near native JS code from type-safe TS. First install the node
```sh
npm install
```

Then run
```sh
npm run dev
```

## Usage

Make sure you import using `.js` at the end because this project does not use a bundler, so it will not translate `import { tiny } from "../tiny-graphics";` to `import { tiny } from "../tiny-graphics.js";` for you. This also include pure TS libraries you may add. That is use `.js` instead of `.ts`. Correct address are resolved simply because `src` and `my_code` both share the same relative position to the root. Hence the "enforced" structure is
```
📁 root
├─🔹 ... other files/directories
├─📁 my_code
│ └─🔹 mirrors src structure and *.ts -> *.js
└─📁 src
  ├─📁 ... however folders you want to add
  └─📄 *.ts
```

Other than that code as you would normally, and use the types as guide.

## About tiny-graphics.js

The tiny-graphics.js software library by Garett Ridge has accompanied UCLA Computer Science's 174a course (Intro to Computer Graphics) since 2016.  In Spring 2019, the course used all-new assignments based on tiny-graphics-js.  The library served as a framework for giving students a high-level tour of computer graphics concepts.  You can view the assignments from Spring 2019 at the link below, including their instructions/specification documents, starting code, and animated results:

https://github.com/encyclopedia-of-code/tiny-graphics-assignments

This code library accompanies and supports a web project by the same author called "The Encyclopedia of Code", a crowd-sourced repository of WebGL demos and educational tutorials that uses an online editor.