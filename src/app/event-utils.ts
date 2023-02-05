import { EventInput } from '@fullcalendar/core';

let eventGuid = 0;
const TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today
const END_EVENT = new Date("2023-02-06").toISOString().replace(/T.*$/, '');

console.log(END_EVENT);

export const INITIAL_EVENTS: EventInput[] = [

  {
    id: createEventId(),
    title: 'Alefe',
    start: TODAY_STR + 'T12:00:00',
    end: END_EVENT + 'T15:00:00'
  }
];

export function createEventId() {
  return String(eventGuid++);
}
