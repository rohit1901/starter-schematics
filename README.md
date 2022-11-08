# Setting up Schematics and creating new schematics

This repository is a Schematic implementation that serves as a starting point to create new angular applications.
The schematic creates an empty angular project, copies assets, updates app.component.html, app.module.ts and adds dependencies

## Preperation

(Needs to be verified, if realy all of them are needed but for the first time use them)
If you dont allreaddy have installed:

```bash
npm install -g @angular/cli
npm install -g @angular-devkit/core
npm install -g @angular-devkit/schematics
npm install -g @angular-devkit/schematics-cli
npm install -g @schematics/angular
```

### Testing

To test locally, install `@angular-devkit/schematics-cli` globally and use the `schematics` command line tool. The tool acts the same as the `generate` command of the Angular CLI, but also has a debug mode.

Schematics CLI help
```bash
schematics --help
```

### Unit Testing

`npm run test` will run the unit tests, using Jasmine as a runner and test framework.

### Running locally

```bash
npm install
npm run build
npm publish
```
Go to angular project and link the schematic

```bash
npm link <path-to-schematics-folder>
schematics ./node_modules/@bafa/starter-schematics:<schematic-name> --dry-run=false
```

### Publishing on a (local) Verdaccio

- Install Verdaccio:

```bash
npm install -g verdaccio
```
- Start your local Verdaccio in its own terminal:

```bash
verdaccio
```

- For publishing you need an NPM account. Create one if you dont have an account. Even for locally deployment its needed.
- Open a new terminal in the schematics project location and run thew following commands:

```bash
npm install
npm run build
```
- Create a ``.npmrc`` file in the root of this project folder and include Verdaccio as your default registry. Include in this file: `registry=http://localhost:4873/`
- Run in the schematics project location following commands:

```bash
npm login
npm publish
```

### Running the Schematics in a new target project
- Navigate to a folder where the new project needs to be generated
- Create a ``.npmrc`` file in the root of this project folder and include Verdaccio as your default registry. Include in this file: `registry=http://localhost:4873/`
- To run the Schematics execute the following commands:
```bash
npm install -g @bafa/starter-schematics
schematics @bafa/starter-schematics:bafa-initializer --dry-run=false
```