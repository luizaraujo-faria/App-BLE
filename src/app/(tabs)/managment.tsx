import { Barchart, Piechart } from '@/src/components/Charts';
import { useChart } from '@/src/hooks/useChart';
import { appColors } from '@/src/themes/colors';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppText from '@/src/components/AppText';
import { appFonts } from '@/src/themes/fonts';
import Filters from '@/src/components/Filters';
import dayjs from 'dayjs';
import InfoRecords from '@/src/components/InfoRecords';
// import { AntDesignIcon, MaterialCommunityIcon } from '@/src/components/Icons';

const ManagmentScreen = () => {

    const currentMonth: string = String(dayjs().month() + 1);

    const [dataSearch, setDataSearch] = useState('1');
    const [turn, setTurn] = useState('');
    const [month, setMonth] = useState(currentMonth);
    const [containerWidth, setContainerWidth] = useState(0);
    const screenHeight = Dimensions.get('window').height;

    const { data, loading, refetch } = useChart(dataSearch, month, turn);

    return (
        <LinearGradient 
            colors={[appColors.secondary, appColors.primary, appColors.primary]}
            style={styles.container}>

            <Filters 
                month={month} 
                turn={turn}
                data={dataSearch}
                onMonthChange={setMonth}
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
                        const { width } = event.nativeEvent.layout;

                        setContainerWidth(prev => (
                            prev !== width ? width : prev
                        ));
                    }}
                >

                    <Barchart 
                        data={data} 
                        containerWidth={containerWidth}
                        screenHeight={screenHeight}
                        loading={loading}
                    />
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

                <View style={styles.pieChartContainer}>
                    <Piechart 
                        data={data} 
                        loading={loading}
                        containerWidth={0}
                        screenHeight={0} 
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
        justifyContent: 'flex-start',
        paddingVertical: 16,
        paddingHorizontal: 10,
        gap: 10,
    },
    chartContainer: {
        width: '100%',
        height: '50%',
        maxHeight: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        // boxShadow: appColors.shadow,
        overflow: 'hidden',
    },
    chartTitle: {
        width: '55%',
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingTop: 10,
        borderBottomWidth: 0.6,
        borderBottomColor: appColors.primary,
    },
    chart: {
        width: '100%',
        minHeight: 320,
        maxHeight: 330,
        // boxShadow: appColors.shadow,
        borderRadius: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '5%',
        paddingBottom: '5%',
    },
    bottomArea: {
        width: '100%',
        height: '32%',
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

});

export default ManagmentScreen;