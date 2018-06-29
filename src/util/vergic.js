/* eslint-disable no-console */

const GROUP_ID = 'BDC68BBE-07CB-4A1B-9373-DE38ACF2B625';

const CASE_TYPE_ID = '230D320E-9507-43CC-BDE8-60DCA4F742FE';
const BANNER_ID = '43DF29D6-C492-4F91-A479-24323A877BCE';

export function isChatOpen() {
  return new Promise(res => {
    if (typeof window === 'undefined') {
      res(false);
      return;
    }
    const intervalId = setInterval(() => {
      // Check if window.vngage is loaded every 250 ms
      if (window.vngage && window.vngage.get) {
        // Once it's available, wait one second before checking queue status
        // (due to potential racing condition if accessing the method immediately)
        clearInterval(intervalId);
        setTimeout(() => {
          res(window.vngage.get('queuestatus', GROUP_ID) === 'open');
        }, 1000);
      }
    }, 250);
  });
}

export function joinChat(pageName, global = window) {
  if (!global.vngage || !global.vngage.join) {
    console.warn('vngage not loaded in call to joinChat');
    return;
  }
  global.vngage.join('queue', {
    groupId: GROUP_ID,
    caseTypeId: CASE_TYPE_ID,
    bannerId: BANNER_ID,
    category: 'FAQ',
    message: `DSC ${pageName}`
  });
}

export function subscribeToLeavingChat(global = window) {
  return new Promise((res, rej) => {
    if (!global.vngage || !global.vngage.subscribe) {
      rej('vngage not loaded in call to subscribeToLeavingChat');
    }
    global.vngage.subscribe('queue:leave', (evt, banner) => {
      res(evt, banner);
    });
    global.vngage.subscribe('conversation_closed', (evt, banner) => {
      res(evt, banner);
    });
  });
}

export function unsubscribeToLeavingChat(global = window) {
  if (!global.vngage || !global.vngage.unsubscribe) {
    console.warn('vngage not loaded in call to unsubscribeToLeavingChat');
    return;
  }
  global.vngage.unsubscribe('queue:leave');
  global.vngage.unsubscribe('conversation_closed');
}

/* eslint-enable no-console */
