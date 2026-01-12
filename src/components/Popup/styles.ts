import { appColors } from '@/src/themes/colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: '#0000003b',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        width: '90%',
        height: '25%',
        backgroundColor: '#fff',
        borderRadius: 4,
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },
    header: {
        width: '100%',
        height: '30%',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
        paddingLeft: 10,
        paddingRight: 20,
        position: 'relative',
        zIndex: 2,
        boxShadow: '0px 0px 8px #8a8a8a69',
    },
    logo: {
        width: 40,
        height: 40,
    },
    texts: {
        alignItems: 'flex-start',
        justifyContent: 'center', 
    },
    title: {
        fontSize: 22,
    },
    messageContainer: {
        width: '100%',
        height: '70%',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    message: {
        fontSize: 22,
        fontWeight: 400,
        textAlign: 'left',
        letterSpacing: -1.25,
    },
    closeButton: {
        width: '15%',
        height: 35,
        backgroundColor: appColors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
    },
});

export default styles;