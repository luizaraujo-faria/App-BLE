import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import dayjs from 'dayjs';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { AntDesignIcon } from '@/src/components/Icons';
import styles from './styles';
import { appColors } from '@/src/styles/styles';

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
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>
                            <Text style={{ color: appColors.primary, fontSize: 22 }}>ID:</Text>
                            {entryItem.id}
                        </Text>
                    </View>
                    <View style={styles.time}>
                        <AntDesignIcon 
                            iconName='clock-circle' 
                            iconSize={18} 
                            iconColor={appColors.primary} 
                        />
                        <Text style={styles.text}>{dayjs(entryItem.timestamp).format('HH:mm')}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default EntryItem;