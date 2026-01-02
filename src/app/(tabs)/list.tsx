import React from 'react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, FlatList, ActivityIndicator } from 'react-native';
// import Header from '@/src/components/layout/Header';
import EntryItem from '@/src/components/ui/EntryItem';
import { createRecord } from '@/src/services/recordsService';
import { useBleContext } from '@/src/contexts/BleContext';
import { usePopup } from '@/src/contexts/PopupContext';
import { normalizeApiErrors } from '@/src/services/apiErrors';
import { useList } from '@/src/contexts/ListContext';

type EntryItemType = {
    id: string;
    timestamp?: number;
}

const ListScreen = () => {
    
    const { receivedData, clearReceivedData } = useBleContext();
    const { showPopup } = usePopup();
    const { setCount } = useList();

    const [loading, setLoading] = useState(false);
    const pendingSendRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [visibleEntryItems, setVisibleEntryItems] = useState<EntryItemType[]>([]);
    const [entryItems, setEntryItems] = useState<EntryItemType[]>([]);

    const pushWithLimit = (list: any[], item: any, limit: number) => {

        const next = [...list, item];
        return next.length > limit ? next.slice(1) : next;
    };

    useEffect(() => {
        setCount(entryItems.length);
    }, [entryItems.length, setCount]);

    useEffect(() => {
        console.log('VISIBLE ITEMS:', visibleEntryItems);
    }, [visibleEntryItems]);

    const clearRecivedState = useCallback(() => {

        setEntryItems([]);
        clearReceivedData();
        
        if(pendingSendRef.current) clearTimeout(pendingSendRef.current);
        if(retryRef.current) clearTimeout(retryRef.current);

        // console.log(`Itens na lista, ${entryItems}, qtd ${entryItems.length}`);
        // console.log(`Dados recebidos: ${receivedData?.value}`);

        return () => {
            if(pendingSendRef.current) clearTimeout(pendingSendRef.current);
            if(retryRef.current) clearTimeout(retryRef.current);
            setEntryItems([]);
            clearReceivedData();
        };

    }, [clearReceivedData]);

    const clearList = useCallback(() => {

        clearRecivedState();

        if(entryItems.length > 0){
            setEntryItems([]);
            // setVisibleEntryItems([]);
        }
    }, [clearRecivedState, entryItems.length]);

    const sendAllIDsToBackend = useCallback(async () => {

        try{
            setLoading(true);

            const ids = entryItems.map(item => [String(item.id).trim()]);
            if(ids[0].length === 0) return;

            console.log(`DADOS ENVIADOS: ${ids}`);
            console.log(`DADOS RENDERIZADOS: ${visibleEntryItems}`);
            await createRecord(ids);

            clearList();
            showPopup('Notificação!', 'Usuários enviados com sucesso!');

            if(retryRef.current) clearTimeout(retryRef.current);
        }
        catch(err: any){
            const appError = normalizeApiErrors(err);

            showPopup(`${appError.title} ${appError.status ? appError.status : ''}`, appError.message);

            if(retryRef.current) clearTimeout(retryRef.current);

            retryRef.current = setTimeout(() => {
                sendAllIDsToBackend();
            }, 5000);
        }
        finally{
            setLoading(false);
        }
        
    }, [clearList, entryItems, showPopup, visibleEntryItems]);

    useEffect(() => {

        if (entryItems.length === 0) return;

        if (pendingSendRef.current) {
            clearTimeout(pendingSendRef.current);
        }

        pendingSendRef.current = setTimeout(() => {
            sendAllIDsToBackend();
        }, 5000);

    }, [entryItems, sendAllIDsToBackend]);

    useEffect(() => {
        if(!receivedData?.value) return;

        const newItem: EntryItemType = {
            id: String(receivedData?.value),
            timestamp: receivedData.ts,
        };

        // impede duplicado simultâneo
        setEntryItems(prev => {
            const exists = prev.some(item => item.id === newItem.id);
            if (exists) return prev;
            return [...prev, newItem];
        });

        // adiciona mantendo apenas os 5 últimos
        setVisibleEntryItems(prev => {
            const exists = prev.some(item => item.id === newItem.id);
            if (exists) return prev;
            return pushWithLimit(prev, newItem, 5);
        });
        
    }, [receivedData]);

    return(
        <View style={{ flex: 1, position: 'relative' }}>
            {/* <Header subtitle={'Registros'}/> */}

            <View style={homeStyles.container}>

                <View style={homeStyles.listHeader}>
                    
                </View>

                <View style={homeStyles.entryPanel}>

                    <View style={homeStyles.panelHeader}>
                        <Text style={{ fontSize: 20 }}>Usuários recebidos</Text>
                    </View>

                    <FlatList
                        scrollEnabled={true}
                        nestedScrollEnabled={true}
                        data={visibleEntryItems}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => <EntryItem selectItem={() => null} entryItem={item} />}
                        contentContainerStyle={homeStyles.list}
                        // style={homeStyles.list} 
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
        backgroundColor: '#ffb54cff',
        padding: 16,
        gap: 16,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    listHeader: {
        width: '100%',
        height: '10%',
        backgroundColor: '#fff',
        borderRadius: 10,
        boxShadow: '0px 0px 3px #38383869',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 10,
        gap: 16,
    },
    entryPanel: {
        width: '100%',
        height: '85%',
        backgroundColor: '#fff',
        borderRadius: 10,
        boxShadow: '0px 0px 3px #38383869',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingTop: 10,
        paddingHorizontal: 5,
        gap: 16,
    },
    panelHeader: {
        width: '80%',
        height: '10%',
        borderBottomColor: '#b8b8b8ff',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    list: {
        width: '100%',
        gap: 12, 
        alignItems: 'center', 
        justifyContent: 'center', 
        alignContent: 'center',
        paddingTop: '5%',
    },
});

export default ListScreen;