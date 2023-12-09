import {
  parseISO,
  isBefore,
  startOfToday,
  compareAsc,
  compareDesc,
} from 'date-fns';

import type { Order, SortedOrders } from '../types';

export const sortOrdersByEventDate = (orders: {
  edges: Order[];
}): SortedOrders => {
  const sortedOrders: SortedOrders = {
    past: [],
    upcoming: [],
  };

  orders.edges.forEach((order) => {
    const eventDateAttr = order.node.customAttributes.find(
      (attr) => attr.key === '_event_date'
    );
    if (eventDateAttr) {
      const eventDate = parseISO(eventDateAttr.value);
      const today = startOfToday();

      if (isBefore(eventDate, today)) {
        sortedOrders.past.push({ ...order, parsedEventDate: eventDate });
      } else {
        sortedOrders.upcoming.push({ ...order, parsedEventDate: eventDate });
      }
    }
  });

  // Sort the past orders in descending order
  sortedOrders.past = sortedOrders.past
    .filter((order) => order.parsedEventDate !== undefined) // Filter out orders without a valid date
    .sort((a, b) =>
      compareDesc(a.parsedEventDate as Date, b.parsedEventDate as Date)
    );

  // Sort the upcoming orders in ascending order
  sortedOrders.upcoming = sortedOrders.upcoming
    .filter((order) => order.parsedEventDate !== undefined) // Filter out orders without a valid date
    .sort((a, b) =>
      compareAsc(a.parsedEventDate as Date, b.parsedEventDate as Date)
    );

  return sortedOrders;
};
