import { View, StyleSheet, Text, Image } from 'react-native';
import LogoIMREA from '@/assets/images/LogoIMREA.png';
import React from 'react';

interface HeaderProps {
    subtitle: string | null;
}

const Header = ({ subtitle }: HeaderProps) => {

    return (
        <View style={styles.headerContainer}>

            <Image source={LogoIMREA} 
                style={styles.headerLogo}/>

            <View style={styles.texts}>
                <Text style={styles.headerTitle}>Gestão IMREA</Text>
                <Text style={subtitle ? styles.headerSubtitle : { display: 'none' }}>{subtitle}</Text>
            </View>

        </View>
    );
};

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

export default Header;