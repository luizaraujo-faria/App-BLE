import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import Button from '@/src/components/Button';
import { usePopup } from '../contexts/PopupContext';
import { LinearGradient } from 'expo-linear-gradient';
import { appColors } from '../themes/colors';
import AppText from '../components/AppText';
import { appFonts } from '../themes/fonts';
import { AntDesignIcon } from '../components/Icons';

const SigninScreen = () => {

    const { showPopup } = usePopup();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = () => {

        if(email.trim() === '' && password.trim() === ''){
            return showPopup('Aviso!', 'Todos os campos devem ser preenchidos.');
        }

        email === 'Admin' && password === 'Admin'
            ? router.replace('/(tabs)/list')
            : showPopup('Erro!', 'Email e/ou senha incorretos!');
    };

    return <View style={styles.container}>

        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={styles.mainBox}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                <View style={{ width: '100%', alignItems: 'center' }}>
                    <View style={styles.intro}>
                        <Image 
                            // eslint-disable-next-line no-undef
                            source={require('@/assets/images/LogoIMREA.png')} 
                            style={styles.logo}
                        />
                        <View style={{ width: '100%', alignItems: 'center' }}>
                            <AppText text={'IMREA Nutrição'} textStyle={styles.title} />
                            <View
                                style={{ width: '50%', height: 1, backgroundColor: appColors.quintenary }}
                            ></View>
                        </View>
                    </View>

                    <LinearGradient
                        colors={[appColors.secondary, appColors.primary, appColors.primary, appColors.quintenary]}
                        style={styles.formBorder}
                    >
                        <View style={styles.form}>

                            <View style={styles.formHeader}>
                                <AntDesignIcon iconName='login' iconColor='#000' iconSize={24} />
                                <View>
                                    <AppText text={'Acessar plataforma'} textStyle={{ fontSize: 24 }}/>
                                    <View
                                        style={{ width: '40%', height: 1.6, backgroundColor: appColors.quintenary }}
                                    ></View>
                                </View>
                            </View>

                            <View style={{ width: '100%', gap: 18 }}>
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    style={styles.input}
                                    placeholder='Digite seu email'
                                    placeholderTextColor='#000'
                                    importantForAutofill='yes'
                                    disableFullscreenUI={true}
                                    // autoComplete='off'
                                    underlineColorAndroid={'transparent'}
                                />
                                <TextInput
                                    value={password}
                                    onChangeText={setPassword}
                                    style={styles.input}
                                    placeholder='Digite sua senha'
                                    placeholderTextColor='#000'
                                    secureTextEntry
                                    importantForAutofill='yes'
                                    disableFullscreenUI={true}
                                    // autoComplete='off'
                                    underlineColorAndroid={'transparent'}
                                />

                                <Button 
                                    textButton='Entrar' 
                                    onPress={handleLogin}
                                    style={styles.loginButton}
                                    textStyle={{ color: '#000', fontSize: 20 }}
                                    disabled={undefined}
                                    loading={false}
                                    icon={null}
                                />
                            </View>
                            
                            <View style={styles.footer}>
                                <AppText text={'©2025 - IMREA Rede Lucy Montoro'} textStyle={styles.footerText}/>
                            </View>
                        </View>
                    </LinearGradient>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        // padding: 20,
    },
    mainBox: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    intro: {
        width: '100%',
        height: '35%',
        padding: 20,
        position: 'relative',
        alignItems: 'center',
        gap: '5%',
    },
    logo: {
        width: 40,
        height: 40,
    },
    title: {
        fontSize: 45,
        color: '#000',
        fontFamily: appFonts.afacadReg,
        textAlign: 'center',
        
    },
    formHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '5%',
        marginTop: 10,
    },
    formBorder: {
        width: '100%',
        height: '65%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        position: 'relative',
        padding: 10,
    },
    form: {
        width: '98%',
        height: '110%',
        alignItems: 'center',
        justifyContent: 'space-around',
        gap: 40,
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        position: 'absolute',
        bottom: 0,
        boxShadow: appColors.shadow,
    },
    input: {
        width: '100%',
        height: 50,
        padding: 16,
        fontSize: 18,
        color: '#000',
        borderRadius: 10,
        backgroundColor: '#fbbe244b',
        fontFamily: appFonts.afacadReg,
        overflow: 'hidden',
    },
    loginButton: {
        height: 50,
        backgroundColor: '#ffb54cff',
        borderRadius: 10,
    },
    footer: {
        width: '70%',
        height: 64,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        position: 'relative',
        borderTopColor: appColors.quintenary,
        borderTopWidth: .5,
    },
    footerText: {
        fontSize: 16,
        fontWeight: '300',
        textAlign: 'center',
    },
});

export default SigninScreen;