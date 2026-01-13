import { appColors } from '@/src/themes/colors';
import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import AppText from '../AppText';
import { AntDesignIcon } from '../Icons';

type Props = {
    data: any[] | null;
    containerWidth?: number;
    containerHeight?: number;
    loading: boolean;
};

export const Barchart = React.memo(({ data, containerWidth, containerHeight, loading }: Props) => {

    
    const chartData = data?.map(item => ({
        label: item.label,
        value: item.value,
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
        <BarChart 
            data={chartData} 
            // Dimensões
            width={containerWidth! - 50}
            height={containerHeight! - 65}
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
            spacing={20}
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
    );
});

export const Piechart = React.memo(({ data, loading }: Props) => {
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

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
    const top5 = data.slice(0, 5);
    const rest = data.slice(5);

    const total = data.reduce((acc, cur) => acc + cur.value, 0);
    const restTotal = rest.reduce((acc, cur) => acc + cur.value, 0);
    const restPercent = Math.round((restTotal / total) * 100);

    const colors = [
        appColors.primary,
        appColors.secondary,
        appColors.quintenary,
        '#e28127ff',
        '#ad4a08ff',
    ];

    // TOP 5
    const baseData = top5.map((item, index) => ({
        value: Math.round((item.value / total) * 100),
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

        if (focusedIndex !== index) {
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
            <PieChart
                data={pieData}
                donut
                radius={baseRadius}
                innerRadius={50}
                innerCircleColor='#fff'
                showText
                textSize={12}
                labelsPosition='onBorder'
                isAnimated
                onPress={(_: any, index: React.SetStateAction<number | null>) => setFocusedIndex(index)}
                centerLabelComponent={() => (
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        {selected ? (
                            <>
                                <AppText
                                    text={`${selected.value}%`}
                                    textStyle={{ fontSize: 22, fontWeight: '700' }}
                                />
                                <AppText
                                    text={selected.label}
                                    textStyle={{ fontSize: 15, color: '#353535ff' }}
                                />
                            </>
                        ) : (
                            <AppText
                                text='Top 5'
                                textStyle={{ fontSize: 22, color: '#000' }}
                            />
                        )}
                    </View>
                )}
            />

            {/* --------- RESTANTE (FORA DO GRÁFICO) --------- */}
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
