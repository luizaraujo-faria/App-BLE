import { ActivityIndicator, View } from 'react-native';
import AppText from '../AppText';
import React from 'react';
import { AntDesignIcon } from '../Icons';
import styles from './styles';
import { appColors } from '@/src/themes/colors';

type DataType = {
    value: number,
    label: string,
}

interface InfoProps {
    data: DataType[];
    loading: boolean;
}

const InfoRecords = ({ data = [], loading }: InfoProps) => {

    const hasData = data.length > 0;

    const sorted = hasData
        ? [...data].sort((a, b) => b.value - a.value)
        : [];

    const totalRecords = hasData
        ? data.reduce((acc, cur) => acc + cur.value, 0)
        : 0;

    const biggestItem = sorted[0];
    const smallestItem = sorted[sorted.length - 1];

    const biggestValue = biggestItem?.value ?? 0;
    const smallestValue = smallestItem?.value ?? 0;

    const average = hasData
        ? (totalRecords / data.length).toFixed(1)
        : '0';

    const biggestName =
        biggestItem?.label?.trim().split(' ').slice(0, 2).join(' ') || 'N/A';

    const smallestName =
        smallestItem?.label?.trim().split(' ').slice(0, 2).join(' ') || 'N/A';

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
            }}
        >
            {loading ? (
                <View style={styles.loadCard}>
                    <ActivityIndicator
                        size='large'
                        color={appColors.primary}
                    />
                </View>
            ) : !hasData ? (
                <View style={styles.loadCard}>
                    <AppText
                        text='Nenhum dado disponível'
                        textStyle={{ color: '#fff', textAlign: 'center' }}
                    />
                </View>
            ) : (
                <View
                    style={{
                        height: '100%',
                        justifyContent: 'space-between',
                    }}
                >
                    <View style={styles.infoRecords}>
                        <AppText text={'Valores Gerais'} textStyle={{ color: '#fff' }} />

                        <View
                            style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <View style={{ gap: 15 }}>
                                <View style={styles.pointTexts}>
                                    <AntDesignIcon iconName='pinterest' iconColor={appColors.secondary} iconSize={6} />
                                    <AppText 
                                        text={`Total: ${totalRecords}`} 
                                        textStyle={styles.infoText}
                                    />
                                </View>

                                <View style={styles.pointTexts}>
                                    <AntDesignIcon iconName='pinterest' iconColor={appColors.secondary} iconSize={6} />
                                    <AppText 
                                        text={`Média: ${average}`} 
                                        textStyle={styles.infoText}
                                    />
                                </View>
                            </View>

                            <View style={{ gap: 15 }}>
                                <View style={styles.pointTexts}>
                                    <AntDesignIcon iconName='pinterest' iconColor={appColors.secondary} iconSize={6} />
                                    <AppText 
                                        text={`Maior: ${biggestValue}`} 
                                        textStyle={styles.infoText}
                                    />
                                </View>

                                <View style={styles.pointTexts}>
                                    <AntDesignIcon iconName='pinterest' iconColor={appColors.secondary} iconSize={6} />
                                    <AppText 
                                        text={`Menor: ${smallestValue}`} 
                                        textStyle={styles.infoText}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.infoRecords}>
                        <AppText text={'Parâmetros'} textStyle={{ color: '#fff' }} />

                        <View
                            style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <View style={{ gap: 15 }}>
                                <View style={styles.pointTexts}>
                                    <AntDesignIcon iconName='pinterest' iconColor={appColors.secondary} iconSize={6} />
                                    <AppText 
                                        text={`Maior: ${biggestName}`} 
                                        textStyle={styles.infoText}
                                    />
                                </View>

                                <View style={styles.pointTexts}>
                                    <AntDesignIcon iconName='pinterest' iconColor={appColors.secondary} iconSize={6} />
                                    <AppText 
                                        text={`Menor: ${smallestName}`} 
                                        textStyle={styles.infoText}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

export default InfoRecords;