

import { getClosestEventDate } from './eventsPageHelpers';

const initObject = {
  occasions: [
    {
      startDate: '2018-07-06 16:00',
      endDate: '2018-07-06 18:30',
      doorTime: null
    },
    {
      startDate: '2018-07-13 16:00',
      endDate: '2018-07-13 18:30',
      doorTime: null
    },
    {
      startDate: '2018-07-20 16:00',
      endDate: '2018-07-20 18:30',
      doorTime: null
    }
  ]
};

describe('getClosestEventDate', () => {
  it('It return correct date and week', () => {
    const myReturn = {
      date: '2018-07-20 16:00',
      week: 29
    };

    expect(getClosestEventDate(initObject))
      .toEqual(myReturn);
  });
});
