import { useCallback, useEffect, useState } from 'react';
import { getMealsByCollaborators, getMealsByCollaboratorType, getMealsBySectors } from '@/src/services/recordsService';
import { mapToBarData } from '@/src/components/Charts/ChartMapper';
import { usePopup } from '../contexts/PopupContext';
import { normalizeApiErrors } from '../services/apiErrors';
import React from 'react';

export const useChart = (dataSearch: string, month: string, turn?: string) => {

    const { showPopup } = usePopup();

    const [apiData, setApiData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchMap: any = {
        '1': { fetch: getMealsBySectors, key: 'sector' },
        '2': { fetch: getMealsByCollaborators, key: 'collaborator' },
        '3': { fetch: getMealsByCollaboratorType, key: 'type' },
    } as const;

    const serializeTurn = (turn?: string) => {
        switch (turn) {
        case '1': return 'cafe_da_manha';
        case '2': return 'almoco';
        case '3': return 'cafe_da_tarde';
        default: return '';
        }
    };

    const fetchData = useCallback(async () => {

        try{
            setLoading(true);

            const fetchFn = fetchMap[dataSearch];
            if(!fetchFn){
                setApiData([]);
                return;
            }

            const serializedTurn = serializeTurn(turn);

            const res = await fetchFn.fetch(month, serializedTurn);

            const newData = Array.isArray(res.data?.data)
                ? res.data.data
                : [];

            setApiData(newData);
        } 
        catch(err: any){
            const appError = normalizeApiErrors(err);
            showPopup(`${appError.title} ${appError.status ?? ''}`, appError.message);
            setApiData([]);
        } 
        finally{
            setLoading(false);
        }
    }, [dataSearch, month, turn]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const data = React.useMemo(() => {
        const fetchFn = fetchMap[dataSearch];
        if(!fetchFn) return null;

        return mapToBarData(apiData, fetchFn.key, 'total');
    }, [apiData, dataSearch, fetchMap]);
    
    return {
        data, 
        loading,
        month,
        turn,
        refetch: fetchData,
    };
};