import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
    textButton: string;
    onPress: () => void;
    style: Object | null;
    disabled: boolean | undefined
}

const Button = ({ textButton, onPress, style, disabled }: ButtonProps) => {

    return (
        <TouchableOpacity 
            style={[buttonStyles.buttonContainer, style && style, disabled && buttonStyles.buttonDisabled]}
            onPress={onPress} 
            disabled={disabled}>
            <Text style={buttonStyles.buttonText}>{textButton}</Text>
        </TouchableOpacity>
    );
};

const buttonStyles = StyleSheet.create({
    buttonContainer: {
        width: '100%',
        height: 50,
        backgroundColor: '#ffb54cff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        marginBottom: 10,
    },
    buttonDisabled: {
        backgroundColor: '#cea163ff',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 400,
        color: 'white',
    },
});

export default Button;