import { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import Header from '@/src/components/layout/Header';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import useDropdown from '@/src/hooks/useDropdown';
import ActionButton from '@/src/components/ui/ActionButton';

const ManagmentScreen = () => {

    const periods = [
        { id: '1', period: 'Manhã' },
        { id: '2', period: 'Tarde' },
        { id: '3', period: 'Noite' },
    ];

    const sectors = [
        { id: '1', sector: 'TI' },
        { id: '2', sector: 'Bio Eng' },
        { id: '3', sector: 'Fisio' },
        { id: '4', sector: 'Medicina' },
    ];

    const sectorDropdown = useDropdown(sectors.map(s => ({ label: s.sector, value: s.id })));
    const periodDropdown = useDropdown(periods.map(p => ({ label: p.period, value: p.id })));

    useEffect(() => {
        if (sectorDropdown.open) periodDropdown.setOpen(false);
        if (periodDropdown.open) sectorDropdown.setOpen(false);
    }, [sectorDropdown.open, periodDropdown.open, sectorDropdown, periodDropdown]);


    return (
        <View style={{ flex: 1 }}>
            <Header subtitle={'Gestão'}/>
            
            <View style={style.container}>

                <View style={style.topBar}>

                    <ActionButton 
                        iconName='search' 
                        iconSize={24} 
                        onPress={() => Alert.alert('Teste', 'teste')} 
                        disabled={false}/>

                    <ActionButton 
                        iconName='reload' 
                        iconSize={24} 
                        onPress={() => Alert.alert('Teste', 'teste')} 
                        disabled={false}/>

                    <TouchableOpacity style={style.actionBar}>
                        <Ionicons name='search' size={24}/>
                    </TouchableOpacity>

                </View>

                <View style={style.chartContainer}>

                </View>

                <View style={style.bottomBar}>

                    <View style={{ width: '50%', height: '100%', justifyContent: 'space-between' }}>

                        {/* <TouchableOpacity style={style.actionBottom}>
                            <Ionicons name='time' size={24}/>
                            <Text>Data/Hora</Text>
                        </TouchableOpacity> */}

                        {/* <TouchableOpacity style={style.actionBottom}>
                            <Ionicons name='trash-bin' size={24}/>
                        </TouchableOpacity> */}

                        <DropDownPicker
                            disabled={false}
                            open={sectorDropdown.open}
                            value={sectorDropdown.value}
                            items={sectorDropdown.items}
                            setOpen={sectorDropdown.setOpen}
                            setValue={sectorDropdown.setValue}
                            setItems={sectorDropdown.setItems}
                            placeholder={'Setor'}
                            style={style.dropdownBar}
                            dropDownContainerStyle={style.dropdownContainer}
                            labelStyle={style.dropdownLabel}
                            placeholderStyle={style.dropdownPlaceholder}
                            selectedItemContainerStyle={style.selectedItemContainer}
                            selectedItemLabelStyle={style.selectedItemLabel}
                            dropDownDirection='TOP'
                        />

                        <DropDownPicker
                            disabled={false}
                            open={periodDropdown.open}
                            value={periodDropdown.value}
                            items={periodDropdown.items}
                            setOpen={periodDropdown.setOpen}
                            setValue={periodDropdown.setValue}
                            setItems={periodDropdown.setItems}
                            placeholder='Período'
                            style={style.dropdownBar}
                            dropDownContainerStyle={style.dropdownContainer}
                            labelStyle={style.dropdownLabel}
                            placeholderStyle={style.dropdownPlaceholder}
                            selectedItemContainerStyle={style.selectedItemContainer}
                            selectedItemLabelStyle={style.selectedItemLabel}
                            dropDownDirection='TOP'
                        />
                    </View>

                    <TouchableOpacity style={style.actionButton}>
                        <Ionicons name='search' size={24}/>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#f4f4f4ff',
        padding: 24,
        gap: 16,
    },
    topBar: {
        width: '100%',
        height: '10%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        gap: 12,
    },
    // actionOption: {
    //     width: 80,
    //     height: 60,
    //     boxShadow: '0px 0px 2px #94949475',
    //     borderRadius: 4,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     backgroundColor: '#fff',
    // },
    actionBar: {
        width: 180,
        height: 55,
        boxShadow: '0px 0px 2px #94949475',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffffff',
        color: '#000',
        borderWidth: 0,
        position: 'relative',
    },
    chartContainer: {
        width: '100%',
        height: '60%',
        boxShadow: '0px 0px 2px #94949475',
        borderRadius: 4,
        backgroundColor: '#fff',
    },
    bottomBar: {
        width: '100%',
        height: '20%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    // actionBottom: {
    //     width: '100%',
    //     height: '44%',
    //     backgroundColor: '#fff',
    //     boxShadow: '0px 0px 2px #94949475',
    //     borderRadius: 4,
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     justifyContent: 'space-evenly',
    // },
    actionButton: {
        width: '45%',
        height: '100%',
        backgroundColor: '#fff',
        boxShadow: '0px 0px 2px #94949475',
        borderRadius: 4,
    },

    dropdownBar: {
        width: 180,
        height: 55,
        boxShadow: '0px 0px 2px #94949475',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffffff',
        color: '#000',
        borderWidth: 0,
        position: 'relative',
    },
    dropdownContainer: {
        width: 180,
        backgroundColor: '#ffffffea',
        borderWidth: 0,
        borderTopRightRadius: 2,
        borderTopLeftRadius: 2,
        boxShadow: '0px 0px 2px #94949475',
    },
    dropdownLabel: {
        fontSize: 18,
        color: '#000000ff',
    },
    dropdownPlaceholder: {
        fontSize: 18,
        color: '#000000',
    },
    selectedItemContainer: {
        backgroundColor: '#a7a7a7',
    },
    selectedItemLabel: {
        fontWeight: 'bold',
        color: '#000000ff',
    },

});

export default ManagmentScreen;