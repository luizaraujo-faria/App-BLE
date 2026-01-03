import { appFonts } from '@/src/themes/fonts';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    label: {
        fontSize: 20,
        color: '#000',
        fontFamily: appFonts.afacadReg,
    },
});

export default styles;