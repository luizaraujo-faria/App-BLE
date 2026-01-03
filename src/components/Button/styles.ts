import { appColors } from '@/src/themes/colors';
// import { appFonts } from '@/src/themes/fonts';
import { StyleSheet } from 'react-native';

const buttonStyles = StyleSheet.create({
    buttonContainer: {
        width: '100%',
        height: 50,
        backgroundColor: appColors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        marginBottom: 10,
        flexDirection: 'row',
        gap: '5%',
    },
    buttonDisabled: {
        backgroundColor: appColors.primaryDisabled,
    },
});

export default buttonStyles;