export const generateBatches = (year, month) => {
    const batches = [];
    let currentDate = new Date(year, month, 1);

    for (let batchIdx = 0; batchIdx < 3; batchIdx++) {
        const batchDays = [];
        let count = 0;

        while (count < 7) {
            if (currentDate.getDay() !== 0) {
                batchDays.push(new Date(currentDate));
                count++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        batches.push({
            id: (batchIdx + 1).toString(),
            days: batchDays
        });

        currentDate.setDate(currentDate.getDate() + 2);
    }

    return batches;
};

export const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

export const getMonthName = (monthIdx) => {
    const names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return names[monthIdx];
};
