import ActionButton from '@/src/components/ActionButton';
import AppText from '@/src/components/AppText';
import Button from '@/src/components/Button';
import { AntDesignIcon, FontAwesomeIcon } from '@/src/components/Icons';
import { usePopup } from '@/src/contexts/PopupContext';
import useDropdown from '@/src/hooks/useDropdown';
import { normalizeApiErrors } from '@/src/services/apiErrors';
import { createCollaborator } from '@/src/services/collaboratorsService';
import { appColors } from '@/src/themes/colors';
import { appFonts } from '@/src/themes/fonts';
import React, { useCallback, useState } from 'react';
import { Image, StyleSheet, TextInput, View } from 'react-native';
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

    const typeDropdown = useDropdown(collaboratorTypes.map(t => ({ label: t.type, value: t.type })));

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
            colors={[appColors.secondary, appColors.primary]}
            style={{ flex: 1, position: 'relative' }}>
            <View style={styles.container}>

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
                            <TextInput 
                                value={sector}
                                onChangeText={setSector}
                                placeholder='Setor'
                                placeholderTextColor='#000'
                                style={styles.input} 
                                editable={isLoading ? false : true}
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
                            />
                        </View>
                    </View>

                    <View style={styles.actions}>
                        <Button 
                            textButton='Cadastrar'
                            onPress={registerCollaborator}
                            style={styles.button}
                            textStyle={null}
                            disabled={buttonDisabled}
                            loading={isLoading}
                            icon={null}
                        />

                        {/* <Button 
                            textButton='Limpar'
                            onPress={clearInputs}
                            style={[styles.clearButton, { backgroundColor: 'red' }]}
                            textStyle={null}
                            disabled={false}
                            loading={false}
                        /> */}

                        <View style={{ flexDirection: 'row', gap: '2.5%' }}>
                            <ActionButton 
                                style={[styles.clearButton, styles.miniButton]}
                                disabled={isLoading}
                                onPress={clearInputs}
                                icon={<AntDesignIcon 
                                    iconName='clear' 
                                    iconSize={20} 
                                    iconColor='#fff' />
                                }
                            />
                            <ActionButton 
                                style={[styles.changeButton, styles.miniButton]}
                                disabled={isLoading}
                                onPress={clearInputs}
                                icon={<FontAwesomeIcon 
                                    iconName='exchange' 
                                    iconSize={20} 
                                    iconColor='#fff' />
                                }
                            />
                        </View>
                    </View>
                </View>

            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 24,
        gap: 16,
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
        backgroundColor: appColors.primary,
    },
    form: {
        width: '95%',
        height: '90%',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        padding: 24,
        paddingVertical: 60,
        gap: '10%',
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
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
    },
    miniButton: {
        width: '15%',
        height: 40,
        boxShadow: 'none',
    },
    clearButton: {
        backgroundColor: appColors.quaternary,
    },
    changeButton: {
        backgroundColor: appColors.secondary,
    },
});

export default Register;