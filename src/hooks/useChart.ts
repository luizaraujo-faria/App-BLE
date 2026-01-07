import { useEffect, useState } from 'react';
import { getMealsBySectors } from '@/src/services/recordsService';
import { mapToHorizontalBarData } from '@/src/components/Charts/ChartMapper';

export const useMealChart = (month: string, turn?: string) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try{
                const res = await getMealsBySectors(month, turn);
                // console.log('API RESPONSE:', res.data);
                setData(
                    mapToHorizontalBarData(res.data.data, 'sector', 'total'),
                );
            } 
            catch(err){
                console.error(err);
            } 
            finally{
                setLoading(false);
            }
        };

        load();
    }, [month]);

    return { data, loading };
};