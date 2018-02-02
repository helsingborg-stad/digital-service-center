
export default function (url) {
  // Add absolute path to helsingborg-dsc.test when in development mode
  // In production mode, a reverse-proxy should pass this to the WordPress back-end,
  // instead of to the React front-end
  if (process.env.NODE_ENV === 'development') {
    return `//helsingborg-dsc.test/${url}`;
  }

  return url;
}
