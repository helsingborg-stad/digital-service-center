Manual import of https://github.com/BosNaufal/react-ripple source code,
since the repo doesn't work together with create-react-app

Exact version forked: https://github.com/BosNaufal/react-ripple/commit/db23cf7a8eea3db8bae5e4d36027244b6fca2351

Changes to the source code include:
- Whitespace and other stylistic changes, to get rid of linting errors
- Changed CSS syntax from SASS to vanilla CSS
- Updated require statement for CSS to reflect the new CSS structure
- Removed `onTouchend` property from react-ripple-button
- Added className property (including combining with standard class using `classnames`) to react-ripple-button
- Added onClick property to react-ripple-button to support passing onClick function callbacks

License
MIT Copyright (c) 2016 - forever Naufal Rabbani
