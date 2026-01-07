import { appColors } from '@/src/themes/colors';
import React from 'react';
import { Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

type Props = {
    data: any[];
    containerWidth: number;
};

export const Barchart = ({ data, containerWidth }: Props) => {

    const chartData = data.map(item => ({
        label: item.label,
        value: item.value,
    }));
    
    const screenHeight = Dimensions.get('window').height;

    return (
        <BarChart 
            // horizontal
            data={chartData} 
            // Dimensões
            width={containerWidth - 70}
            height={screenHeight * 0.35}
            barWidth={35}
            // Barra
            frontColor={appColors.primary}
            barBorderTopLeftRadius={4}
            barBorderTopRightRadius={4}
            // Valores no topo da barra
            topLabelTextStyle={{ 
                fontSize: 12, 
                color: '#000', 
                position: 'absolute',
                bottom: '0%',
            }}
            showValuesAsTopLabel
            // Espaçamento
            spacing={20}
            initialSpacing={25}
            noOfSections={4}
            barMarginBottom={2}
            // Eixo X
            xAxisLabelTextStyle={{ fontSize: 10 }}
            xAxisThickness={1}
            xAxisColor={'#b3b3b365'}
            // Eixo Y
            yAxisTextStyle={{ color: '#000000ff' }}
            yAxisColor={'#b3b3b365'}
            yAxisThickness={0}
            showYAxisIndices
            // Animação
            isAnimated
            // Linhas
            rulesThickness={1}
            showVerticalLines
            verticalLinesColor={appColors.tertiary}
        />
    );
};