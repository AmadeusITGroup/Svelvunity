import {
formatDate,
format,
calendarize,
createTimestamp,
getTimestamp,
normalizeTimestamp,
getDatesFromArray,
} from '../lib/utils/date';

describe('Date utils functions ', () => {
    test('should format the date string according to the given format', () => {
        const dateString = '2022-01-01';
        const dateFormat = 'dd/MM/yyyy';
        const formattedDate = formatDate(dateString, dateFormat);
        expect(formattedDate).toBe('01/01/2022');
    });

    test('should format the date according to the given format string', () => {
        const date = new Date(2022, 0, 1);
        const formatString = 'yyyy-MM-dd';
        const formattedDate = format(date, formatString);
        expect(formattedDate).toBe('2022-01-01');
    });

    test('should create a timestamp from the given year, month, and day', () => {
        const year = 2022;
        const month = 0;
        const day = 1;
        const timestamp = createTimestamp(year, month, day);
        expect(timestamp).toBe(new Date(2022, 0, 1).getTime());
    });

    test('should get the timestamp from the given date', () => {
        const date = '2022-01-01';
        const timestamp = getTimestamp(date);
        expect(timestamp).toBe(new Date('2022-01-01').getTime());
    });

    test('should normalize the timestamp to the start of the day', () => {
        const timestamp = new Date('2022-01-01T00:00:00').getTime();
        expect(normalizeTimestamp(timestamp)).toBe(new Date('2022-01-01T00:00:00').getTime());
    });

    test('should return the same value for different timezones', () => {
        const timestamp1 = '2023-01-01T00:00:00.000Z';
        const timestamp2 = '2022-12-31T19:00:00.000-05:00'; // Equivalent to 2023-01-01T00:00:00.000Z in EST
        expect(normalizeTimestamp(timestamp1)).toEqual(normalizeTimestamp(timestamp2));
    });

    test('should return an array of normalized timestamps for each date in the collection', () => {
		expect(getDatesFromArray(['2020-01-01', '2020-01-02', '2020-01-03'])).toEqual([
			normalizeTimestamp(new Date('2020-01-01').getTime()),
			normalizeTimestamp(new Date('2020-01-02').getTime()),
			normalizeTimestamp(new Date('2020-01-03').getTime())
		]);
	});

	test('should return an array of normalized timestamps for each date in a date range', () => {
		expect(getDatesFromArray(['2020-01-01:2020-01-03'])).toEqual([
			normalizeTimestamp(new Date('2020-01-01').getTime()),
			normalizeTimestamp(new Date('2020-01-02').getTime()),
			normalizeTimestamp(new Date('2020-01-03').getTime())
		]);
	});
    
    test('should return 5 weeks for a 3 week month', () => {
        expect(calendarize(new Date(2021, 0, 1), 4).length).toEqual(5);
    });
})