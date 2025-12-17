import { Ionicons } from '@expo/vector-icons';
import { Modal, StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import LogoIMREA from '../../../assets/images/LogoIMREA.png';
import React from 'react';
// import Button from './Button';

interface PopupProps {
    title: string;
    message: string;
    visible: boolean;
    onClose: () => void;
}

const Popup = ({ title, message, visible, onClose }: PopupProps) => {

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType='fade'
        >

            <View style={styles.overlay}>

                <View style={styles.container}>

                    <View style={styles.header}>
            
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <Image source={LogoIMREA} style={styles.logo}/>
            
                            <View style={styles.texts}>
                                <Text style={styles.title}>{title}</Text>
                            </View>
                        </View>

                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name={'close'} size={24}/>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.messageContainer}>
                        <Text style={styles.message}>{message}</Text>
                    </View>

                    {/* <View style={styles.actionContainer}>
                        <Button textButton='Fechar' style={styles.closeButton} disabled={false} onPress={onClose}/>
                    </View> */}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: '#0000003b',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        width: '90%',
        height: '20%',
        backgroundColor: '#fff',
        borderRadius: 2,
        justifyContent: 'flex-end',
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
        fontSize: 20,
        fontFamily: 'AfacadFlux',
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
        fontFamily: 'AfacadFlux',
    },
    // actionContainer: {
    //     width: '100%',
    //     height: '25%',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     padding: 10,
    // },
    closeButton: {
        width: '15%',
        height: 35,
        backgroundColor: '#ffb44ce7',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
    },
});

export default Popup;