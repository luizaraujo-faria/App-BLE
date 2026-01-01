import { TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';


interface ActionButtonProps {
    style: Object | null;
    icon: any | null;
    onPress: () => void;
    disabled: boolean
}

const ActionButton = ({ style, icon, onPress, disabled }: ActionButtonProps ) => {

    return (
        <TouchableOpacity 
            style={[styles.actionOption, style && style, disabled && styles.actionOptionDisabled]} 
            onPress={onPress} disabled={disabled}
        >
            {icon}
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