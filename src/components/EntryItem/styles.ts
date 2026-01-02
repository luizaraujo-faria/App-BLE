import { StyleSheet } from 'react-native';
import { appColors } from '@/src/styles/styles';

const styles = StyleSheet.create({
    entryItemCard: {
        width: '95%',
        height: 60,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: appColors.tertiary,
        boxShadow: appColors.shadow,
        padding: 16,
    },
    inner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: { 
        width: '50%', 
        height: '100%', 
        alignItems: 'flex-start', 
        justifyContent: 'center',

    },
    text: {
        fontSize: 18,
        fontFamily: 'AfacadFlux',
        color: '#000',
        textAlign: 'center',
        height: '100%',
    },
    time: { 
        width: '50%', 
        height: '100%', 
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'flex-end',
        gap: '8%',
    },
});

export default styles;