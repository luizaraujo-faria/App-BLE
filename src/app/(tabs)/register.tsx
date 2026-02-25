import ActionButton from '@/src/components/ActionButton';
import AppText from '@/src/components/AppText';
import Button from '@/src/components/Button';
import { AntDesignIcon, MaterialCommunityIcon } from '@/src/components/Icons';
import { usePopup } from '@/src/contexts/PopupContext';
import useDropdown from '@/src/hooks/useDropdown';
import { normalizeApiErrors } from '@/src/services/apiErrors';
import { createCollaborator } from '@/src/services/collaboratorsService';
import { appColors } from '@/src/themes/colors';
import { appFonts } from '@/src/themes/fonts';
import React, { useCallback, useState } from 'react';
import { Image, StyleSheet, TextInput, View, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Platform } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { LinearGradient } from 'expo-linear-gradient';

const Register = () => {

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [sector, setSector] = useState('');

    const { showPopup } = usePopup();
    const [isLoading, setLoading] = useState(false);

    const collaboratorTypes = [
        { id: '1', type: 'Colaborador' },
        { id: '2', type: 'Residente' },
        { id: '3', type: 'Visitante' },
        { id: '4', type: 'Terceirizado' },
    ];

    const sectors = [
        { id: 1, sector: 'ADMINISTRATIVO' },
        { id: 2, sector: 'ALMOXARIFADO' },
        { id: 3, sector: 'APOIO ASSISTENCIAL' },
        { id: 4, sector: 'BIBLIOTECA' },
        { id: 5, sector: 'BIOENGENHARIA' },
        { id: 6, sector: 'COMPRAS' },
        { id: 7, sector: 'COMUNICAÇÃO' },
        { id: 8, sector: 'CONDICIONAMENTO FÍSICO' },
        { id: 9, sector: 'CONDIR' },
        { id: 10, sector: 'COPA' },
        { id: 11, sector: 'COORDENAÇÃO DE HORÁRIOS' },
        { id: 12, sector: 'DIRETORIA' },
        { id: 13, sector: 'DIRETORIA ADMINISTRATIVA' },
        { id: 14, sector: 'DIRETORIA CLÍNICA' },
        { id: 15, sector: 'DIRETORIA EXECUTIVA' },
        { id: 16, sector: 'ENFERMAGEM' },
        { id: 17, sector: 'ENFERMAGEM INTERNAÇÃO' },
        { id: 18, sector: 'EXPEDIENTE' },
        { id: 19, sector: 'FARMÁCIA' },
        { id: 20, sector: 'FATURAMENTO' },
        { id: 21, sector: 'FINANCEIRO' },
        { id: 22, sector: 'FINANÇAS' },
        { id: 23, sector: 'FISIOTERAPIA' },
        { id: 24, sector: 'FMUSP' },
        { id: 25, sector: 'FONOAUDIOLOGIA' },
        { id: 26, sector: 'GETI' },
        { id: 27, sector: 'GOVERNANÇA' },
        { id: 28, sector: 'HOSPITALIDADE' },
        { id: 29, sector: 'HOTELARIA' },
        { id: 30, sector: 'INFRAESTRUTURA - ENGENHARIA' },
        { id: 31, sector: 'LABORATÓRIO DE MARCHA' },
        { id: 32, sector: 'MANUTENÇÃO' },
        { id: 33, sector: 'NUTRIÇÃO' },
        { id: 34, sector: 'OFICINA TERAPEUTICA' },
        { id: 35, sector: 'OPERAÇÕES' },
        { id: 36, sector: 'OPM' },
        { id: 37, sector: 'OUVIDORIA' },
        { id: 38, sector: 'PATRIMÔNIO' },
        { id: 39, sector: 'PESQUISA CLÍNICA' },
        { id: 40, sector: 'PROJETOS' },
        { id: 41, sector: 'PSICOLOGIA' },
        { id: 42, sector: 'QUALIDADE' },
        { id: 43, sector: 'RECEPÇÃO' },
        { id: 44, sector: 'RECEPÇÃO CENTRAL' },
        { id: 45, sector: 'RECURSOS HUMANOS' },
        { id: 46, sector: 'SAME' },
        { id: 47, sector: 'SCIH' },
        { id: 48, sector: 'SERVIÇO DE ODONTOLOGIA' },
        { id: 49, sector: 'SERVIÇO MÉDICO' },
        { id: 50, sector: 'SERVIÇO SOCIAL' },
        { id: 51, sector: 'SISTEMAS' },
        { id: 52, sector: 'SSO' },
        { id: 53, sector: 'SUPORTE' },
        { id: 54, sector: 'TERAPIA OCUPACIONAL' },
        { id: 55, sector: 'ZELADORIA' },
    ];

    const typeDropdown = useDropdown(collaboratorTypes.map(t => ({ label: t.type, value: t.type })));
    const sectorDropdown = useDropdown(sectors.map(s => ({ label: s.sector, value: s.sector })));

    const verifyInputsIsEmpty = useCallback((): boolean => {

        if(id.trim() === '' ||
            name.trim() === '' ||
            sector.trim() === '' ||
            typeDropdown.value === ''){

            return true;
        }

        return false;
    }, [id, name, sector, typeDropdown.value]);

    const clearInputs = useCallback(async() => {

        setId('');
        setName('');
        setSector('');
        typeDropdown.setValue('');
    }, [typeDropdown]);

    const registerCollaborator = useCallback(async () => {

        try{
            setLoading(true);
            if(verifyInputsIsEmpty()) return;

            const values = [id, name, sector, typeDropdown.value];
            console.log(values);

            const res = await createCollaborator(values);
            
            clearInputs();
            showPopup('Sucesso!', `${res}`);
            return;
        }
        catch(err: any){
            const appError = normalizeApiErrors(err);
            console.log(appError.message);
            showPopup(`${appError.title} ${appError.status ? appError.status : ''}`, `${appError.message}`);
        }
        finally{
            setLoading(false);
        }

    }, [clearInputs, id, name, sector, showPopup, typeDropdown.value, verifyInputsIsEmpty]);

    const buttonDisabled = verifyInputsIsEmpty();

    return (
        <LinearGradient 
            colors={[appColors.secondary, appColors.primary, appColors.primary]}
            style={styles.container}>

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'space-between' }}
            >
                <TouchableWithoutFeedback 
                    onPress={Keyboard.dismiss}
                    // style={{ width: '100%' }}
                >
                                        
                    <View style={styles.form}>

                        <View style={{ gap: '10%' }}>
                            <View style={styles.formText}>
                                <Image 
                                    // eslint-disable-next-line no-undef
                                    source={require('@/assets/images/LogoIMREA.png')}
                                    style={styles.logo} 
                                />
                                <View style={{ alignItems: 'center' }}>
                                    <AppText text={'Cadastro de Colaboradores'} textStyle={styles.text} />
                                    <AppText 
                                        text={'Insira os dados abaixo'} 
                                        textStyle={{ fontSize: 18, fontFamily: 'AfacadFlux' }} 
                                    />
                                </View>
                            </View>

                            <View style={styles.inputBox}>

                                <TextInput 
                                    value={id}
                                    onChangeText={setId}
                                    placeholder='ID'
                                    placeholderTextColor='#000'
                                    style={styles.input} 
                                    editable={isLoading ? false : true}
                                />
                                <TextInput 
                                    value={name}
                                    onChangeText={setName}
                                    placeholder='Nome'
                                    placeholderTextColor='#000'
                                    style={styles.input} 
                                    editable={isLoading ? false : true}
                                />

                                <DropDownPicker
                                    disabled={isLoading}
                                    open={sectorDropdown.open}
                                    value={sectorDropdown.value}
                                    items={sectorDropdown.items}
                                    setOpen={sectorDropdown.setOpen}
                                    setValue={sectorDropdown.setValue}
                                    setItems={sectorDropdown.setItems}
                                    placeholder={'Tipo de Colaborador'}
                                    style={styles.dropdownBar}
                                    dropDownContainerStyle={[styles.dropdownContainer, { zIndex: 4 }]}
                                    labelStyle={styles.dropdownLabel}
                                    placeholderStyle={styles.dropdownPlaceholder}
                                    selectedItemContainerStyle={[styles.selectedItemContainer, { zIndex: 10 }]}
                                    selectedItemLabelStyle={styles.selectedItemLabel}
                                    dropDownDirection='TOP'
                                    ArrowDownIconComponent={() => (
                                        <AntDesignIcon iconName='caret-down' iconColor='#000' iconSize={22} />
                                    )}
                                    ArrowUpIconComponent={() => (
                                        <AntDesignIcon iconName='caret-up' iconColor='#000' iconSize={22} />
                                    )}
                                />

                                <DropDownPicker
                                    disabled={isLoading}
                                    open={typeDropdown.open}
                                    value={typeDropdown.value}
                                    items={typeDropdown.items}
                                    setOpen={typeDropdown.setOpen}
                                    setValue={typeDropdown.setValue}
                                    setItems={typeDropdown.setItems}
                                    placeholder={'Tipo de Colaborador'}
                                    style={styles.dropdownBar}
                                    dropDownContainerStyle={styles.dropdownContainer}
                                    labelStyle={styles.dropdownLabel}
                                    placeholderStyle={styles.dropdownPlaceholder}
                                    selectedItemContainerStyle={styles.selectedItemContainer}
                                    selectedItemLabelStyle={styles.selectedItemLabel}
                                    dropDownDirection='AUTO'
                                    ArrowDownIconComponent={() => (
                                        <AntDesignIcon iconName='caret-down' iconColor='#000' iconSize={22} />
                                    )}
                                    ArrowUpIconComponent={() => (
                                        <AntDesignIcon iconName='caret-up' iconColor='#000' iconSize={22} />
                                    )}
                                />
                            </View>
                        </View>

                        <View style={styles.actions}>
                            <Button 
                                textButton='Cadastrar'
                                onPress={registerCollaborator}
                                style={styles.button}
                                textStyle={{ color: '#fff' }}
                                disabled={buttonDisabled}
                                loading={isLoading}
                                icon={null}
                            />

                            <View style={{ flexDirection: 'row', gap: '2.5%' }}>
                                <ActionButton 
                                    style={[styles.clearButton, styles.miniButton]}
                                    disabled={isLoading}
                                    onPress={clearInputs}
                                    icon={<MaterialCommunityIcon
                                        iconName='broom' 
                                        iconSize={20} 
                                        iconColor='#fff' />
                                    }
                                />
                                {/* <ActionButton 
                                    style={[styles.changeButton, styles.miniButton]}
                                    disabled={isLoading}
                                    onPress={clearInputs}
                                    icon={<FontAwesomeIcon 
                                        iconName='exchange' 
                                        iconSize={20} 
                                        iconColor='#fff' />
                                    }
                                /> */}
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
        backgroundColor: appColors.primary,
    },
    form: {
        width: '95%',
        minHeight: '90%',
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        padding: 24,
        paddingTop: '10%',
        gap: '15%',
        borderBottomLeftRadius: 60,
        borderBottomRightRadius: 60,
        // boxShadow: appColors.shadow,
        position: 'relative',
    },
    formText: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '5%',
    },
    logo: {
        width: 35,
        height: 35,
    },
    text: {
        fontSize: 22,
        fontFamily: appFonts.afacadReg,
    },
    inputBox: {
        width: '100%',
        height: 'auto', 
        gap: 16, 
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: '100%',
        height: 50,
        paddingLeft: 16,
        fontSize: 18,
        color: '#000',
        borderRadius: 10,
        backgroundColor: appColors.tertiary,
        fontFamily: appFonts.afacadReg,
        overflow: 'hidden',
    },
    dropdownBar: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: appColors.tertiary,
        color: '#000',
        borderWidth: 0,
        position: 'relative',
        overflow: 'hidden',
    },
    dropdownContainer: {
        width: '100%',
        backgroundColor: '#ffffffff',
        borderWidth: 0,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        fontFamily: appFonts.afacadReg,
        boxShadow: '0px 0px 1px #5353538a',
        position: 'absolute',
    },
    dropdownLabel: {
        paddingLeft: 6,
        fontSize: 18,
        color: '#000000ff',
        fontFamily: appFonts.afacadReg,
    },
    dropdownPlaceholder: {
        paddingLeft: 6,
        fontSize: 16,
        fontFamily: appFonts.afacadReg,
        color: '#000000',
    },
    selectedItemContainer: {
        backgroundColor: appColors.tertiary,
    },
    selectedItemLabel: {
        fontWeight: 'bold',
        color: '#000000ff',
    },
    actions: {
        width: '100%',
        maxHeight: 'auto',
    },
    button: {
        width: '100%',
        borderRadius: 10,
        backgroundColor: appColors.quintenary,
    },
    miniButton: {
        width: '20%',
        height: 45,
        boxShadow: 'none',
    },
    clearButton: {
        backgroundColor: appColors.quaternary,
    },
    // changeButton: {
    //     backgroundColor: appColors.quintenary,
    // },
});

export default Register;