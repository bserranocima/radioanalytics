# RadioAnalytics

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.1.

## Development server

Run `npm run-script dev` for a dev server. Navigate to `http://localhost:3000/`. The app will automatically reload if you change any of the source files.

## Build

Run `npm run-script build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Production server

Run `npm start` for a prod server. Make sure you have configured the production environment variables in the file env.variables.json and you have already created the file `server/statics/monitors.json`. A template for `server/statics/monitors.json` can be found in `./monitors.example.json`. Navigate to your url to see the app running.

## Version 0.0.1 alfa
- The app will get the data from the configured monitors.
- Login is required to see all data inside.
- To create a new user, go to `/signup` route in the URL.
- Data from specific mount point can be displayed. You can see data in real time, from specific date, week or month.
- Errors gotten in any monitor request are displayed in `/dashboard` URL.
