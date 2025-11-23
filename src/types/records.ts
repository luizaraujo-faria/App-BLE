export interface CreateRecordDTO {
    colaboratorId: number | string;
}

export interface TimeRecord {
    colaboratorId: number | string;
    name: string;
    sector: string;
    day: Date | string,
    entry: Date | string,
    exit: Date | string,
    recordId: number;
}