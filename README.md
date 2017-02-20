# Dependencies

- node.js ([install latest version via package manager](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions))
- pm2 (`sudo npm install pm2 -g`)


# File Structure

  **`/models/`** : Each data object (a user, a session, etc) gets its own js file here
  **`/node_modules/`** : Not present when you first download the repo. You will need to run `npm install`, after which point this directory will include all modules that are defined in `package.json`.
    - *NOTE: `/node_modules/` is deliberately ignored by `.gitignore`. It is expected every user of the repo will run `npm install` to retrieve the informatino themselves to keep the size of the repository to a minimum.*
  **`/routes/`** : One file per main route. As withj users, often models have their own routes file
  **`/utils/`** : general utilities, such as various middleware
  **`.env_EXAMPLE`** : an example version of the .env file you will need to manage yourself
  **`.env`** : Used to store environment variables unique to this installation. The file is deliberately ignored from the git repository so you need to create one yourself (just make a of `.env_EXAMPLE` and rename it to `.env`). The `.env` file is loaded by the node module `dotenv` which appends all data to the `process.env` object in node.
  **`.gitignore`** : any file that can be generated, or is dangerous to keep in a repository (such as database passwords) should be ignored in here. By default it already ignores `/node_modules/` and `.env`.
  **`app.js`** : the entry point into our app. it is the argument given to node when it is run (either manually or via pm2).
  **`package.json`** : describes the metadata of our node project, most importantly the dependencies that it uses.
  **`process.json`** : a configuration file for pm2. use it to set automatically set if watching should be enabled, where logs should be stored, etc. To use pm2 with its config file simpy use `pm2 start process.json`.


# To Install

- Copy `.env_EXAMPLE` to a new file named `.env`
  ````
  cp .env_EXAMPLE .env
  ````
- Edit `.env` to include whatever configs your app needs
  - They will show up as new properties on the `process.env` object.
  - The `.env` file is gitignored to prevent passwords from being stored in your repo.
- Install Modules: `npm install`


# Run Standalone



# Run with PM2
