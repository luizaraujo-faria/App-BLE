import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Button from '@/src/components/ui/Button';
import Header from '@/src/components/layout/Header';
import Panel from '@/src/components/ui/Panel';
// import Popup from '@/src/components/ui/Popup';

type ColaboratorType = {
    id: string;
    name: string;
    datetime: string;
};

interface ActiveState {
    [key: string]: boolean;
}

const HomeScreen = () => {

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
        justifyContent: 'center',
        backgroundColor: '#8a8a8a69',
    },
});

export default HomeScreen;