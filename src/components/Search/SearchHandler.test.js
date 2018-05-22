import SearchHandler from './SearchHandler';

const initObject = {
  events: [],
  fetchData: () => {},
  landingPagePages: [],
  crm: [],
  activeLanguage: 'sv'
};

describe('SearchHandler', () => {
  it('is truthy when instantiated', () => {
    const handler = new SearchHandler(initObject);

    expect(handler).toBeTruthy();
  });

  it('is instanceOf itself', () => {
    const handler = new SearchHandler(initObject);

    expect(handler).toBeInstanceOf(SearchHandler);
  });

  it('contains a `search` function', () => {
    const handler = new SearchHandler(initObject);

    expect(handler.search).toBeTruthy();
  });

  it('returns a `searchTerm` equal to its argument when `search` is called', () => {
    const handler = new SearchHandler(initObject);
    const searchTerm = 'mySearchTerm';
    const result = handler.search(searchTerm);
    expect(result.searchTerm).toEqual(searchTerm);
  });

  it('returns truthy `eventsSearchResults` when `search` is called with search term', () => {
    const handler = new SearchHandler(initObject);
    const searchTerm = 'mySearchTerm';
    const result = handler.search(searchTerm);
    expect(result.eventsSearchResults).toBeTruthy();
  });

  it('returns falsy `eventsSearchResults` when `search` is called without search term', () => {
    const handler = new SearchHandler(initObject);
    const searchTerm = '';
    const result = handler.search(searchTerm);
    expect(result.eventsSearchResults).toBeFalsy();
  });

  it('returns truthy `crmSearchResults` when `search` is called with search term', () => {
    const handler = new SearchHandler(initObject);
    const searchTerm = 'mySearchTerm';
    const result = handler.search(searchTerm);
    expect(result.crmSearchResults).toBeTruthy();
  });

  it('returns falsy `crmSearchResults` when `search` is called without search term', () => {
    const handler = new SearchHandler(initObject);
    const searchTerm = '';
    const result = handler.search(searchTerm);
    expect(result.crmSearchResults).toBeFalsy();
  });

  it('calls `fetchData` when `search` is invoked', () => {
    const initWithSpy = {...initObject, fetchData: jest.fn()};
    const handler = new SearchHandler(initWithSpy);
    handler.search('');

    expect(initWithSpy.fetchData).toBeCalled();
  });
});
