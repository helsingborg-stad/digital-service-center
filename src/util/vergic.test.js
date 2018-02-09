import { isChatOpen, joinVideoChat, joinTextChat, subscribeToLeavingChat, unsubscribeToLeavingChat } from '../util/vergic';

test('joinVideoChat calls vngage.join', () => {
  const mock = {
    vngage: {
      join: jest.fn()
    }
  };

  joinVideoChat('pageName', mock);

  expect(mock.vngage.join).toBeCalled();
});

test('joinTextChat calls vngage.join', () => {
  const mock = {
    vngage: {
      join: jest.fn()
    }
  };

  joinTextChat('pageName', mock);

  expect(mock.vngage.join).toBeCalled();
});

test('subscribeToLeavingChat calls vngage.subscribe', () => {
  const mock = {
    vngage: {
      subscribe: jest.fn()
    }
  };

  subscribeToLeavingChat(mock);

  expect(mock.vngage.subscribe).toBeCalled();
});

test('unsubscribeToLeavingChat calls vngage.unsubscribe', () => {
  const mock = {
    vngage: {
      unsubscribe: jest.fn()
    }
  };

  unsubscribeToLeavingChat(mock);

  expect(mock.vngage.unsubscribe).toBeCalled();
});

test('isChatOpen returns true if vngage is loaded', async function() {
  window.vngage = {
    get() {
      return 'open';
    }
  }
  const chatStatus = await isChatOpen('video');
  expect(chatStatus).toBe(true);
  delete window.vngage;
});
