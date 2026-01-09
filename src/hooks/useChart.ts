import { useCallback, useEffect, useState } from 'react';
import { getMealsBySectors } from '@/src/services/recordsService';
import { mapToBarData } from '@/src/components/Charts/ChartMapper';
import { usePopup } from '../contexts/PopupContext';
import { normalizeApiErrors } from '../services/apiErrors';

export const useChart = () => {

    const { showPopup } = usePopup();

    const [month, setMonth] = useState('1');
    const [turn, setTurn] = useState('');
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const loadMealsOfAllSectors = useCallback(async () => {

        try{
            setLoading(true);
            const res = await getMealsBySectors(month, turn);

            setData(mapToBarData(res.data.data, 'sector', 'total'));
        } 
        catch(err: any){
            const appError = normalizeApiErrors(err);
            showPopup(`${appError.title} ${appError.status ? appError.status : ''}`, appError.message);
        } 
        finally{
            setLoading(false);
        }
    }, [month, showPopup, turn]);

    useEffect(() => {
        loadMealsOfAllSectors();
    }, [loadMealsOfAllSectors, month]);

    return {
        data, 
        loading,
        month,
        turn, 
        setMonth, 
        setTurn,
        setData,
    };
};