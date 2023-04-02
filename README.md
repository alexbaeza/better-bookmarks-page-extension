# Better Bookmarks Page Extension

#### _A better view of your bookmarks as a start page for quick access._


<p align="center">
  <b>Download:</b>
<br><br>
<a href="https://addons.mozilla.org/firefox/addon/better-bookmarks-page" target="_blank"><img src="docs/firefox.svg" alt="Download For Firefox"></a>
<a href="https://chrome.google.com/webstore/detail/better-bookmarks-page" target="_blank"><img src="docs/chrome.svg" alt="Download For Chrome"></a>
<br><br>
<a href="https://www.buymeacoffee.com/alexbaeza" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 30px !important;width: 109px !important;" ></a>
</p>


#### Introducing Better Bookmarks Page

Finding and viewing bookmarks has never been easier with a user-friendly start page. This extension seamlessly integrates with your browser's existing bookmark manager, ensuring a smooth and uninterrupted workflow.

Better Bookmarks Page uses the bookmarks API, making it fully compatible with all Chromium-based browsers.

#### The Why?

I wanted a simple speed dial type of bookmark start page that would show me all my bookmarks by
folders so I could organise them better and get a better view.

But at the same time I didn't want to re-invent the wheel I wanted to keep it simple and use the
`bookmarks` [Web Extension](https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions)
to maximize compatibility between firefox, chrome and other chromium based browsers _(Just in case I
ever switch :) )_

_if you'd like to find out more about the  `bookmarks` api_

- [bookmarks WebExtension](https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks)
  on (Mozilla Docs)
- [bookmarks WebExtension](https://developer.chrome.com/docs/extensions/reference/bookmarks/)
  on (Chrome Docs)

## Development

In the project directory, you can run:

### `yarn dev`

Runs the extension in the development mode with instant feedback.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Building the extension

### `yarn build`

Builds an optimized production build of the extension in the `build` folder.\
The build for the best performance.

The build is minified and filenames include hashes.
