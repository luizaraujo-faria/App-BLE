import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';


interface ActionButtonProps {
    iconName: string;
    iconSize: number;
    onPress: () => void;
    disabled: boolean
}

const ActionButton = ({ iconName, iconSize, onPress, disabled }: ActionButtonProps ) => {

    return (
        <TouchableOpacity style={[styles.actionOption, disabled && styles.actionOptionDisabled]} onPress={onPress} disabled={disabled}>
            <Ionicons name={iconName} size={iconSize}/>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    actionOption: {
        width: 80,
        height: 60,
        boxShadow: '0px 0px 2px #94949475',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    actionOptionDisabled: {
        backgroundColor: '#ccccccbe',
    },
});

export default ActionButton;