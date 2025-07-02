# GitHub Codespaces ♥️ React

Welcome to your shiny new Codespace running React! We've got everything fired up and running for you to explore React.

You've got a blank canvas to work on from a git perspective as well. There's a single initial commit with the what you're seeing right now - where you go from here is up to you!

Everything you do here is contained within this one codespace. There is no repository on GitHub yet. If and when you’re ready you can click "Publish Branch" and we’ll create your repository and push up your project. If you were just exploring then and have no further need for this code then you can simply delete your codespace and it's gone forever.

This project was bootstrapped for you with [Vite](https://vitejs.dev/).

## Available Scripts

In the project directory, you can run:

### `npm start`

We've already run this for you in the `Codespaces: server` terminal window below. If you need to stop the server for any reason you can just run `npm start` again to bring it back online.

Runs the app in the development mode.\
Open [http://localhost:3000/](http://localhost:3000/) in the built-in Simple Browser (`Cmd/Ctrl + Shift + P > Simple Browser: Show`) to view your running application.

The page will reload automatically when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Vite documentation](https://vitejs.dev/guide/).

To learn Vitest, a Vite-native testing framework, go to [Vitest documentation](https://vitest.dev/guide/)

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://sambitsahoo.com/blog/vite-code-splitting-that-works.html](https://sambitsahoo.com/blog/vite-code-splitting-that-works.html)

### Analyzing the Bundle Size

This section has moved here: [https://github.com/btd/rollup-plugin-visualizer#rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer#rollup-plugin-visualizer)

### Making a Progressive Web App

This section has moved here: [https://dev.to/hamdankhan364/simplifying-progressive-web-app-pwa-development-with-vite-a-beginners-guide-38cf](https://dev.to/hamdankhan364/simplifying-progressive-web-app-pwa-development-with-vite-a-beginners-guide-38cf)

### Advanced Configuration

This section has moved here: [https://vitejs.dev/guide/build.html#advanced-base-options](https://vitejs.dev/guide/build.html#advanced-base-options)

### Deployment

This section has moved here: [https://vitejs.dev/guide/build.html](https://vitejs.dev/guide/build.html)

### Troubleshooting

This section has moved here: [https://vitejs.dev/guide/troubleshooting.html](https://vitejs.dev/guide/troubleshooting.html)


## TODO:
- List acitivity items similar to the Shelly cloud interface of activity.
- Move dashboard stats to buttons on the sort and filter.  No dashboard, just the different colors of buttons with text identifier of button make most efficient use of the space and when clicked, the color fills the button. When toggled off, button is filled a different off color.  And u still want the totals as a badge notification aligned right snug in the corner of the button.

I want a filter icon button aligned right on the search and filter.  When clicked , it gives me modal of additional filters such as search by text, schedule cadence, activity date includes date range.  I no longer want the search text on the main search and filter component, it’s only on the modal.  When additional filters are applied , I want the filter icon to have badge notification of filter count.  SearchAndFilter bar should also have a reset button to clear all filters.

Optimize Route button should also be a button which is toggled on/off.  It’s filled green when toggled on.

When I click schedule and then pick date on the schedule modal: I want to return back to the portal.  Currently it returns to the details modal.  When scheduled, I simply want to add a new line item to my detail’s activity list. Set status accordingly. Text will be “work scheduled”.

Activity list items should be concise mobile friendly table with expandable rows when we have notes.  Summary of each row will be date, description, status.  Where status is complete, incomplete, canceled. When the “…” is clicked, we can update status and add notes and edit description.  

NextDue will be determined from the activity where incomplete and scheduled date is >= now and scheduled date is <= all other scheduled activity for this work item.

Work order card should also have a section of visual indicator tell user the next suggested date to schedule work for an item based on its cadence.   

Remove the days of the week selection from the cadence details on work order detail.

All individual labels/inputs should be on individual rows when dealing with modals.


