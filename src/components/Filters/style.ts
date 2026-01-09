import { appColors } from '@/src/themes/colors';
import { appFonts } from '@/src/themes/fonts';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    topBar: {
        width: '100%',
        height: '15%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '5%',
    },
    monthDropdownBar: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        color: '#000',
        borderWidth: 0,
        position: 'relative',
        overflow: 'hidden',
    },
    monthDropdownContainer: {
        width: '100%',
        backgroundColor: '#f7f7f7ff',
        borderWidth: 0,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        fontFamily: appFonts.afacadReg,
        boxShadow: appColors.shadow,
    },
    dropdownBar: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        color: '#000',
        borderWidth: 0,
        position: 'relative',
        overflow: 'hidden',
    },
    dropdownContainer: {
        width: '100%',
        backgroundColor: '#f7f7f7ff',
        borderWidth: 0,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        fontFamily: appFonts.afacadReg,
        boxShadow: appColors.shadow,
    },
    dropdownLabel: {
        paddingLeft: 5,
        fontSize: 16.5,
        color: '#000000ff',
        fontFamily: appFonts.afacadReg,
    },
    dropdownPlaceholder: {
        paddingLeft: 6,
        fontSize: 16,
        fontFamily: appFonts.afacadReg,
        color: '#000000',
    },
    selectedItemContainer: {
        backgroundColor: appColors.tertiary,
    },
    selectedItemLabel: {
        fontWeight: 'bold',
        color: '#000000ff',
    },
});

export default styles;