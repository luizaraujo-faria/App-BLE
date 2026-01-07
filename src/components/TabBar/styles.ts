import { appColors } from '@/src/themes/colors';
import { appFonts } from '@/src/themes/fonts';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        paddingVertical: 8,
        height: '8.5%',
        boxShadow: appColors.shadow,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        gap: 0,
    },
    iconContainer: {
        width: 40,
        height: 38,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        position: 'relative',
    },
    iconContainerActive: {
        backgroundColor: appColors.primary,
        borderRadius: '50%',
    },
    label: {
        fontSize: 12,
        marginTop: 4,
        color: '#666666',
        fontFamily: appFonts.afacadReg,
        
    },
    labelActive: {
        color: '#000000ff',
        fontWeight: '600',
        display: 'flex',
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -2,
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: appColors.quaternary,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default styles;