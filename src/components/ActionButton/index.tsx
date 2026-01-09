import { TouchableOpacity } from 'react-native';
import React from 'react';
import styles from './styles';

interface ActionButtonProps {
    style?: Object | null;
    icon: any | null;
    onPress: () => void;
    disabled?: boolean
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

export default ActionButton;