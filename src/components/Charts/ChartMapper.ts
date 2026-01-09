export const mapToBarData = (
    data: any[],
    labelKey: string,
    valueKey: string,
) => {
    return data.map(item => ({
        value: Number(item[valueKey]) || 0,
        label: String(item[labelKey]),
    }));
};