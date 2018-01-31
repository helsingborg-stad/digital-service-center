
/* eslint-disable no-console */

const TEXT_GROUP_ID = 'BDC68BBE-07CB-4A1B-9373-DE38ACF2B625';
const VIDEO_GROUP_ID = 'AC3DD344-4FDF-4DBB-9A86-53B3231CC452';

const CASE_TYPE_ID = '230D320E-9507-43CC-BDE8-60DCA4F742FE';
const BANNER_ID = '43DF29D6-C492-4F91-A479-24323A877BCE';

export function isChatOpen({type}) {
  if (typeof window === 'undefined') {
    return false;
  }
  if (!window.vngage) {
    console.warn('vngage not loaded in call to isChatOpen');
    return false;
  }
  const groupId = type === 'video' ? VIDEO_GROUP_ID : TEXT_GROUP_ID;
  return window.vngage.get('queuestatus', groupId) === 'open';
}

export function joinTextChat(pageName) {
  if (!window.vngage) {
    console.warn('vngage not loaded in call to joinTextChat');
    return;
  }
  window.vngage.join('queue', {
    groupId: TEXT_GROUP_ID,
    caseTypeId: CASE_TYPE_ID,
    bannerId: BANNER_ID,
    category: 'FAQ',
    message: `DSC ${pageName} (Text)`
  });
}

export function joinVideoChat(pageName) {
  if (!window.vngage) {
    console.warn('vngage not loaded in call to joinVideoChat');
    return;
  }
  window.vngage.join('queue', {
    groupId: VIDEO_GROUP_ID,
    caseTypeId: CASE_TYPE_ID,
    bannerId: BANNER_ID,
    category: 'FAQ',
    message: `DSC ${pageName} (Text)`
  });
}

export function subscribeToLeavingChat() {
  return new Promise((res, rej) => {
    if (!window.vngage) {
      rej('vngage not loaded in call to subscribeToLeavingChat');
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
