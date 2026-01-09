import React from 'react';
import { View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import ActionButton from '@/src/components/ActionButton';
import { MaterialCommunityIcon } from '@/src/components/Icons';
import styles from './style';
import useDropdown from '@/src/hooks/useDropdown';

interface FiltersProps {
    month: string;
    turn: string;
    sector?: string;
    onMonthChange: (value: string) => void;
    onTurnChange: (value: string) => void;
    onSectorChange?: (value: string) => void;
    onReload: () => Promise<void>;
}

const Filters = React.memo(({
    month,
    turn,
    onMonthChange,
    onTurnChange,
    onReload,
}: FiltersProps ) => {

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

    const sectors = [
        { id: '1', label: 'Bioeng' },
        { id: '2', label: 'Nutri' },
        { id: '3', label: 'Fisio' },
    ];

    const monthDropdown = useDropdown(months.map(m => ({ value: m.id, label: m.label })));
    const turnDropdown = useDropdown(turns.map(t => ({ value: t.id, label: t.label })));
    const sectorDropdown = useDropdown(sectors.map(s => ({ value: s.id, label: s.label })));
    
    return(
        <View style={styles.topBar}>

            <View
                style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: '2%',
                    // paddingHorizontal: '1%',
                }}
            >
                <View style={{ width: '75%' }}>
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
                        style={styles.monthDropdownBar}
                        dropDownContainerStyle={styles.monthDropdownContainer}
                        labelStyle={[styles.dropdownLabel, { fontSize: 18 }]}
                        placeholderStyle={styles.dropdownPlaceholder}
                        selectedItemContainerStyle={styles.selectedItemContainer}
                        selectedItemLabelStyle={styles.selectedItemLabel}
                        dropDownDirection='BOTTOM'
                        zIndex={5}
                        onOpen={() => {
                            turnDropdown.setOpen(false);
                            sectorDropdown.setOpen(false);
                        }}
                    />
                </View>

                <View>
                    <ActionButton 
                        icon={<MaterialCommunityIcon 
                            iconName='reload'
                            iconSize={24}
                            iconColor='#000'
                        />} 
                        onPress={onReload}   
                        style={{
                            height: 50,
                            width: 90,
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
                        style={styles.dropdownBar}
                        dropDownContainerStyle={styles.dropdownContainer}
                        labelStyle={styles.dropdownLabel}
                        placeholderStyle={styles.dropdownPlaceholder}
                        selectedItemContainerStyle={styles.selectedItemContainer}
                        selectedItemLabelStyle={styles.selectedItemLabel}
                        dropDownDirection='BOTTOM'
                        zIndex={2}
                        onOpen={() => {
                            monthDropdown.setOpen(false);
                            sectorDropdown.setOpen(false);
                        }}
                    />
                </View>

                <View style={{ width: '50%' }}>
                    <DropDownPicker
                        disabled={false}
                        open={sectorDropdown.open}
                        value={sectorDropdown.value}
                        items={sectorDropdown.items}
                        setOpen={sectorDropdown.setOpen}
                        setValue={sectorDropdown.setValue}
                        setItems={sectorDropdown.setItems}
                        placeholder={'Selecione o Setor'}
                        style={styles.dropdownBar}
                        dropDownContainerStyle={styles.dropdownContainer}
                        labelStyle={styles.dropdownLabel}
                        placeholderStyle={styles.dropdownPlaceholder}
                        selectedItemContainerStyle={styles.selectedItemContainer}
                        selectedItemLabelStyle={styles.selectedItemLabel}
                        dropDownDirection='BOTTOM'
                        zIndex={2}
                        onOpen={() => {
                            monthDropdown.setOpen(false);
                            turnDropdown.setOpen(false);
                        }}
                    />
                </View>
            </View>

        </View>
    );
});

export default Filters;