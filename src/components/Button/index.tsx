import React from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import buttonStyles from './styles';
import AppText from '../AppText';

interface ButtonProps {
    textButton: string;
    onPress: () => void;
    style?: Object | null;
    textStyle?: Object | null;
    disabled?: boolean | undefined;
    loading?: boolean;
    icon?: any | null | Object;
}

const Button = ({ textButton, onPress, style, textStyle, disabled, loading, icon }: ButtonProps) => {

    return (
        <TouchableOpacity 
            style={[buttonStyles.buttonContainer, style && style, disabled && buttonStyles.buttonDisabled]}
            onPress={onPress} 
            disabled={disabled}>
            
            {loading ? (
                <ActivityIndicator size='small' color='#fff' />
            ) : (
                <>
                    {icon && icon}
                    <AppText text={textButton} textStyle={textStyle} />
                </>
            )}
        </TouchableOpacity>
    );
};

export default Button;