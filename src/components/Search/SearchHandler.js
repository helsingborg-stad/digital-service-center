import Sifter from 'sifter';

export default class SearchHandler {
  constructor({events, fetchData, landingPagePages, crm, activeLanguage}) {
    this.events = events;
    this.fetchData = fetchData;
    this.landingPagePages = landingPagePages;
    this.crm = crm;
    this.activeLanguage = activeLanguage;
  }

  search(searchTerm) {
    const { fetchData, events, landingPagePages, crm, activeLanguage } = this;

    fetchData(searchTerm);

    const eventsSifter = new Sifter(events);
    const eventsSifterResult = eventsSifter.search(searchTerm, {
      fields: ['name', 'content'],
      sort: [{field: 'name', direction: 'asc'}],
      limit: 10
    });

    const resultEvents = events.filter((event, index) =>
      eventsSifterResult.items.some(item => item.id === index)
    );

    const landingPagePagesSifter = new Sifter(landingPagePages);
    const landingPagePagesResult = landingPagePagesSifter.search(searchTerm, {
      fields: ['name'],
      sort: [{field: 'name', direction: 'asc'}],
      limit: 10
    });

    const resultLandingPagePages = landingPagePages.filter((page, index) =>
      landingPagePagesResult.items.some(item => item.id === index)
    );

    const crmForCurrentLang = crm.filter(c => c.language === activeLanguage);
    const crmSifter = new Sifter(crmForCurrentLang);
    const crmSifterResult = crmSifter.search(searchTerm, {
      fields: ['question', 'answer'],
      sort: [{field: 'question', direction: 'asc'}],
      limit: 10
    });

    const resultCrm = crmForCurrentLang.filter((crmEntry, index) =>
      crmSifterResult.items.some(item => item.id === index)
    );

    return {
      searchTerm,
      eventsSearchResults: searchTerm ? [...resultEvents, ...resultLandingPagePages] : null,
      crmSearchResults: searchTerm ? resultCrm : null
    };
  }
}
