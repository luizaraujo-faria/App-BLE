import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/src/components/layout/Header';
import Button from '@/src/components/ui/Button';

type EntryItemType = {
    id?: string;
    name?: string;
    sector?: string;
    entry?: string;
    exit?: string;
}

interface EntryItemProps {
    entryItem: EntryItemType;
    selectItem: (item: EntryItemType) => void;
}
interface EntryCardProps {
    selectedItem: EntryItemType | null;
    visible: boolean;
    onClose: () => void;
}

// Item de listagem de funcionários
const EntryItem = ({ entryItem, selectItem }: EntryItemProps) => {
    return (
        <TouchableOpacity onPress={() => selectItem(entryItem)}>
            <View style={homeStyles.entryItemCard}>
                <View style={{ width: '50%', height: '100%', alignItems: 'flex-start', justifyContent: 'space-around' }}>
                    <Text>ID: {entryItem.id}</Text>
                    <Text>Nome: {entryItem.name?.split(' ', 2).join(' ')}</Text>
                </View>
                <View style={{ width: '50%', height: '90%', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                    <Text>{entryItem.entry}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// Cards de informações de funcionários
const EntryCard = ({ selectedItem, visible, onClose }: EntryCardProps ) => {
    return (
        <Modal 
            visible={visible}
            transparent={true}
            animationType='fade'
        >

            <View style={homeStyles.entryCardOverlay}>
                <View style={homeStyles.entryCard}>

                    {/* Cabeçalho do card */}
                    <View style={homeStyles.cardHeader}>
                        <View style={{ width: '80%', flexDirection: 'row', gap: 10 }}>
            
                            <View style={homeStyles.texts}>
                                <Text style={homeStyles.title}>Informações de {selectedItem?.name?.split(' ', 2).join(' ')}</Text>
                            </View>
                        </View>

                        <TouchableOpacity 
                            onPress={onClose} 
                            style={{ width: '20%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>

                            <Ionicons name={'close'} size={24} />
                        </TouchableOpacity>
                    </View>

                    <View style={homeStyles.cardInformations}>
                        
                        {/* Tópico 1 */}
                        <View style={{ width: '100%', height: 'auto', gap: 0 }}>
                            <Text style={{ fontSize: 18 }}>Dados Pessoais</Text>
                            
                            <View style={{ padding: 5 }}>

                                <Text>ID: 
                                    <Text style={ selectedItem?.id ? { color: '#106b0dff' } : { color: '#da0700ff' }}>{` ${selectedItem?.id}`}</Text>
                                </Text>

                                <Text>Nome: 
                                    <Text style={ selectedItem?.name ? { color: '#106b0dff' } : { color: '#da0700ff' }}>{` ${selectedItem?.name}`}</Text>
                                </Text>

                                <Text>Setor: 
                                    <Text style={ selectedItem?.sector ? { color: '#106b0dff' } : { color: '#da0700ff' }}>{` ${selectedItem?.sector}`}</Text>
                                </Text>
                            </View>
                        </View>

                        <View style={{ width: '100%', height: 2, backgroundColor: '#e7e7e7' }}></View>

                        {/* Tópico 2 */}
                        <View style={{ width: '100%', height: 'auto', gap: 0 }}>
                            <Text style={{ fontSize: 18 }}>Datas e Horários</Text>
                            
                            <View style={{ padding: 5 }}>

                                <Text>Entrada:
                                    <Text style={ selectedItem?.entry ? { color: '#daa700ff' } : { color: '#da0700ff' } }>
                                        {selectedItem?.entry ? ` ${selectedItem.entry}` : ' N/A'}
                                    </Text>
                                </Text>
                                
                                <Text>Saída:  
                                    <Text style={ selectedItem?.exit ? { color: '#daa700ff' } : { color: '#da0700ff' } }>
                                        {selectedItem?.exit ? ` ${selectedItem.exit}` : ' N/A'}
                                    </Text>
                                </Text>
                            </View>

                        </View>

                    </View>
                </View>
            </View>
        </Modal>
    );
};

const HomeScreen = () => {

    const [entryItems, _setEntryItems] = useState<EntryItemType[]>([
        { id: '12355', name: 'Shaolin Matador de Porco', sector: 'Bio Engenharia', entry: '20/10/25 - 11:30', exit: undefined },
        { id: '22456', name: 'Luiz Henrique Araujo Farias', sector: 'TI', entry: '20/10/25 - 13:50', exit: undefined },
        { id: '31257', name: 'Rayan Ferreira de Souza Lima', sector: 'Fisioterapia', entry: '20/10/25 - 12:20', exit: undefined },
        { id: '31258', name: 'Rodolfo Mendes Sena de assunção', sector: 'Recepção', entry: '20/10/25 - 12:20', exit: '20/11/2025 - 15:00' },
    ]);

    const [showEntryCard, setShowEntryCard] = useState(false);
    const [selectedItem, setSelectedItem] = useState<EntryItemType | null>(null);

    useEffect(() => {
        
        if(selectedItem){
            setShowEntryCard(true);
        }

    }, [selectedItem]);

    const clearList = () => {

        if(entryItems.length > 0){
            _setEntryItems([]);
        }
    };

    return(
        <View style={{ flex: 1, position: 'relative' }}>
            <Header subtitle={'IMREA'}/>
            
            <EntryCard 
                selectedItem={selectedItem} 
                visible={showEntryCard} 
                onClose={() => {
                    setShowEntryCard(false);
                    setSelectedItem(null);}}
            />

            <View style={homeStyles.container}>

                <View style={homeStyles.entryPanel}>

                    <View style={homeStyles.panelHeader}>
                        <Text style={{ fontSize: 18 }}>Usuários recebidos:</Text>

                        <Button 
                            textButton={'Limpar'} 
                            style={homeStyles.clearButton} 
                            disabled={entryItems.length === 0}
                            onPress={clearList} 
                        />
                    </View>

                    <FlatList
                        scrollEnabled={true}
                        nestedScrollEnabled={true}
                        data={entryItems}
                        keyExtractor={(item) => item.id!}
                        renderItem={({ item }) => <EntryItem selectItem={() => setSelectedItem(item)} entryItem={item}/>}
                        contentContainerStyle={{ gap: 12 }}
                        style={ homeStyles.list} 
                    />
                </View>
            </View>
        </View>
    );
};

const homeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4ff',
        padding: 24,
        gap: 16,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    entryPanel: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 4,
        boxShadow: '0px 0px 3px #8a8a8a69',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 10,
        gap: 16,
    },
    panelHeader: {
        width: '100%',
        height: '8%',
        borderBottomColor: '#888888ff',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    clearButton: {
        width: '35%',
        height: 30,
        backgroundColor: '#ffb54cff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
    },
    list: {
        width: '100%',
        height: 'auto',
    },
    entryItemCard: {
        width: '100%',
        height: 60,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f8f8ff',
        boxShadow: '0px 0px 3px #7a7a7a81',
        padding: 5,
    },
    entryCardOverlay: {
        flex: 1,
        backgroundColor: '#0000003b',
        alignItems: 'center',
        justifyContent: 'center',
    },
    entryCard: {
        width: '90%',
        height: '30%',
        backgroundColor: '#fff',
        boxShadow: '0px 0px 3px #7a7a7a81',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardHeader: {
        width: '100%',
        height: '20%',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
        paddingLeft: 10,
        paddingRight: 20,
        position: 'relative',
        zIndex: 2,
        boxShadow: '0px 0px 8px #8a8a8a69',
        overflow: 'hidden',
    },
    texts: {
        alignItems: 'flex-start',
        justifyContent: 'center', 
    },
    title: {
        fontSize: 18,
    },
    cardInformations: {
        width: '100%',
        height: '80%',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
});

export default HomeScreen;