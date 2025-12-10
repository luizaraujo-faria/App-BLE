import React from 'react';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import Button from '../components/ui/Button';
// import { LinearGradient } from 'expo-linear-gradient';
import { usePopup } from '../contexts/PopupContext';

const SigninScreen = () => {

    const { showPopup } = usePopup();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = () => {

        if(email.trim() === '' && password.trim() === ''){
            return showPopup('Falha!', 'Todos os campos devem ser preenchidos.');
        }

        email === 'Admin' && password === 'Admin'
            ? router.push('/home')
            : showPopup('Erro!', 'Email e/ou senha incorretos!');
    };

    return <View 
        style={styles.container}>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.mainBox}>

            <View style={styles.intro}>
                <Text style={styles.title}>ENTRE</Text>
                <Text style={styles.subtitle}>Conecte-se à sua conta em nosso aplicativo para acessar as funcionalidades de gerência.</Text>
            </View>

            <View style={styles.form}>

                <View style={styles.formHeader}>
                    <Image 
                        // eslint-disable-next-line no-undef
                        source={require('@/assets/images/LogoIMREA.png')}
                        style={styles.logo}
                    />

                    <Text style={{ fontSize: 24, fontFamily: 'AfacadFlux' }}>IMREA Gestão</Text>
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
                        underlineColorAndroid='transparent'
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
                        underlineColorAndroid='transparent'
                    />

                    <Button 
                        textButton='Entrar' 
                        onPress={handleLogin}
                        style={styles.loginButton}
                        textStyle={{ color: '#000', fontSize: 20 }}
                        disabled={undefined}/>
                </View>
                  
                <View style={styles.signupBox}>
                    <Text style={styles.signupText}>Não possui conta?</Text>
                    <Text style={styles.signupLink} >Cadastrar-se</Text>
                </View>
            </View>
        </KeyboardAvoidingView>

        {/* <View style={styles.footer}>
            <Text style={styles.footerText}>©2025 - Rede Lucy Montoro</Text>
        </View> */}

    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffb54cff',
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
        height: '40%',
        padding: 20,
    },
    title: {
        fontSize: 56,
        height: 80,
        fontWeight: '400',
        color: '#000000ff',
        fontFamily: 'AfacadFlux',
    },
    subtitle: {
        fontSize: 20,
        fontFamily: 'AfacadFlux',
        textAlign: 'justify',
        color: '#000000ff',
    },
    formHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '20%',
        marginTop: 10,
        fontFamily: 'AfacadFlux',
    },
    logo: {
        width: 45,
        height: 45,
    },
    form: {
        width: '95%',
        height: '60%',
        alignItems: 'flex-start',
        gap: 40,
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    },
    input: {
        width: '100%',
        height: 56,
        padding: 16,
        fontSize: 18,
        color: '#000',
        borderRadius: 50,
        backgroundColor: '#fbbe244b',
        fontFamily: 'AfacadFlux',
        overflow: 'hidden',
    },
    signupBox: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    signupText: {
        fontSize: 20,
        fontWeight: '300',
        fontFamily: 'AfacadFlux',
    },
    signupLink: {
        fontSize: 20,
        fontWeight: '400',
        color: '#da07009f',
        fontFamily: 'AfacadFlux',
    },
    loginButton: {
        height: 52,
        backgroundColor: '#ffb54cff',
        borderRadius: 50,
    },
    // footer: {
    //     width: '100%',
    //     height: 64,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     backgroundColor: '#fff',
    //     position: 'relative',
    // },
    // footerText: {
    //     fontSize: 16,
    //     fontWeight: '300',
    // },
});

export default SigninScreen;