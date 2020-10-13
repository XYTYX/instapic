```
$$$$$$\                       $$\                         $$\           
\_$$  _|                      $$ |                        \__|          
  $$ |  $$$$$$$\   $$$$$$$\ $$$$$$\    $$$$$$\   $$$$$$\  $$\  $$$$$$$\ 
  $$ |  $$  __$$\ $$  _____|\_$$  _|   \____$$\ $$  __$$\ $$ |$$  _____|
  $$ |  $$ |  $$ |\$$$$$$\    $$ |     $$$$$$$ |$$ /  $$ |$$ |$$ /      
  $$ |  $$ |  $$ | \____$$\   $$ |$$\ $$  __$$ |$$ |  $$ |$$ |$$ |      
$$$$$$\ $$ |  $$ |$$$$$$$  |  \$$$$  |\$$$$$$$ |$$$$$$$  |$$ |\$$$$$$$\ 
\______|\__|  \__|\_______/    \____/  \_______|$$  ____/ \__| \_______|
                                                $$ |                    
                                                $$ |                    
                                                \__|                    
```

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Integration with Instapic-Serv

In order to run this app with its full functionality, you also need to have [Instapic-Serv](https://github.com/xytyx/instapic-serv) running concurrently. Locally, both are served at localhost, and we rely on webpack's built-in proxy capabilities to proxy requests to the backend.

### Production

In production, this is the frontend for a flask service, [Instapic-Serv](https://github.com/xytyx/instapic-serv). To see this app in action, visit http://serv.instapic.site/.

### Components

This app is built using [Ant Design](https://ant.design/), check out their API for more information.

## Debugging

It is highly recommended that you install the [React Dev Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) to get a better idea of what's going on. It also doesn't hurt to run `yarn cache clean` every once in a while.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
