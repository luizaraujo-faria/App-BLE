import { StyleSheet } from 'react-native';

const buttonStyles = StyleSheet.create({
    buttonContainer: {
        width: '100%',
        height: 50,
        backgroundColor: '#ffb54cff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        marginBottom: 10,
        flexDirection: 'row',
        gap: '5%',
    },
    buttonDisabled: {
        backgroundColor: '#cea163ff',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 400,
        color: 'white',
        fontFamily: 'AfacadFlux',
    },
});

export default buttonStyles;