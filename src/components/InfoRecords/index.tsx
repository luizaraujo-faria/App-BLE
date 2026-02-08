import { ActivityIndicator, View } from 'react-native';
import AppText from '../AppText';
import React from 'react';
import { AntDesignIcon } from '../Icons';
import styles from './styles';
import { appColors } from '@/src/themes/colors';

interface InfoProps {
    data: any[];
    loading: boolean;
}

const InfoRecords = ({ data, loading }: InfoProps) => {

    const totalRecords = data?.reduce((acc, cur) => acc + cur.value, 0) ?? 0;
    const biggest = data && data.length > 0 ? data![0].value : 0;
    const smallest = data && data.length > 0 ? data![data!.length - 1].value : 0;
    const avarage = data && data.length > 0 ? (totalRecords / data.length).toFixed(1) : 0;

    const biggestName = data && data.length > 0 && data !== null
        ? data![0].label.trim().split(' ').slice(0, 2).join(' ') : 'N/A';
    const smallestName = data && data.length > 0 
        ? data![data!.length - 1].label.trim().split(' ').slice(0, 2).join(' ') : 'N/A';

    return(
        <View style={{
            height: '100%',
            justifyContent: 'space-between',
        }}>
            <View style={styles.infoRecords}>

                <AppText text={'Visão Geral'} textStyle={{ color: '#fff' }} />

                {loading ? (
                    <View style={{ 
                        width: '100%',
                        height: '100%',
                        alignItems: 'center', 
                        justifyContent: 'center',
                    }}>
                        <ActivityIndicator size={'small'} color={appColors.primary} />
                    </View>
                ) : (
                    <View
                        style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <View style={{ gap: '15%' }}>
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
                                    text={`Média: ${avarage}`} 
                                    textStyle={styles.infoText}
                                />
                            </View>
                        </View>
                        <View style={{ gap: '10%' }}>
                            <View style={styles.pointTexts}>
                                <AntDesignIcon iconName='pinterest' iconColor={appColors.secondary} iconSize={6} />
                                <AppText 
                                    text={`Maior: ${biggest}`} 
                                    textStyle={styles.infoText}
                                />
                            </View>
                            <View style={styles.pointTexts}>
                                <AntDesignIcon iconName='pinterest' iconColor={appColors.secondary} iconSize={6} />
                                <AppText 
                                    text={`Menor: ${smallest}`} 
                                    textStyle={styles.infoText}
                                />
                            </View>
                        </View>
                    </View>
                )}
            </View>

            <View style={styles.infoRecords}>
            
                <AppText text={'Nomes'} textStyle={{ color: '#fff' }} />

                {loading ? (
                    <View style={{ 
                        width: '100%',
                        height: '100%',
                        alignItems: 'center', 
                        justifyContent: 'center',
                    }}>
                        <ActivityIndicator size={'small'} color={appColors.primary} />
                    </View>
                ) : (
                    <View
                        style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <View style={{ gap: '15%' }}>
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
                )}
            </View>
        </View>
    );
};

export default InfoRecords;