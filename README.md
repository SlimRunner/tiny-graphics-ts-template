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

Make sure that you **import only using relative paths for all files w/o extension** that includes within and outside the `src` directory. The reason for this is that this project does not use a bundler to preserve the directory structure, so it relies on a script to parse the paths and add the `.js` extension. Correct address are resolved simply because `src` and `my_code` both share the same relative position to the root. Hence the "enforced" structure is
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

## List of Modified Files
This is the list of files you need to copy if you want to implement TS into your project
```
./.gitignore
./examples/common-components.d.ts
./examples/common-shaders.d.ts
./examples/common-shapes.d.ts
./examples/common.d.ts
./host.sh
./jest.config.js
./nodemon.json
./package.json
./resolve-imports.js
./tests
./tiny-graphics-gui.d.ts
./tiny-graphics-math.d.ts
./tiny-graphics.d.ts
./tsconfig.json
```

Alternatively, you might want to ensure these files match as well since it is the version the declaration files are based on
```
./examples/common-components.js
./examples/common-shaders.js
./examples/common-shapes.js
./examples/common.js
./tiny-graphics-gui.js
./tiny-graphics-math.js
./tiny-graphics.js
```

## About tiny-graphics.js

The tiny-graphics.js software library by Garett Ridge has accompanied UCLA Computer Science's 174a course (Intro to Computer Graphics) since 2016.  In Spring 2019, the course used all-new assignments based on tiny-graphics-js.  The library served as a framework for giving students a high-level tour of computer graphics concepts.  You can view the assignments from Spring 2019 at the link below, including their instructions/specification documents, starting code, and animated results:

https://github.com/encyclopedia-of-code/tiny-graphics-assignments

This code library accompanies and supports a web project by the same author called "The Encyclopedia of Code", a crowd-sourced repository of WebGL demos and educational tutorials that uses an online editor.