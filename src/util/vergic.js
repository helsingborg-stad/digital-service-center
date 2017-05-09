
/* eslint-disable no-console */

export function isChatOpen() {
  if (typeof window === 'undefined') {
    return false;
  }
  if (!window.vngage) {
    console.warn('vngage not loaded in call to isChatOpen');
    return false;
  }
  return window.vngage.get('queuestatus', 'BDC68BBE-07CB-4A1B-9373-DE38ACF2B625') === 'open';
}

export function joinTextChat(pageName) {
  if (!window.vngage) {
    console.warn('vngage not loaded in call to joinTextChat');
    return;
  }
  window.vngage.join('queue', {
    groupId: 'BDC68BBE-07CB-4A1B-9373-DE38ACF2B625',
    caseTypeId: '230D320E-9507-43CC-BDE8-60DCA4F742FE',
    bannerId: '43DF29D6-C492-4F91-A479-24323A877BCE',
    category: 'FAQ',
    message: `DSC ${pageName} (Text)`
  });
}

export function subscribeToLeavingChat() {
  return new Promise((res, rej) => {
    if (!window.vngage) {
      rej(new Error('vngage not loaded in call to subscribeToLeavingChat'));
    }
    window.vngage.subscribe('queue:leave', (evt, banner) => {
      res(evt, banner);
    });
    window.vngage.subscribe('conversation_closed', (evt, banner) => {
      res(evt, banner);
    });
  });
}

export function unsubscribeToLeavingChat() {
  if (!window.vngage) {
    console.warn('vngage not loaded in call to unsubscribeToLeavingChat');
    return;
  }
  window.vngage.unsubscribe('queue:leave');
  window.vngage.unsubscribe('conversation_closed');
}

/* eslint-enable no-console */
