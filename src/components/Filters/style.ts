import { appColors } from '@/src/themes/colors';
import { appFonts } from '@/src/themes/fonts';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    topBar: {
        width: '100%',
        height: '15%',
        justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor: '#9b3b3b',
    },
    dropdownDisabled: {
        backgroundColor: appColors.primaryDisabled,
    },
    dataDropdownBar: {
        width: '100%',
        minHeight: '100%',
        maxHeight: '100%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        color: '#000',
        borderWidth: 0,
        position: 'relative',
        overflow: 'hidden',
    },
    dataDropdownContainer: {
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
        height: '100%',
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
        fontSize: 16,
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
        backgroundColor: appColors.quintenary,
    },
    selectedItemLabel: {
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default styles;