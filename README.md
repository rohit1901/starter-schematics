# Setting up Schematics and creating new schematics

This repository is a Schematic implementation that serves as a starting point to create new angular applications.

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
npm run build
npm publish
```
Go to angular project and link the schematic

```bash
npm link <path-to-schematics-folder>
schematics ./node_modules/@bafa/starter-schematics:<schematic-name> --dryRun=false
```

### Publishing

To publish, run thew following commands:

```bash
npm run build
npm publish
```

### Running in project
- The production build needs to be hosted to verdaccio or a npm hosting server.
- Update the project ``.npmrc`` file and include the npm registry path where the schematics have been published
- Navigate to project folder and execute the following command
```bash
schematics @bafa/starter-schematics:<schematic-name> --dryRun=false

```