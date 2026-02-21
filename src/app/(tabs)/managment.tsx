import { Barchart, Piechart, AreaChart } from '@/src/components/Charts';
import { useChart } from '@/src/hooks/useChart';
import { appColors } from '@/src/themes/colors';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppText from '@/src/components/AppText';
import { appFonts } from '@/src/themes/fonts';
import Filters from '@/src/components/Filters';
import dayjs from 'dayjs';
import InfoRecords from '@/src/components/InfoRecords';

const ManagmentScreen = () => {

    const currentDate: string = String(dayjs().format('MM/YYYY'));

    const [dataSearch, setDataSearch] = useState<string>('1');
    const [turn, setTurn] = useState<string>('');
    const [date, setDate] = useState<string>(currentDate);
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const [containerHeight, setContainerHeight] = useState<number>(0);


    const { data, loading, refetch } = useChart(dataSearch, date, turn);

    const pieDisabled = dataSearch === '4' ? true : false;
    const canRenderChart =
        containerWidth > 0 &&
        containerHeight > 0 &&
        data!.length > 0;

    return (
        <LinearGradient 
            colors={[appColors.secondary, appColors.primary, appColors.primary]}
            style={styles.container}>

            <Filters 
                currentDate={currentDate}
                date={date} 
                turn={turn}
                data={dataSearch}
                onDateChange={setDate}
                onTurnChange={setTurn}
                onDataChange={setDataSearch}
                onReload={refetch}    
            />

            <View style={styles.chartContainer}>
                <View style={styles.chartTitle}>
                    <AppText 
                        text={'Dados do Refeitório'} 
                        textStyle={{
                            fontSize: 22,
                            textAlign: 'center',
                            fontFamily: appFonts.afacadReg,
                        }}
                    />
                </View>

                <View 
                    style={styles.chart}
                    onLayout={(event) => {
                        const { width, height } = event.nativeEvent.layout;

                        setContainerWidth(prev => (
                            prev !== width ? width : prev
                        ));
                        setContainerHeight(prev => (
                            prev !== height ? height : prev
                        ));
                    }}
                >
                    {dataSearch === '4' ? (
                        <AreaChart
                            data={data!}
                            containerWidth={containerWidth}
                            containerHeight={containerHeight}
                            loading={loading}
                            canRender={canRenderChart}
                        />
                    ) : (
                        <Barchart 
                            data={data!} 
                            containerWidth={containerWidth}
                            containerHeight={containerHeight}
                            loading={loading}
                            canRender={canRenderChart}
                        />
                    )}
                </View>
            </View>

            <View style={styles.bottomArea}>

                <View
                    style={{
                        width: '48%',
                        height: '100%',
                    }}
                >
                    <InfoRecords data={data!} loading={loading} />
                </View>

                <View 
                    style={[styles.pieChartContainer, pieDisabled && styles.pieDisabled]}
                >
                    <Piechart 
                        data={data!} 
                        loading={loading}
                        containerHeight={0}
                        canRender={canRenderChart} 
                        disabled={pieDisabled}
                    />
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 10,
        gap: '1%',
    },
    chartContainer: {
        width: '100%',
        height: '50%',
        maxHeight: '50%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
    },
    chartTitle: {
        width: '55%',
        height: '10%',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#c25555',
        borderBottomWidth: 0.6,
        borderBottomColor: appColors.primary,
        position: 'relative',
    },
    chart: {
        width: '100%',
        minHeight: '80%',
        maxHeight: '95%',
        // backgroundColor: '#9b3b3b',
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '5%',
        paddingBottom: '5%',
    },
    bottomArea: {
        width: '100%',
        height: '40%',
        maxHeight: '32%',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        borderRadius: 10,
        flexDirection: 'row',
    },
    pieChartContainer: {
        width: '50%',
        height: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        // boxShadow: appColors.shadow,
    },
    pieDisabled: {
        backgroundColor: appColors.primaryDisabled,
    },
});

export default ManagmentScreen;