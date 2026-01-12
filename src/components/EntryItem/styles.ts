import { appColors } from '@/src/themes/colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    entryItemCard: {
        width: '100%',
        height: 58,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: appColors.quintenary,
        // boxShadow: appColors.shadow,
        paddingHorizontal: 16,
    },
    inner: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    id: { 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'row',
    },
    text: {
        fontSize: 16,
        fontFamily: 'AfacadFlux',
        color: '#fff',
        textAlign: 'center',
    },
    time: { 
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '8%',
    },
});

export default styles;