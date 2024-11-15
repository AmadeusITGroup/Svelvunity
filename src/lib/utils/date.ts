export const formatDate = (dateString: string | Date, dateFormat: string) => {
	return (dateString && format(new Date(dateString), dateFormat)) || '';
};
export const format = (date: Date, formatString: string) => {
	return formatString.replace(/(yyyy|yy|MM|dd)/g, (match: string) => {
		switch (match) {
			case 'yyyy':
				return date.getFullYear().toString();
			case 'yy':
				return ('' + date.getFullYear()).slice(2);
			case 'MM':
				return ('0' + (date.getMonth() + 1)).slice(-2);
			case 'dd':
				return ('0' + date.getDate()).slice(-2);
			default:
				return '';
		}
	});
};

export const calendarize = (target: any, offset: number) => {
	const out: number[][] = [];
	const date = new Date(target || new Date());
	const year = date.getFullYear();
	const month = date.getMonth();
	const days = new Date(year, month + 1, 0).getDate();

	let first = new Date(year, month, 1 - (offset | 0)).getDay();
	let i = 0;
	let j = 0;
	let week: number[] = [];

	while (i < days) {
		week = [];
		for (j = 0; j < 7; j++) {
			if (j < first) {
				week.push(0);
			} else {
				week.push(++i > days ? 0 : i);
				first = 0;
			}
		}
		out.push(week);
	}

	return out;
};

export const createTimestamp = (year: number, month: number, day: number | undefined) =>
	new Date(year, month, day).getTime();

export const getTimestamp = (date: string | number | Date) => new Date(date).getTime();

export const normalizeTimestamp = (timestamp: string | number | Date) => {
	const date = new Date(timestamp);
	date.setHours(0, 0, 0, 0);
	return date.getTime();
};

export const getDatesFromArray = (collection: any) => {
	return collection.reduce((acc: any, date: any) => {
		const newDates = [];

		if (typeof date === 'string') {
			if (date.includes(':')) {
				const [rangeStart, rangeEnd] = date.split(':').map((d) => new Date(d));
				const currentDate = new Date(rangeStart);

				while (currentDate <= rangeEnd) {
					newDates.push(normalizeTimestamp(currentDate.getTime()));
					currentDate.setDate(currentDate.getDate() + 1);
				}
			} else {
				newDates.push(normalizeTimestamp(new Date(date).getTime()));
			}
		}

		return [...acc, ...newDates];
	}, []);
};
