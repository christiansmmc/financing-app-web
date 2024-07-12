export const capitalize = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const converterValorParaReal = (value: number) => {
    const isNegativeNumber = value < 0;

    const formattedNumber = Math.abs(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
    });

    if (isNegativeNumber) {
        return formattedNumber.replace('R$', 'R$ -');
    }

    return formattedNumber;
}

export const normalizeDate = (strDate: string) => {
    const numbersOnly = strDate.replace(/\D/g, '');

    let day = numbersOnly.slice(0, 2);
    let month = numbersOnly.slice(2, 4);
    let year = numbersOnly.slice(4, 8);

    let maskedValue = day;
    if (day.length === 2 && month) {
        maskedValue += '/' + month;
        if (month.length === 2 && year) {
            maskedValue += '/' + year;
        }
    }

    return maskedValue;
}

export const getDayFromDate = (date: Date) => {
    const parts = date.toString().split("-");

    if (parts.length === 3) {
        return parts[2];
    } else {
        return "";
    }
}

export const getTodayDay = () => {
    const today = new Date()
    return String(today.getDate()).padStart(2, '0')
};

export const getStrYearMonthToday = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    return `${year}-${month}`
}

export const updateDayInDateString = (dateString: string, newDay: number) => {
    const dateSplited = dateString.split("-")
    return `${dateSplited[0]}-${dateSplited[1]}-${newDay.toString().padStart(2, '0')}`;
}