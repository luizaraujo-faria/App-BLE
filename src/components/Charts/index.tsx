import { appColors } from '@/src/themes/colors';
import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { BarChart, PieChart, LineChart, CurveType } from 'react-native-gifted-charts';
import AppText from '../AppText';
import { AntDesignIcon } from '../Icons';
import { appFonts } from '@/src/themes/fonts';

type DataType = {
    value: number,
    label: string,
}

interface ChartProps {
    data: DataType[];
    containerWidth?: number;
    containerHeight?: number;
    loading: boolean;
    canRender?: boolean;
    disabled?: boolean;
};

export const Barchart = React.memo(({ data, containerWidth, containerHeight, loading, canRender }: ChartProps) => {

    const colors = [
        appColors.primary,
        appColors.secondary,
        '#ad4a08ff',
        '#e28127ff',
        appColors.quaternary,
    ];

    const chartData = data?.map((item, index) => ({
        label: item.label,
        value: item.value,
        frontColor: index < colors.length
            ? colors[index]
            : appColors.quintenary,
    }));

    const maxValue = React.useMemo(() => {
        if (!chartData || chartData.length === 0) return 0;
        return Math.max(...chartData.map(item => item.value));
    }, [chartData]);

    if(loading){
        return(
            <View style={{ 
                width: '100%',
                height: '100%',
                alignItems: 'center', 
                justifyContent: 'center',
            }}>
                <ActivityIndicator size={'large'} color={appColors.primary} />
            </View>
        );
    };

    if(!loading && data?.length === 0 ){
        return(
            <View style={{ 
                width: '100%',
                height: '100%',
                alignItems: 'center', 
                justifyContent: 'center',
            }}>
                <AppText text={'Nenhum dado carregado!'} />
            </View>
        );
    }

    const shouldAnimate = chartData!.length < 10;

    return (
        <>
            {canRender && ( 
                <BarChart 
                    data={chartData} 
                    // Dimensões
                    width={containerWidth! - 50}
                    height={containerHeight! - 70}
                    barWidth={35}
                    // Barra
                    frontColor={appColors.quintenary}
                    barBorderTopLeftRadius={4}
                    barBorderTopRightRadius={4}
                    // Valores no topo da barra
                    topLabelTextStyle={{ 
                        fontSize: 12, 
                        color: '#000', 
                        position: 'absolute',
                        bottom: '0%',
                        paddingTop: 10,
                    }}
                    maxValue={maxValue}
                    showValuesAsTopLabel
                    // Espaçamento
                    spacing={24}
                    initialSpacing={20}
                    endSpacing={0}
                    noOfSections={4}
                    // barMarginBottom={2}
                    // Eixo X
                    xAxisLabelTextStyle={{ fontSize: 10 }}
                    xAxisThickness={1}
                    xAxisColor={'#b3b3b365'}
                    // Eixo Y
                    yAxisTextStyle={{ color: '#000000ff' }}
                    yAxisColor={'#b3b3b365'}
                    yAxisThickness={0.8}
                    showYAxisIndices
                    // Animação
                    isAnimated={shouldAnimate}
                    animationDuration={600}
                    // Linhas
                    rulesThickness={1}
                    rulesColor={'#e0e0e0b0'}
                    rulesType='solid'
                    showVerticalLines
                    verticalLinesColor={appColors.tertiary}
                />
            )}
        </>
    );
});

export const Piechart = React.memo(({ data, loading, canRender, disabled }: ChartProps) => {
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    if(disabled){
        return (
            <AppText
                text={'Sem Informação'}
                textStyle={{ color: '#fff' }}
            />
        );
    }

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size='large' color={appColors.primary} />
            </View>
        );
    }

    if (!data || data.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <AppText text='Nenhum dado disponível' textStyle={{ textAlign: 'center' }}/>
            </View>
        );
    }

    // PREPARAÇÃO DOS DADOS
    const top5 = [...data].sort((a, b) => b.value - a.value).slice(0, 5);
    const rest = data.slice(5);

    const total = data.reduce((acc, cur) => acc + cur.value, 0);
    const restTotal = rest.reduce((acc, cur) => acc + cur.value, 0);
    const restPercent = ((restTotal / total) * 100).toPrecision(3);

    const colors = [
        appColors.primary,
        appColors.secondary,
        '#ad4a08ff',
        '#e28127ff',
        appColors.quaternary,
    ];

    // TOP 5
    const baseData = top5.map((item, index) => ({
        value: (item.value / total) * 100,
        color: colors[index],
        label: `${index + 1}º`,
    }));

    // FOCO: AUMENTO DE RAIO + SHIFT RADIAL
    let cumulative = 0;
    const baseRadius = 85;
    const focusedRadius = 95;
    const shiftOffset = 4;

    const pieData = baseData.map((item, index) => {
        const startAngle = (cumulative / 100) * 360;
        const sliceAngle = (item.value / 100) * 360;
        const midAngle = startAngle + sliceAngle / 2;
        cumulative += item.value;

        if(focusedIndex !== index){
            return {
                ...item,
                radius: baseRadius,
            };
        }

        const rad = (midAngle * Math.PI) / 180;

        return {
            ...item,
            radius: focusedRadius,
            shiftX: Math.cos(rad) * shiftOffset,
            shiftY: Math.sin(rad) * shiftOffset,
        };
    });

    const selected = focusedIndex !== null ? pieData[focusedIndex] : null;

    return (
        <View style={{ alignItems: 'center' }}>
            {/* --------- GRÁFICO --------- */}
            {canRender && (
                <PieChart
                    data={pieData}
                    donut
                    radius={baseRadius / 1.05}
                    innerRadius={52.5}
                    innerCircleColor='#fff'
                    showText
                    textSize={12}
                    labelsPosition='onBorder'
                    isAnimated
                    animationDuration={1000}
                    onPress={(_: any, index: React.SetStateAction<number | null>) => setFocusedIndex(index)}
                    centerLabelComponent={() => (
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            {selected ? (
                                <>
                                    <AppText
                                        text={`${selected.value.toPrecision(3)}%`}
                                        textStyle={{ fontSize: 22, fontWeight: '700' }}
                                    />
                                    <AppText
                                        text={selected.label}
                                        textStyle={{ fontSize: 15, color: '#353535ff' }}
                                    />
                                </>
                            ) : (
                                <View>
                                    <AppText
                                        text='Top 5'
                                        textStyle={{ fontSize: 22, color: '#000', textAlign: 'center' }}
                                    />
                                    <AppText
                                        text='Toque para ver'
                                        textStyle={{ fontSize: 12, color: '#6b6b6b', textAlign: 'center' }}
                                    />
                                </View>
                            )}
                        </View>
                    )}
                />
            )}

            {restTotal > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: '5%' }}>
                    <AntDesignIcon iconName='pinterest' iconColor='#474747ff' iconSize={10} />
                    <AppText
                        text={`Restante: ${restPercent}%`}
                        textStyle={{ fontSize: 14, color: '#474747ff' }}
                    />
                </View>
            )}
        </View>
    );
});

export const AreaChart = ({
    data,
    containerWidth,
    containerHeight,
    loading,
    canRender,
}: ChartProps) => {

    if (loading) {
        return (
            <View style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <ActivityIndicator size='large' color={appColors.primary} />
            </View>
        );
    }

    if (!loading && (!data || data.length === 0)) {
        return (
            <View style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <AppText text='Nenhum dado carregado!' />
            </View>
        );
    }

    const shouldAnimate = data.length < 15;
    const shouldRotate = data.length > 6;
    const maxValue = Math.max(...data.map(item => item.value));
    const spacing = (containerWidth! + 50) / data.length;

    return (
        <>
            {canRender && (
                <LineChart
                    areaChart
                    curved={true}
                    curveType={CurveType.QUADRATIC}
                    data={data}
                    width={containerWidth! - 50}
                    height={containerHeight! - 70}
                    spacing={spacing}
                    initialSpacing={15}
                    endSpacing={10}
                    hideDataPoints
                    color={appColors.quintenary}
                    thickness={0}
                    startFillColor={appColors.primarydark}
                    endFillColor={appColors.primary}
                    startOpacity={1}
                    endOpacity={0.6}
                    maxValue={maxValue}
                    noOfSections={3}

                    xAxisLabelTextStyle={{
                        fontSize: 11,
                        textAlign: 'center',
                        marginTop: 0,
                        marginLeft: -10,
                        height: '100%',
                        width: '100%',
                        fontFamily: appFonts.afacadSemiBold,
                    }}
                    labelsExtraHeight={5}
                    xAxisLabelsHeight={30}
                    xAxisColor={'#b3b3b365'}
                    xAxisThickness={1}
                    rotateLabel={shouldRotate}

                    yAxisColor={'#b3b3b365'}
                    yAxisThickness={0.8}
                    yAxisTextStyle={{ color: '#000' }}

                    rulesThickness={1}
                    rulesColor={'#e0e0e0b0'}
                    showVerticalLines
                    verticalLinesColor={appColors.tertiary}
                    isAnimated={shouldAnimate}
                    animateOnDataChange
                    animationDuration={1000}
                    onDataChangeAnimationDuration={300}
                    pointerConfig={{
                        activatePointersOnLongPress: true,
                        pointerVanishDelay: 500,
                        initialPointerAppearDelay: 50,
                        activatePointersDelay: 50,
                        pointerStripColor: '#41414165',
                        pointerStripHeight: containerHeight! - 150,
                        stripBehindBars: true,
                        pointerColor: appColors.quintenary,
                        radius: 6,
                        pointerLabelComponent: (items: any) => {
                            const item = items[0];
                            return (
                                <View style={{
                                    height: 25,
                                    width: 100,
                                    justifyContent: 'center',
                                    marginTop: -30,
                                    marginLeft: containerWidth! - 430,
                                    alignItems: 'center',
                                }}>
                                    <AppText text={item.label} textStyle={{ fontSize: 16, textAlign: 'center' }}/>
                                    <View style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: 16,
                                        backgroundColor: appColors.quintenary,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <AppText 
                                            text={item.value} 
                                            textStyle={{
                                                color: '#fff',
                                                textAlign: 'center',
                                            }}
                                        />
                                    </View>
                                </View>
                            );
                        },
                    }}
                />
            )}
        </>
    );
};