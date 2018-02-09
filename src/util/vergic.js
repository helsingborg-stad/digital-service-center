/* eslint-disable no-console */

const TEXT_GROUP_ID = 'BDC68BBE-07CB-4A1B-9373-DE38ACF2B625';
const VIDEO_GROUP_ID = 'AC3DD344-4FDF-4DBB-9A86-53B3231CC452';

const CASE_TYPE_ID = '230D320E-9507-43CC-BDE8-60DCA4F742FE';
const BANNER_ID = '43DF29D6-C492-4F91-A479-24323A877BCE';

export function isChatOpen({ type }) {
  return new Promise(res => {
    if (typeof window === 'undefined') {
      res(false);
    }
    const intervalId = setInterval(() => {
      if (window.vngage && window.vngage.get) {
        const groupId = type === 'video' ? VIDEO_GROUP_ID : TEXT_GROUP_ID;
        res(window.vngage.get('queuestatus', groupId) === 'open');
        clearInterval(intervalId);
      }
    }, 250);
  });
}

export function joinTextChat(pageName, global = window) {
  if (!global.vngage || !global.vngage.join) {
    console.warn('vngage not loaded in call to joinTextChat');
    return;
  }
  global.vngage.join('queue', {
    groupId: TEXT_GROUP_ID,
    caseTypeId: CASE_TYPE_ID,
    bannerId: BANNER_ID,
    category: 'FAQ',
    message: `DSC ${pageName} (Text)`
  });
}

export function joinVideoChat(pageName, global = window) {
  if (!global.vngage || !global.vngage.join) {
    console.warn('vngage not loaded in call to joinVideoChat');
    return;
  }
  global.vngage.join('queue', {
    groupId: VIDEO_GROUP_ID,
    caseTypeId: CASE_TYPE_ID,
    bannerId: BANNER_ID,
    category: 'FAQ',
    message: `DSC ${pageName} (Text)`
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
