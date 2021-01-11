Now that we've learned both our backend Express and our frontend React frameworks, we will be combining the two into one compound application which we call a "monolith" application!

The goal of this article is to familiarize you with the folder structure and configuration in the Express/React apps we will normally be using for our final web applications. While we won't cover every file in our standard Express/React app, we will cover the essentials for working in these codebases.

### Getting Started

```no-highlight
et get express-objection-react-monolith
cd express-objection-react-monolith
createdb express-objection-react-monolith_development

yarn install
yarn run dev

cd client
code .

cd ../server
code .
```

As you see above, we also recommend that from here on, you open separate VSCode windows for the client and server folders. This practice will help you metacognitively by depicting the client and server as separate applications, which is exactly what they are! You'll notice that they have different configurations, linting settings, etc., and interact with each other via the HTTP request/response cycle. They just happen to both be housed in one parent repository!

Yes, you heard that right -- the idea of a "monolith" application is that we're taking one backend application (in a "server" folder), and one frontend application (in a "client" folder), and bringing them together into one large web application. They are two parts of a whole -- but they're still two distinct parts, and everything we've learned so far regarding Express and React will continue to apply in our monolith applications.

You have seen this structure before -- it popped up in previous React lessons that needed to have a backend provided -- but now, let's really dive into the organization of it.

### The Monolith

A "Monolith" application is a single-tiered software app in which different components (such as a frontend and backend) come together in one full-stack web app. This usually means an app in which the database, backend web server and frontend presentational layer are all housed and run from one single top-level "parent" app. The apps that we will be building are monoliths insofar as they have a PostgreSQL database, a Node/Express backend server, and a React frontend for the UI. Let's explore the structure of an example monolith app (which we will refer to as "Express/React" apps for simplicity) so that we are fully capable of navigating and developing within Express/React apps.

Here are the core technologies we will want to pay attention to:

* **Node**: the backend environment we run our JavaScript in when it is not being run in the browser. In this case, our Express app runs JavaScript code in the Node environment.
* **Express**: The lightweight web application framework that handles the incoming HTTP requests and a significant amount of business logic.
* **PostgreSQL**: The database software, which our Express app will communicate with via SQL queries. Technically not housed in our monolith app, but instead on our local machine.
* **Knex/Objection**: An ORM (Object Relational Mapping) library that helps our Express app create a schema in our PostgreSQL database with ease, and execute queries against the database to create, read, update and delete data from it.
* **React**: Our frontend JavaScript framework. React generates what the user sees on the screen, and helps to make our web apps interactive and quick to load.

### The Root of the App

Examine the folder structure below. This folder structure will be standard for the majority of the web applications we build with the Express/React monolith.

![Image of folder structure with client and server folder and root files](https://horizon-production.s3.amazonaws.com/images/article/express-objection-react-monolith/monolith1.png)

Usually, our `package.json` files are a manifest for the rest of our project: designating what scripts we can run (e.g. `yarn run dev`) and storing all names of installed packages needed to run the project (e.g. `express` or `react`). In this app, the `package.json` found at the root is merely a module whose scripts can build the apps designated in `server` or `client`. We'll come back to this file.

Other items found at the root of our app include the following. Note: while being familiar with these files is best practice, we will generally create and configure these files for you and you will not have to worry too much about _how_ they're doing what they're doing.

* **Procfile**: A file only necessary for _production_, which includes instructions on how to run when deployed to the web
* **yarn.lock**: An auto-generated file when we run `yarn install` that lists all of the versions of the installed packages we have
* **.prettierrc**: A ruleset for how the `prettier` extension can help style our files in VSCode
* **.eslintrc.cjs**: A file that designates how the VSCode **ESLint** should run. ESLint analyzes the code you write to make suggestions on how to correct problems or style issues in your code
* **.gitignore**: A file that tells the version control tool **Git** what to not track (or ignore) when listening to files in our codebase. We want to ignore folders like `node_modules`, whose contents are immense and unnecessary to commit, so as to avoid issues with tracking and uploading our codebase to GitHub

The **server** and **client** folders are where our frontend and backend apps reside, respectively.

### Server Folder for Express with Objection/Knex

![Image of folder structure for server directory](https://horizon-production.s3.amazonaws.com/images/article/express-objection-react-monolith/monolith2.png)

As you may already be aware, the `server` folder houses our Node/Express app. There is another `package.json` file here that designates the packages necessary only for our Express app, and the scripts we can run from our command line (including commands for running the web server, generating Knex migrations, and running a console that has access to our Objection models and database - we'll learn more about databases in the coming weeks!).

The key folders we will be developing in are `src` and `views`. Our `views` folder holds any Handlebars templates we might manage, while `src` houses the majority of our backend JavaScript code, including the root of Express app's configuration in `app.js`. `app.js` loads Express, Objection, Knex and many other dependencies together needed to boot up our server. As long as we can run this file, the rest of our app will be largely pre-configured.

`yarn run dev` will run our `app.js`, booting up an Express web server that has the ability to also communicate with our PostgreSQL database.

Note: you will also see the `migrate:latest`, `migrate:rollback` and `migrate:make` scripts for running Knex migrations, reversing Knex migrations and generating Knex migrations, respectively. Any of these scripts can be run with `yarn run <knex-command>`, and you can learn more about them from our lesson on Knex.

Unless we wish to run commands specific to our backend, such as our Knex scripts, or add packages into our `server` app specifically, we actually won't be booting up our Express server from this folder. Instead, we should be booting our app from the root's `package.json`.

```js
// package.json (root)
  "scripts": {
    // ...
    "dev": "yarn workspace express-objection-react-monolith-server dev",
    // ...
  }
```

Running `yarn run dev` from the root of our app will tell our app to look for a "workspace" called `express-objection-react-monolith-server`, and run the `yarn run dev` script found there. Yarn workspaces are pretty cool - they're able to neatly account for the fact that we may have multiple sub-apps within one monolith app! If you look at the `package.json` file _in our `server` folder_ closely, it contains a `name` attribute that matches this workspace name. So our root identifies the `server/package.json` file as the one we want, and runs `yarn run dev` from that file.

For any scripts that _don't_ have a reference in the _root_ `package.json`, we will need to navigate into the `server` directory before running `yarn run <scriptName>`.

Note: when booting up our server, we've configured the app with `webpack-dev-middleware` to also ensure that your React assets are being generated as you update your code. `yarn run dev` does so much! **No additional configuration is needed in order for your fetch requests to hit your backend, beyond ensuring you are setting up your API endpoints appropriately, and using the right paths in your fetch request**. Keep in mind that our host hasn't changes: you should continue to navigate to <http://localhost:3000> when your app is running.

### Client Folder for React

![Image of folder structure for client directory](https://horizon-production.s3.amazonaws.com/images/article/express-objection-react-monolith/monolith-3.png)

Our client folder also has a `package.json` (the last of the three) which holds all dependencies required for our React app. This folder is also configured with `webpack-dev-server`, which, in addition to many other roles, makes our React code available when we navigate to any paths set up with React (more on this further down). Going to these paths in our development environment will return the `index.html` file in `client/public/index.html` that has a `div` with an id of `app`. This `index.html` also has a reference to `bundle.js` which has all of our React code in one file (after its been compiled). Thanks to `webpack-dev-server` and something called hot module replacement, this `bundle.js` will get updated whenever we make a change in our React app. Finally, when running our React app, the first file to be used is the `client/src/main.js`, which uses the `ReactDom`'s `render` method to render our top level component `App` to the screen. This setup is similar to the simpler React apps you've seen thus far.

```js
import React from "react"
import { render } from "react-dom"

import App from "./components/App"
import config from "./config"
import RedBox from "redbox-react"

document.addEventListener("DOMContentLoaded", () => {
  let reactElement = document.getElementById("app")

  if (reactElement) {
    if (config.env === "development") {
      try {
        render(<App />, reactElement)
      } catch (e) {
        render(<RedBox error={e} />, reactElement)
      }
    } else {
      render(<App />, reactElement)
    }
  }
})
```

This `main.js` has been built out a bit because we've added the `Redbox` library to ensure that errors are shown on the webpage instead of in our web console, for ease of debugging.

Running `yarn run dev` from the `client` folder can boot up `webpack-dev-server` alone, separate from our Express app, to serve up our React app -- but then we wouldn't have access to our backend API endpoints! This is where the addition of a webpack middleware to our Express app is so dang helpful. We will only have to run that one `yarn run dev` command from our root, and Express and React will boot up all in one fell swoop.

The last thing to mention is that we have configured `react-hot-loader` in your App.js file, to ensure that you do not need to refresh the page to get the most updated version of your React app. It even preserves state!

```js
import React from "react"
import { hot } from "react-hot-loader/root"

import "../assets/scss/main.scss"

const App = props => {
  return <h1>Hello from React</h1>
}

export default hot(App)
```

Your top-most component will need to have the import from `react-hot-loader` and the line `export default hot(App)` in order to work correctly. This is set up for you, but if you're ever changing your top-level component, you will want to keep this in mind!

### Ensuring the Database Layer is Configured

One last thing to ensure is configured: that our Express app is properly pointed at the correct database URL on our machine. At the start of this article that you were instructed to run the `createdb express-objection-react-monolith_development` command, which created a database of that name. How is that database name referenced in our Express/Objection/Knex configuration?

Examine the `server/src/config/getDatabaseUrl.cjs` file.

```js
// server/src/config/getDatabaseUrl.cjs

const getDatabaseUrl = (nodeEnv) => {
  return (
    {
      development: "postgres://postgres:postgres@localhost:5432/express-objection-react-monolith_development",
      test: "postgres://postgres:postgres@localhost:5432/express-objection-react-monolith_test",
    }[nodeEnv] || process.env.DATABASE_URL
  )
}

module.exports = getDatabaseUrl
```

This file will return a url that our Knex/Objection configuration will use. Observe the URL `development: "postgres://postgres:postgres@localhost:5432/express-objection-react-monolith_development"`. This line designates what database will be used with your app, and assumes that we have created a PostgreSQL database of the name `express-objection-react-monolith_development`, as noted by the path at the end of this URL. If we changed this line to `"postgres://postgres:postgres@localhost:5432/bananas"`, then we would need to have created a database called `bananas` with the `createdb` command before running this app (e.g. `createdb bananas`). Always refer to this file to ensure you are connecting to the right database, and update either the name of your database via the command line, or the path in this URL, to connect appropriately. Note: our apps will generally have this pre-configured for you, with setup commands for each assignment, but if you are developing apps independently, you will need to manage this yourself.

##### Boot Up the Server and Client Sub-Apps

Let's actually see this stuff in action! From the root of the project folder, run:

```no-highlight
yarn run dev
```

Now, navigate to <http://localhost:3000/client>, and you should see "Hello from React" on the screen! We can also go to <http://localhost:3000/name> and see the same thing.

However, if we try to go to <http://localhost:3000> instead...we see an error, "Cannot GET /". What is all this about?!

### Routing in our Monolith App

As we know from our knowledge of HTTP, the combination of an HTTP _verb_ and a _path_ creates a _route_. In our apps thus far, we've handled routing in our application two different ways: through Express Routers, and using React Router. Now, it's time to figure out how to allow both to handle their own list of routes! 

One thing our monolith app will need to know very clearly is whether a specific route should be managed by Express or by React. In our applications, we're going to want routes that are handled by React (any of our pages that we want to be rendered using React), and other routes that are handled by Express (our API endpoints). We need a way to tell our application which are which. 

When we went to the `/client` path above, React knew to load up and do its thing via our `App` component. Same with the `/name` route: the app recognized that this was another React-managed app, and loaded our `App` component. But it didn't recognize the root path `/` as a React-managed path. So how did it know?

The answer lies in our `rootRouter` and `clientRouter` files. If we take a look at `server/src/routes/rootRouter.js`, we'll see the below code:

```javascript
// server/src/routes/rootRouter.js

import express from "express"
import clientRouter from "./clientRouter.js"

const rootRouter = new express.Router() 

//place your server-side routes here

rootRouter.use("/", clientRouter)

export default rootRouter
```

We can see that our `rootRouter` is applying our `clientRouter` at the root path. It also indicates to us that if we had any routes we wanted to have our Express app handle, we would want to specify them _above_ the `clientRouter`. For example, let's say we had an `iceCreamsRouter` for API data. Our file would look like this:

```javascript
// server/src/routes/rootRouter.js

import express from "express"
import iceCreamsRouter from "./api/v1/iceCreamsRouter.js"
import clientRouter from "./clientRouter.js"

const rootRouter = new express.Router() 

rootRouter.use("/api/v1/ice-creams", iceCreamsRouter)

rootRouter.use("/", clientRouter)

export default rootRouter
```

This way, Express checks all other routes before starting to allow React Router to take over. But then the question remains: why wasn't our root path loading our React app?

The answer lies in the `clientRouter`. Let's take a look at that file:

```javascript
// server/src/routes/clientRouter.js

import express from "express"
import getClientIndexPath from "../config/getClientIndexPath.js"

const router = new express.Router()

const clientRoutes = ["/client", "/name"]
router.get(clientRoutes, (req, res) => {
  res.sendFile(getClientIndexPath())
})

export default router
```

We see a line right above our `router.get` line which declares an array of `clientRoutes`. Inside of it, we see two strings: "/client" and "/name". Look familiar? Those are the two routes that knew to load up our React app!

_Any_ routes that we want our React app to be able to take over need to be added in this array. From there, React will be allowed to load up and, if we've set up a React Router (in the same way we've done previously), render different pages based on the path. Of course, there is additional tooling and configuration around this setup that you're welcome to dig around in if you're curious, but for now, updating that array is the functionality that you need to know about. Let's test it out! Add the "/" path so that that array looks like this:

```javascript
const clientRoutes = ["/client", "/name", "/"]
```

Now, navigate to <http://localhost:3000> once again and you should see your React app appear!

### Why This Matters  

In order continue to develop in these monolith applications, we need to know more about how each of their inner gears turn. As our applications continue to get more complex, it's easy to compartmentalize the sections of a codebase into those we have context on, and those we do not. But the more we explore these files and integrations, the better prepared we will be to build and develop them in turn.

### Summary

We've reviewed the technologies we will be using from this point onward and what their responsibilities are in our applications. A significant amount of configuration is necessary in order to take the Node technologies of PostgreSQL, Objection, Knex and Express and get them to work together to provide a stable web server for our applications. We'll be providing the bulk of that configuration for you, but as long as you are aware of the key files for their setup, you'll be able to work with that structure effectively.

The `client` directory holds the configuration for React, which is served up using webpack. Our `main.js` and `App.js` files have a few extra concerns to be aware of, but otherwise our React configuration remains as it has always been: separate and responsible for the client UI only.

The `server` directory holds the configuration for our Express app: any routes for either API endpoints or pages we might want to be handled server-side. As we'll learn more about in the coming weeks, our Express app also contains all logic for connecting with our database and using JavaScript classes, as models, to represent that data. This Express subapp will still follow the MVC pattern we've practiced at length. The Express app additionally has some logic so that it's able to _load_ the React app when we boot up Express, even if it's not responsible for holding it.

The root directory is where it all comes together. Thanks to yarn workplaces, we're able to run scripts from our root in order to install dependencies and run scripts for our entire app.

The structure is big! There are a lot of tools at play here. But the pieces are familiar, and as you get more and more practice, this structure will start to get more familiar, and easier to navigate.