import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import buttonStyles from './styles';

interface ButtonProps {
    textButton: string;
    onPress: () => void;
    style: Object | null;
    textStyle: Object | null;
    disabled: boolean | undefined;
    loading: boolean;
    icon: any | null | Object;
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
                    <Text style={[buttonStyles.buttonText, textStyle]}>{textButton}</Text>
                </>
            )}
        </TouchableOpacity>
    );
};

export default Button;