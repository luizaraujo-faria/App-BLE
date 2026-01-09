import { useCallback, useEffect, useState } from 'react';
import { getMealsBySectors } from '@/src/services/recordsService';
import { mapToBarData } from '@/src/components/Charts/ChartMapper';
import { usePopup } from '../contexts/PopupContext';
import { normalizeApiErrors } from '../services/apiErrors';
import React from 'react';

export const useChart = (month: string, turn?: string) => {

    const { showPopup } = usePopup();

    const [apiData, setApiData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const loadMealsOfAllSectors = useCallback(async (vMonth: string, vTurn?: string) => {
        // if(loading) return;

        try{
            setLoading(true);

            const serializedTurn = vTurn === '1' ? 'cafe_da_manha' 
                : vTurn === '2' ? 'almoco' 
                    : vTurn === '3' ? 'cafe_da_tarde' : '';

            const res = await getMealsBySectors(vMonth, serializedTurn);

            setApiData(res.data.data);
            return;
        } 
        catch(err: any){
            const appError = normalizeApiErrors(err);
            showPopup(`${appError.title} ${appError.status ? appError.status : ''}`, appError.message);
        } 
        finally{
            setLoading(false);
        }
    }, [showPopup]);

    useEffect(() => {
        loadMealsOfAllSectors(month, turn);
    }, [loadMealsOfAllSectors, month, turn]);

    const data = React.useMemo(() => {
        return mapToBarData(apiData, 'sector', 'total');
    }, [apiData]);

    return {
        data, 
        loading,
        month,
        turn,
        refetch: loadMealsOfAllSectors,
    };
};