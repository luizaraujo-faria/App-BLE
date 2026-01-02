import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, TouchableOpacity, View, Text, StyleSheet } from 'react-native';

type EntryItemType = {
    id?: string;
    name?: string;
    sector?: string;
    entry?: string;
    exit?: string;
}

interface EntryCardProps {
    selectedItem: EntryItemType | null;
    visible: boolean;
    onClose: () => void;
}


const EntryCard = ({ selectedItem, visible, onClose }: EntryCardProps ) => {
    return (
        <Modal 
            visible={visible}
            transparent={true}
            animationType='fade'
        >

            <View style={styles.entryCardOverlay}>
                <View style={styles.entryCard}>

                    {/* Cabeçalho do card */}
                    <View style={styles.cardHeader}>
                        <View style={{ width: '80%', flexDirection: 'row', gap: 10 }}>
            
                            <View style={styles.texts}>
                                <Text style={styles.title}>Informações de {selectedItem?.name?.split(' ', 2).join(' ')}</Text>
                            </View>
                        </View>

                        <TouchableOpacity 
                            onPress={onClose} 
                            style={{ width: '20%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>

                            <Ionicons name={'close'} size={24} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.cardInformations}>
                        
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

const styles = StyleSheet.create({
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
        fontFamily: 'AfacadFlux',
    },
    cardInformations: {
        width: '100%',
        height: '80%',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        fontFamily: 'AfacadFlux',
    },
});

export default EntryCard;