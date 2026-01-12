import { AntDesignIcon } from '@/src/components/Icons';
import { appColors } from '@/src/themes/colors';
import dayjs from 'dayjs';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import styles from './styles';
import AppText from '../AppText';

type EntryItemType = {
    id: string;
    timestamp?: number;
}

interface EntryItemProps {
    entryItem: EntryItemType;
    selectItem: (item: EntryItemType) => void;
}

const EntryItem = ({ entryItem, selectItem }: EntryItemProps) => {
    
    return (
        <Animated.View 
            entering={FadeInDown.duration(550)}
            exiting={FadeOutUp.duration(350)}
            style={styles.entryItemCard}
        >
            <TouchableOpacity onPress={() => selectItem(entryItem)} style={{ width: '100%', height: '100%' }}>
                <View style={styles.inner}>
                    <View style={styles.id}>

                        <AppText 
                            text={'ID: '} 
                            textStyle={{ color: appColors.secondary, fontSize: 20 }}
                        />
                        <AppText 
                            text={`${entryItem.id}`} 
                            textStyle={styles.text}
                        />

                    </View>
                    <View style={styles.time}>

                        <AntDesignIcon 
                            iconName='clock-circle' 
                            iconSize={18} 
                            iconColor={appColors.secondary} 
                        />
                        <AppText 
                            text={`${dayjs(entryItem.timestamp).format('HH:mm')}`}
                            textStyle={styles.text}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default EntryItem;