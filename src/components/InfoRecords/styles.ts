import { appColors } from '@/src/themes/colors';
import { appFonts } from '@/src/themes/fonts';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    infoRecords: {
        width: '100%',
        height: '48.5%',
        backgroundColor: appColors.quintenary,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
        padding: '5%',
    },
    pointTexts: {
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: '5%', 
        justifyContent: 'flex-start',
    },
    infoText: {
        fontSize: 14, 
        color: '#fff', 
        fontWeight: 600, 
        fontFamily: appFonts.afacadSemiBold,
    },
    loadCard: {
        width: '100%',
        height: '100%',
        backgroundColor: appColors.quintenary,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
});

export default styles;