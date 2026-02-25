import React from 'react';
import { View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import ActionButton from '@/src/components/ActionButton';
import { AntDesignIcon, MaterialCommunityIcon } from '@/src/components/Icons';
import styles from './style';
import useDropdown from '@/src/hooks/useDropdown';
import { appColors } from '@/src/themes/colors';
import MonthYearPicker from '../MonthYearPicker';

interface FiltersProps {
    currentDate: string;
    date: string;
    turn: string;
    data: string;
    onDateChange: (value: string) => void;
    onTurnChange: (value: string) => void;
    onDataChange: (value: string) => void;
    onReload: () => Promise<void>;
}

const Filters = React.memo(({
    currentDate,
    date,
    turn,
    data,
    onDateChange,
    onTurnChange,
    onDataChange,
    onReload,
}: FiltersProps ) => {

    const turns = [
        { id: '1', label: 'Café da Manhã' },
        { id: '2', label: 'Almoço' },
        { id: '3', label: 'Café da Tarde' },
    ];

    const datas = [
        { id: '1', label: 'Por setor' },
        { id: '2', label: 'Por colaborador' },
        { id: '3', label: 'Por tipo de colaborador' },
        { id: '4', label: 'Horário de pico' },
    ];

    const isPeakTime = data === '4';

    const turnDropdown = useDropdown(turns.map(t => ({ value: t.id, label: t.label })));
    const dataDropdown = useDropdown(datas.map(d => ({ value: d.id, label: d.label })));

    const clearFilters = () => {

        if(date) onDateChange(currentDate);
        if(turn) onTurnChange('');
        return;
    };
    
    return(
        <View style={styles.topBar}>

            <View
                style={{
                    width: '100%',
                    height: '47.5%',
                    maxHeight: '47.5%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <View style={{ width: '59.5%', height: '100%' }}>
                    <DropDownPicker
                        disabled={false}
                        open={dataDropdown.open}
                        value={data}
                        items={dataDropdown.items}
                        setOpen={dataDropdown.setOpen}
                        setValue={(cb) => {
                            const value = cb(data);
                            onDataChange(value);
                            return value;
                        }}
                        setItems={dataDropdown.setItems}
                        placeholder={'Selecione o dado desejado'}
                        style={styles.dataDropdownBar}
                        dropDownContainerStyle={styles.dataDropdownContainer}
                        labelStyle={styles.dropdownLabel}
                        placeholderStyle={styles.dropdownPlaceholder}
                        selectedItemContainerStyle={styles.selectedItemContainer}
                        selectedItemLabelStyle={styles.selectedItemLabel}
                        dropDownDirection='BOTTOM'
                        zIndex={5}
                        onOpen={() => {
                            turnDropdown.setOpen(false);
                        }}
                        ArrowDownIconComponent={() => (
                            <AntDesignIcon iconName='caret-down' iconColor={appColors.quintenary} iconSize={20} />
                        )}
                        ArrowUpIconComponent={() => (
                            <AntDesignIcon iconName='caret-up' iconColor={appColors.quintenary} iconSize={20} />
                        )}
                    />
                </View>

                <View 
                    style={{ 
                        width: '39%',
                        height: '100%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <ActionButton 
                        icon={<MaterialCommunityIcon 
                            iconName='reload'
                            iconSize={24}
                            iconColor='#fff'
                        />} 
                        onPress={onReload}   
                        style={{
                            height: '100%',
                            width: '48.5%',
                            backgroundColor: appColors.quintenary,
                        }}                   
                    />

                    <ActionButton 
                        icon={<MaterialCommunityIcon 
                            iconName='broom'
                            iconSize={24}
                            iconColor='#fff'
                        />} 
                        onPress={clearFilters}   
                        style={{
                            height: '100%',
                            width: '48.5%',
                            backgroundColor: appColors.quaternary,
                        }}                     
                    />
                </View>
            </View>

            <View
                style={{
                    width: '100%',
                    height: '47.5%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // backgroundColor: '#000',
                }}
            >
                <View style={{ width: '49.25%', height: '100%' }}>
                    <MonthYearPicker
                        currentDate={currentDate}
                        value={date}
                        onChange={onDateChange}
                    />
                </View>

                <View style={{ width: '49.25%', height: '100%' }}>
                    <DropDownPicker
                        disabled={isPeakTime}
                        open={turnDropdown.open}
                        value={turn}
                        items={turnDropdown.items}
                        setOpen={turnDropdown.setOpen}
                        setValue={(cb) => {
                            const value = cb(turn);
                            onTurnChange(value);
                            return value;
                        }}
                        setItems={turnDropdown.setItems}
                        placeholder={'Selecione o Turno'}
                        style={[styles.dropdownBar, isPeakTime && styles.dropdownDisabled]}
                        dropDownContainerStyle={styles.dropdownContainer}
                        labelStyle={styles.dropdownLabel}
                        placeholderStyle={styles.dropdownPlaceholder}
                        selectedItemContainerStyle={styles.selectedItemContainer}
                        selectedItemLabelStyle={styles.selectedItemLabel}
                        dropDownDirection='BOTTOM'
                        zIndex={2}
                        onOpen={() => {
                            // monthDropdown.setOpen(false);
                            dataDropdown.setOpen(false);
                        }}
                        ArrowDownIconComponent={() => (
                            <AntDesignIcon iconName='caret-down' iconColor={appColors.quintenary} iconSize={20} />
                        )}
                        ArrowUpIconComponent={() => (
                            <AntDesignIcon iconName='caret-up' iconColor={appColors.quintenary} iconSize={20} />
                        )}
                        
                    />
                </View>
            </View>

        </View>
    );
});

export default Filters;