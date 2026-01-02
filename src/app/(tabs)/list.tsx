import React from 'react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, FlatList, ActivityIndicator } from 'react-native';
import EntryItem from '@/src/components/EntryItem';
import { createRecord } from '@/src/services/recordsService';
import { useBleContext } from '@/src/contexts/BleContext';
import { usePopup } from '@/src/contexts/PopupContext';
import { normalizeApiErrors } from '@/src/services/apiErrors';
import { useList } from '@/src/contexts/ListContext';
import { appColors } from '@/src/styles/styles';
import { AntDesignIcon } from '@/src/components/Icons';

type EntryItemType = {
    id: string;
    timestamp?: number;
    listKey: string;
}

const ListScreen = () => {
    
    const { receivedData, clearReceivedData } = useBleContext();
    const { showPopup } = usePopup();
    const { setCount } = useList();
    const { count } = useList();

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
        
    }, [clearList, entryItems, showPopup]);

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
            listKey: `${receivedData.value}-${receivedData.ts}`,
        };

        // impede duplicado simultâneo
        setEntryItems(prev => {
            const exists = prev.some(item => item.id === newItem.id);
            if (exists) return prev;
            return [...prev, newItem];
        });

        // adiciona mantendo apenas os 5 últimos
        setVisibleEntryItems(prev => {
            const exists = prev.some(item => 
                item.id === newItem.id && item.timestamp === newItem.timestamp);
            if (exists) return prev;
            return pushWithLimit(prev, newItem, 5);
        });
        
    }, [receivedData]);

    return(
        <View style={{ flex: 1, position: 'relative' }}>

            <View style={styles.container}>

                <View style={styles.topBar}>
                    
                    <Text style={styles.headerText}>
                        Total de passagens
                        na lista
                    </Text>

                    <View 
                        style={{ 
                            width: '15%', 
                            height: '85%', 
                            backgroundColor: appColors.tertiary,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 10,
                        }}
                    >
                        <AntDesignIcon iconName='login' iconColor='#000' iconSize={24} />
                        <View style={styles.badge}>
                            
                            <Text style={styles.badgeText}>
                                {count}
                            </Text>
                        </View>
                    </View>

                </View>

                <View style={styles.entryList}>

                    <View style={styles.listHeader}>
                        <Text style={styles.headerText}>Últimas 5 passagens</Text>
                    </View>

                    <FlatList
                        scrollEnabled={true}
                        nestedScrollEnabled={true}
                        data={visibleEntryItems}
                        keyExtractor={(item) => item.listKey}
                        renderItem={({ item }) => <EntryItem selectItem={() => null} entryItem={item} />}
                        contentContainerStyle={styles.list}
                        // style={styles.list} 
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appColors.primary,
        padding: 16,
        gap: 16,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    topBar: {
        width: '100%',
        height: '10%',
        backgroundColor: '#fff',
        borderRadius: 10,
        boxShadow: appColors.shadow,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        padding: 10,
        gap: 16,
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        minWidth: 20,
        height: 20,
        borderRadius: '100%',
        backgroundColor: appColors.quaternary,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    listHeader: {
        width: '80%',
        height: '10%',
        borderBottomColor: appColors.primary,
        borderBottomWidth: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    entryList: {
        width: '100%',
        height: '85%',
        backgroundColor: '#fff',
        borderRadius: 10,
        boxShadow: appColors.shadow,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingTop: 10,
        gap: 16,
    },
    headerText: {
        fontSize: 24,
        fontFamily: 'AfacadFlux',
    },
    list: {
        width: '100%',
        gap: 12, 
        alignItems: 'center', 
        justifyContent: 'center', 
        alignContent: 'center',
        paddingTop: '5%',
        paddingHorizontal: 2,
    },
});

export default ListScreen;