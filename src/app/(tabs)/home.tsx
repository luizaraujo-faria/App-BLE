import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Button from '@/src/components/ui/Button';
import Header from '@/src/components/layout/Header';
import Panel from '@/src/components/ui/Panel';
import DropDownPicker from 'react-native-dropdown-picker';
// import Popup from '@/src/components/ui/Popup';

type ColaboratorType = {
    id: string;
    name: string;
    datetime: string;
}

type DropDownType = {
    option: string;
}


interface ActiveState {
    [key: string]: boolean;
}

const HomeScreen = () => {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState<DropDownType[]>([
        { option: 'Bio Engenharia' },
        { option: 'TI' },
        { option: 'Fisio' },
    ]);

    useEffect(() => {
        const setorItems: DropDownType[] = items.map(setor => ({
            option: setor.option,
        }));
        setItems(setorItems);
    }, [items]);

    const [colaborators, _setColaborators] = useState<ColaboratorType[]>([
        { id: '12355', name: 'Shaolin Matador de Porco', datetime: '20/10/25 - 11:30' },
        { id: '22456', name: 'Luiz Henrique Araujo Farias', datetime: '20/10/25 - 13:50' },
        { id: '31257', name: 'Rayan Ferreira de Souza Lima', datetime: '20/10/25 - 12:20' },
        { id: '31258', name: 'Rayan Ferreira de Souza Lima', datetime: '20/10/25 - 12:20' },
        { id: '31259', name: 'Rayan Ferreira de Souza Lima', datetime: '20/10/25 - 12:20' },
        { id: '31250', name: 'Rayan Ferreira de Souza Lima', datetime: '20/10/25 - 12:20' },
        { id: '31211', name: 'Rayan Ferreira de Souza Lima', datetime: '20/10/25 - 12:20' },
    ]);

    const [activePanel, setActivePanel] = useState<ActiveState>({});

    const togglePanel = (id: string) => {
        setActivePanel((prev) => ({
            ...prev, [id]: !prev[id],
        }));
    };

    return(
        <View style={{ flex: 1 }}>
            <Header subtitle={'IMREA'}/>
            
            <View style={style.container}>
                        
                <View>
                    <ScrollView 
                        contentContainerStyle={{ flexGrow: 1, gap: 16 }}
                        nestedScrollEnabled
                        showsVerticalScrollIndicator={false}
                        style={style.panelContainer}
                    >
                        <Panel title='Entrada' id='1' contentList={colaborators} isActive={!!activePanel['1']} onToggle={togglePanel} />
                        <Panel title='Saída' id='2' contentList={colaborators} isActive={!!activePanel['2']} onToggle={togglePanel} />
                    </ScrollView>
                </View>

                <View style={style.actionContainer}>

                    <View style={style.searchContainer}>

                        <View style={style.searchBar}>

                            <DropDownPicker
                                open={open}
                                value={value}
                                items={items}
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setItems}
                                placeholder={'Setor'}
                                style={style.dropdown}
                                dropDownContainerStyle={style.dropdownContainer}
                                labelStyle={style.dropdownLabel}
                                placeholderStyle={style.dropdownPlaceholder}
                                selectedItemContainerStyle={style.selectedItemContainer}
                                selectedItemLabelStyle={style.selectedItemLabel}
                            />
                        </View>

                        <Button style={null} textButton='Buscar' disabled={false} onPress={() => null} />
                    </View>

                    <View style={style.searchListContainer}>
                        <Panel title='Dados buscados' id='3' contentList={colaborators} isActive={!!activePanel['3']} onToggle={togglePanel} />
                    </View>

                    {/* <Button 
                        textButton={'Buscar dados'} 
                        onPress={() => null} 
                        style={null} 
                        disabled={false}/> */}
                </View>
            </View>
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4ff',
        padding: 24,
        gap: 16,
    },
    panelContainer: {
        width: '100%',
        minHeight: 'auto',
        height: 'auto',
        maxHeight: 375,
        padding: 1,
    },
    actionContainer: {
        width: '100%',
        height: '40%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        boxShadow: '0px 0px 8px #8a8a8a69',
        padding: 10,
        gap: 18,
    },
    searchContainer: {
        width: '100%',
        height: '70%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,

    },
    searchBar: {
        width: '100%',
        height: 70,
        alignItems: 'flex-end',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 16,
    },
    searchListContainer: {
        width: '100%',
        height: 'auto',
    },
    dropdown: {
        backgroundColor: '#ffb54c',
        borderWidth: 0,
        borderRadius: 4,
        height: 50,
    },
    dropdownContainer: {
        backgroundColor: '#ebebebea',
        borderWidth: 0,
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
        boxShadow: '0px -1px 3px #0000007e',
    },
    dropdownLabel: {
        fontSize: 18,
        color: '#ffffffff',
    },
    dropdownPlaceholder: {
        fontSize: 18,
        color: '#ffffffff',
    },
    selectedItemContainer: {
        backgroundColor: '#a7a7a7',
    },
    selectedItemLabel: {
        fontWeight: 'bold',
        color: '#ffffff',
    },
});

export default HomeScreen;