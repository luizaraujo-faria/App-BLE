import React, { useEffect, useState } from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from './style';
import AppText from '../AppText';
import { Ionicon } from '../Icons';
import { appColors } from '@/src/themes/colors';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

interface MonthYearPickerProps {
    currentDate: string;
    value: string;
    onChange: (value: string) => void;
}

const MonthYearPicker = ({ value, currentDate, onChange }: MonthYearPickerProps) => {

    const [date, setDate] = useState<Date>(new Date());
    const [showCalendar, setShowCalendar] = useState(false);

    useEffect(() => {
        const base = value || currentDate;

        if (base) {
            const parsed = dayjs(base, 'MM/YYYY').toDate();
            setDate(parsed);
        } else {
            setDate(new Date());
        }
    }, [value, currentDate]);

    const displayText = value
        ? `Mês: ${value.split('/')[0]} Ano: ${value.split('/')[1]}`
        : `Mês: ${currentDate.split('/')[0]} Ano: ${currentDate.split('/')[1]}`;

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (event.type === 'dismissed') {
            setShowCalendar(false);
            return;
        }

        if (selectedDate) {
            const normalized = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                1,
            );

            const formattedDate =
                `${String(normalized.getMonth() + 1).padStart(2, '0')}/${normalized.getFullYear()}`;

            onChange(formattedDate);
        }

        setShowCalendar(false);
    };

    return (
        <TouchableOpacity 
            style={styles.container}
            onPress={() => setShowCalendar(true)}
        >
            <Ionicon 
                iconName='calendar'
                iconColor={appColors.quintenary}
                iconSize={24}
            />
            
            <AppText 
                text={displayText}
                textStyle={styles.text}
            />

            {showCalendar && (
                <DateTimePicker
                    value={date}
                    mode='date'
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                />
            )}
        </TouchableOpacity>
    );
};

export default MonthYearPicker;