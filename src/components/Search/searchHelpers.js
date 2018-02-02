export const stripHtml = (html) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

export const truncate = (string, maxLength = 130) =>
  (string.length > maxLength) ? string.substring(0, maxLength - 3) + '...' : string;


const getEventUrl = (event, activeLanguage) => {
  let slugForUrl = event.type === 'event' ? event.type : 'local';

  slugForUrl = event.categories.length ? event.categories.reduce((slug, cat) => {
    if (slug === 'event') {
      switch (cat.slug) {
      case 'visitor':
      case 'local':
        return cat.slug;
      default:
        return 'event';
      }
    }
    return slug;
  }, 'local') : 'local';


  return `/${activeLanguage}/${slugForUrl}/${event.slug}`;
};

export const getLinkTarget = (res, activeLanguage, changeOverlayEvent) => {
  switch (res.type) {
  case 'iframe':
    return { iframe: {url: res.url} };
  case 'page':
    return { page: {url: res.url} };
  default:
    return {
      to: getEventUrl(res, activeLanguage),
      onMouseUp: (e) => {
        if (window.location.indexOf(res.type) > -1) {
          e.stopPropagation();
          changeOverlayEvent(res);
        }
      }
    };
  }
};
