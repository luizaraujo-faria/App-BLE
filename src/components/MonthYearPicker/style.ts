import { appFonts } from '@/src/themes/fonts';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        minHeight: '100%',
        maxHeight: '100%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
        paddingHorizontal: '5%',
        backgroundColor: '#fff',
        color: '#000',
        borderWidth: 0,
        position: 'relative',
        overflow: 'hidden',
    },
    text: {
        paddingLeft: 5,
        fontSize: 16,
        color: '#000000ff',
        fontFamily: appFonts.afacadReg,
    },
});