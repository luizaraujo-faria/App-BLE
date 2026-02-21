import React, { useState } from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from './style';
import AppText from '../AppText';
import { Ionicon } from '../Icons';
import { appColors } from '@/src/themes/colors';

interface MonthYearPickerProps {
    currentDate: string;
    value?: string;
    onChange: (value: string) => void;
}

const MonthYearPicker = ({ onChange }: MonthYearPickerProps) => {
    const [date, setDate] = useState<Date>(new Date());
    const [showCalendar, setShowCalendar] = useState(false);

    const onDateChange = (event: any, selectedDate?: Date) => {
        if(event.type === 'dismissed') {
            setShowCalendar(false);
            return;
        }

        if(selectedDate) {
            const normalized = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                1,
            );

            setDate(normalized);
            const formatted = `${String(normalized.getMonth() + 1).padStart(2, '0')}/${normalized.getFullYear()}`;
            onChange(formatted);
        }

        setShowCalendar(false);
    };

    const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    const displayText = date ? `Mês: ${formattedDate.slice(0, 2)} Ano: ${formattedDate.slice(3)}` : 'Selecione Mês e Ano';

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
                    onChange={onDateChange}
                    // placeholderText={formattedDate}
                />
            )}
        </TouchableOpacity>
    );
};

export default MonthYearPicker;