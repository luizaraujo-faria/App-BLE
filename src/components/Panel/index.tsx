import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';

type ColaboratorType = {
    id: string;
    name: string;
    datetime: string;
};

interface ColaboratorProps {
    colaborator: ColaboratorType;
    
};

interface PanelProps {
    title: string;
    contentList: ColaboratorType[];
    id: string;
    isActive: boolean;
    onToggle: (id: string) => void;
};

const ColaboratorCard = ({ colaborator }: ColaboratorProps) => (

    <View style={panelStyles.colaboratorCard}>
        <Text style={panelStyles.colId}>ID: {colaborator.id}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={panelStyles.colName}>Nome: {colaborator.name.split(' ').slice(0, 2).join(' ')}</Text>
            <Text>{colaborator.datetime}</Text>
        </View>
    </View>
);

const Panel = ({ title, contentList, id, isActive, onToggle }: PanelProps) => {

    return(
        <View style={  [panelStyles.panel, isActive && panelStyles.activePanel] }>
            
            <TouchableOpacity onPress={() => onToggle(id)} style={{ width: '100%' }}>
                <View style={ panelStyles.listHeader}>

                    <Ionicons 
                        name={'caret-down'} 
                        size={20} 
                        color={'#ffb54cff'}
                        style={ isActive ? { transform: [{ rotate: '0deg' }] } : { transform: [{ rotate: '180deg' }] } }/>
                    <Text style={{ fontSize: 22 }}>{title}</Text>
                    <Ionicons name={'trash'} size={15} color={'#da0700ff'}/>
                </View>
            </TouchableOpacity>

            <FlatList 
                scrollEnabled={true}
                nestedScrollEnabled={true}
                data={contentList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ColaboratorCard colaborator={item}/>}
                contentContainerStyle={{ gap: 12 }}
                style={ panelStyles.list} />
        </View>
    );
};

const panelStyles = StyleSheet.create({
    panel: {
        width: '100%',
        height: 50,
        maxHeight: 300,
        backgroundColor: '#fff',
        boxShadow: '0px 0px 8px #8a8a8a69',
        borderRadius: 4,
        alignItems: 'center',
        gap: 24,
        paddingBottom: 16,
    },
    activePanel: {
        height: 'auto',
    },
    listHeader: {
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
    },
    list: {
        width: '95%',
        height: 'auto',
    },
    colaboratorCard: {
        width: '100%',
        height: 'auto',
        padding: 8,
        backgroundColor: '#eaeaea78',
        borderRadius: 4,
    },
    colId: {
        fontSize: 16,
    },
    colName: {
        fontSize: 18,
    },
});

export default Panel;