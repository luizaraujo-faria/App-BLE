import AppText from '@/src/components/AppText';
import EntryItem from '@/src/components/EntryItem';
import { MaterialCommunityIcon } from '@/src/components/Icons';
import { useBleContext } from '@/src/contexts/BleContext';
import { useList } from '@/src/contexts/ListContext';
import { usePopup } from '@/src/contexts/PopupContext';
import { normalizeApiErrors } from '@/src/services/apiErrors';
import { createRecord } from '@/src/services/recordsService';
import { appColors } from '@/src/themes/colors';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
        <LinearGradient 
            colors={[appColors.secondary, appColors.primary, appColors.primary]}
            style={{ flex: 1, position: 'relative' }}>
            <View style={styles.container}>

                <View style={styles.entryList}>

                    <View style={styles.topBar}>
                        <AppText 
                            text='Total de passagens na lista' 
                            textStyle={{ fontSize: 20, color: '#fff' }} />

                        <View 
                            style={{ 
                                width: '15%', 
                                height: '75%', 
                                backgroundColor: '#fff',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10,
                            }}
                        >
                            <MaterialCommunityIcon iconName='human-queue' iconColor={appColors.quintenary} iconSize={24} />
                            <View style={styles.badge}>
                                <AppText text={count} textStyle={styles.badgeText} />
                            </View>
                        </View>
                    </View>

                    <View style={styles.listHeader}>
                        <AppText 
                            text={'Últimas 5 passagens'}
                            textStyle={{ fontSize: 22 }}
                        />
                    </View>

                    {visibleEntryItems.length === 0 ? (
                        <View 
                            style={{
                                width: '100%',
                                height: '50%',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <AppText 
                                text={'Nenhum item na lista!'}
                                textStyle={{ fontSize: 22, textAlign: 'center' }}
                            />
                        </View>
                    ) : (
                        <FlatList
                            scrollEnabled={true}
                            nestedScrollEnabled={true}
                            data={visibleEntryItems}
                            keyExtractor={(item) => item.listKey}
                            renderItem={({ item }) => <EntryItem selectItem={() => null} entryItem={item} />}
                            contentContainerStyle={styles.list}
                        />
                    )}

                    {loading && (
                        <View style={styles.loadingBar}>
                            <ActivityIndicator size='large' color={appColors.primary} />
                            <AppText 
                                text={'Enviando dados...'} 
                                textStyle={{ color: appColors.primary, fontSize: 20 }} 
                            />
                        </View>
                    )}
                </View>
                
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 16,
        gap: 16,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    topBar: {
        width: '100%',
        height: '10%',
        backgroundColor: appColors.quintenary,
        // borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        padding: 10,
        gap: 20,
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        minWidth: 20,
        height: 20,
        borderRadius: '100%',
        backgroundColor: appColors.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
    },
    listHeader: {
        width: '80%',
        height: '8%',
        borderBottomColor: appColors.quintenary,
        borderBottomWidth: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    entryList: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 20,
        overflow: 'hidden',
        position: 'relative',
    },
    list: {
        width: '100%',
        gap: 10, 
        alignItems: 'center', 
        justifyContent: 'center', 
        alignContent: 'center',
        paddingTop: '5%',
        paddingHorizontal: 10,
    },
    loadingBar: {
        width: '100%',
        height: '12%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#69696917',
        position: 'absolute',
        bottom: '0%',
    },
});

export default ListScreen;