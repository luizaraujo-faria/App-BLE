import React from 'react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, FlatList, ActivityIndicator } from 'react-native';
import Header from '@/src/components/layout/Header';
import EntryItem from '@/src/components/ui/EntryItem';
import { createRecord } from '@/src/services/recordsService';
import { useBleContext } from '@/src/contexts/BleContext';

type EntryItemType = {
    id: string;
    name?: string;
    sector?: string;
    entry?: string;
    exit?: string;
}

const HomeScreen = () => {

    const { receivedData } = useBleContext();

    const [loading, setLoading] = useState(false);
    const pendingSendRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [entryItems, setEntryItems] = useState<EntryItemType[]>([]);


    const sendAllIDsToBackend = useCallback(async () => {

        try{
            setLoading(true);

            const ids = entryItems
                .map(item => item.id)
                .filter(Boolean) as string[];

            if (ids.length === 0) return;

            console.log('▶ Enviando IDs para o backend:', ids);

            await createRecord(ids);
            clearList();
            console.log('✔ IDs enviados com sucesso');
        }
        catch(err: any){
            console.log('❌ Erro ao enviar IDs:', err.message);
        }
        finally{
            setLoading(false);
        }
    }, [entryItems]);

    const clearList = () => {
        if(entryItems.length > 0){
            setEntryItems([]);
        }
    };

    useEffect(() => {
        // Se a lista estiver vazia, não faz nada
        if (entryItems.length === 0) return;

        // Limpa debounce anterior
        if (pendingSendRef.current) {
            clearTimeout(pendingSendRef.current);
        }

        // Debounce de 500ms para evitar flood
        pendingSendRef.current = setTimeout(() => {
            sendAllIDsToBackend();
        }, 5000);

    }, [entryItems, sendAllIDsToBackend]);

    useEffect(() => {

        if(!receivedData) return;

        if(receivedData.trim() === '') return;

        // Impedir duplicados
        const exists = entryItems.some(item => item.id === receivedData);
        if(exists) return;

        // Adicionar novo item
        setEntryItems(prev => [
            ...prev,
            { id: receivedData },
        ]);
    }, [receivedData]);

    return(
        <View style={{ flex: 1, position: 'relative' }}>
            <Header subtitle={'IMREA'}/>

            <View style={homeStyles.container}>

                <View style={homeStyles.entryPanel}>

                    <View style={homeStyles.panelHeader}>
                        <Text style={{ fontSize: 20 }}>Usuários recebidos</Text>
                    </View>

                    <FlatList
                        scrollEnabled={true}
                        nestedScrollEnabled={true}
                        data={entryItems}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => <EntryItem selectItem={() => null} entryItem={item}/>}
                        contentContainerStyle={{ gap: 12 }}
                        style={ homeStyles.list} 
                    />

                    {loading && (
                        <View style={{
                            width: '100%',
                            height: '15%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#83838317',
                        }}>
                            <ActivityIndicator size='large' color='#ffb54cff' />
                            <Text style={{ color: '#ffb54cff' }}>Enviando dados...</Text>
                        </View>
                    )}
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
        width: '80%',
        height: '8%',
        borderBottomColor: '#b8b8b8ff',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // clearButton: {
    //     width: '35%',
    //     height: 30,
    //     backgroundColor: '#ffb54cff',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     borderRadius: 4,
    // },
    list: {
        width: '100%',
        height: 'auto',
    },
});

export default HomeScreen;