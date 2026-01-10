import React from 'react';
import { View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import ActionButton from '@/src/components/ActionButton';
import { AntDesignIcon, MaterialCommunityIcon } from '@/src/components/Icons';
import styles from './style';
import useDropdown from '@/src/hooks/useDropdown';
import dayjs from 'dayjs';
import { appColors } from '@/src/themes/colors';

interface FiltersProps {
    month: string;
    turn: string;
    data: string;
    onMonthChange: (value: string) => void;
    onTurnChange: (value: string) => void;
    onDataChange: (value: string) => void;
    onReload: () => Promise<void>;
}

const Filters = React.memo(({
    month,
    turn,
    data,
    onMonthChange,
    onTurnChange,
    onDataChange,
    onReload,
}: FiltersProps ) => {

    const currentMonth: string = String(dayjs().month() + 1);

    const months = [
        { id: '1', label: 'Janeiro' },
        { id: '2', label: 'Fevereiro' },
        { id: '3', label: 'Março' },
        { id: '4', label: 'Abril' },
        { id: '5', label: 'Maio' },
        { id: '6', label: 'Junho' },
        { id: '7', label: 'Julho' },
        { id: '8', label: 'Agosto' },
        { id: '9', label: 'Setembro' },
        { id: '10', label: 'Outubro' },
        { id: '11', label: 'Novembro' },
        { id: '12', label: 'Dezembro' },
    ];

    const turns = [
        { id: '1', label: 'Café da Manhã' },
        { id: '2', label: 'Almoço' },
        { id: '3', label: 'Café da Tarde' },
    ];

    const datas = [
        { id: '1', label: 'Por setor' },
        { id: '2', label: 'Por colaborador' },
        { id: '3', label: 'Por tipo de colaborador' },
    ];

    const monthDropdown = useDropdown(months.map(m => ({ value: m.id, label: m.label })));
    const turnDropdown = useDropdown(turns.map(t => ({ value: t.id, label: t.label })));
    const dataDropdown = useDropdown(datas.map(d => ({ value: d.id, label: d.label })));

    const clearFilters = () => {

        if(month) onMonthChange(currentMonth);
        if(turn) onTurnChange('');
        return;
    };
    
    return(
        <View style={styles.topBar}>

            <View
                style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: '0%',
                }}
            >
                <View style={{ width: '60%' }}>
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
                        labelStyle={[styles.dropdownLabel, { fontSize: 18 }]}
                        placeholderStyle={styles.dropdownPlaceholder}
                        selectedItemContainerStyle={styles.selectedItemContainer}
                        selectedItemLabelStyle={styles.selectedItemLabel}
                        dropDownDirection='BOTTOM'
                        zIndex={5}
                        onOpen={() => {
                            turnDropdown.setOpen(false);
                            monthDropdown.setOpen(false);
                        }}
                    />
                </View>

                <View 
                    style={{ 
                        width: '38%',
                        flexDirection: 'row',
                        // gap: '3%',
                        justifyContent: 'space-between',
                        // backgroundColor: '#979595ff',
                    }}
                >
                    <ActionButton 
                        icon={<MaterialCommunityIcon 
                            iconName='reload'
                            iconSize={26}
                            iconColor='#fff'
                        />} 
                        onPress={onReload}   
                        style={{
                            height: 50,
                            width: 70,
                            backgroundColor: appColors.quintenary,
                        }}                   
                    />

                    <ActionButton 
                        icon={<AntDesignIcon 
                            iconName='clear'
                            iconSize={24}
                            iconColor='#fff'
                        />} 
                        onPress={clearFilters}   
                        style={{
                            height: 50,
                            width: 70,
                            backgroundColor: appColors.quaternary,
                        }}                     
                    />
                </View>
            </View>

            <View
                style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: '2%',
                    paddingHorizontal: '1%',
                }}
            >
                <View style={{ width: '50%' }}>
                    <DropDownPicker
                        disabled={false}
                        open={monthDropdown.open}
                        value={month}
                        items={monthDropdown.items}
                        setOpen={monthDropdown.setOpen}
                        setValue={(cb) => {
                            const value = cb(month);
                            onMonthChange(value);
                            return value;
                        }}
                        setItems={monthDropdown.setItems}
                        placeholder={'Selecione o Mês'}
                        style={[styles.dropdownBar]}
                        dropDownContainerStyle={styles.dropdownContainer}
                        labelStyle={styles.dropdownLabel}
                        placeholderStyle={styles.dropdownPlaceholder}
                        selectedItemContainerStyle={styles.selectedItemContainer}
                        selectedItemLabelStyle={styles.selectedItemLabel}
                        dropDownDirection='BOTTOM'
                        zIndex={2}
                        onOpen={() => {
                            dataDropdown.setOpen(false);
                            turnDropdown.setOpen(false);
                        }}
                    />
                </View>

                <View style={{ width: '50%' }}>
                    <DropDownPicker
                        disabled={false}
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
                        style={[styles.dropdownBar]}
                        dropDownContainerStyle={styles.dropdownContainer}
                        labelStyle={styles.dropdownLabel}
                        placeholderStyle={styles.dropdownPlaceholder}
                        selectedItemContainerStyle={styles.selectedItemContainer}
                        selectedItemLabelStyle={styles.selectedItemLabel}
                        dropDownDirection='BOTTOM'
                        zIndex={2}
                        onOpen={() => {
                            monthDropdown.setOpen(false);
                            dataDropdown.setOpen(false);
                        }}
                    />
                </View>
            </View>

        </View>
    );
});

export default Filters;