import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { AntDesignIcon } from './Icons';

type EntryItemType = {
    id: string;
    timestamp?: number;
}

interface EntryItemProps {
    entryItem: EntryItemType;
    selectItem: (item: EntryItemType) => void;
}

const EntryItem = ({ entryItem, selectItem }: EntryItemProps) => {

    console.log(entryItem.id);


    return (
        <Animated.View 
            entering={FadeInDown.duration(500)}
            exiting={FadeOutUp.duration(450)}
            style={styles.entryItemCard}
        >
            <TouchableOpacity onPress={() => selectItem(entryItem)} style={{ width: '100%', height: '100%' }}>
                <View style={styles.inner}>
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>ID: {entryItem.id}</Text>
                    </View>
                    <View style={styles.time}>
                        <AntDesignIcon 
                            iconName='clock-circle' 
                            iconSize={18} 
                            iconColor='#000' 
                        />
                        <Text style={styles.text}>{dayjs(entryItem.timestamp).format('HH:mm')}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    entryItemCard: {
        width: '95%',
        height: 60,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffcd87ff',
        boxShadow: '0px 0px 3px #2c2c2c81',
        padding: 16,
    },
    inner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: { 
        width: '50%', 
        height: '100%', 
        alignItems: 'flex-start', 
        justifyContent: 'center',

    },
    text: {
        fontSize: 18,
        fontFamily: 'AfacadFlux',
        color: '#000',
    },
    time: { 
        width: '50%', 
        height: '100%', 
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'flex-end',
        gap: '8%',
    },

});

export default EntryItem;