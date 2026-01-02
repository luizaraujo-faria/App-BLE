import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        height: 64,
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 20,
        paddingLeft: 10,
        position: 'relative',
        zIndex: 2,
        boxShadow: '0px 0px 8px #8a8a8a69',
    },
    headerLogo: {
        width: 44,
        height: 44,
    },
    texts: {
        alignItems: 'flex-start',
        justifyContent: 'center', 
    },
    headerTitle: {
        fontSize: 26,
        fontFamily: 'AfacadFlux',
    },
    headerSubtitle: {
        fontSize: 16,
        fontFamily: 'AfacadFlux',
    },
});

export default styles;