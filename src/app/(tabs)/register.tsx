import Header from '@/src/components/layout/Header';
import Button from '@/src/components/ui/Button';
import { usePopup } from '@/src/contexts/PopupContext';
import useDropdown from '@/src/hooks/useDropdown';
import { normalizeApiErrors } from '@/src/services/apiErrors';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, View, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { createCollaborator } from '@/src/services/collaboratorsService';

const Register = () => {

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [sector, setSector] = useState('');

    const { showPopup } = usePopup();
    const [loading, setLoading] = useState(false);

    const collaboratorTypes = [
        { id: '1', type: 'Colaborador' },
        { id: '2', type: 'Residente' },
        { id: '3', type: 'Visitante' },
        { id: '4', type: 'Terceirizado' },
    ];

    const typeDropdown = useDropdown(collaboratorTypes.map(t => ({ label: t.type, value: t.type })));

    const verifyInputsIsEmpty = useCallback((): boolean => {

        if(id.trim() === '' && name.trim() === '' && sector.trim() === '' && typeDropdown.value === 'Tipo de Colaborador'){
            return true;
        }

        return false;
    }, [id, name, sector, typeDropdown.value]);

    const clearInputs = () => {

        setId('');
        setName('');
        setSector('');
        typeDropdown.setValue('Tipo de Colaborador');
    };

    const registerCollaborator = useCallback(async () => {

        try{
            setLoading(true);
            if(verifyInputsIsEmpty()) return;

            const values = [];
            values.push(id);
            values.push(name);
            values.push(sector);
            values.push(typeDropdown.value);

            console.log(values);

            await createCollaborator(values);

            showPopup('Sucesso!', 'Colaborador Criado com sucesso!');
            return;
        }
        catch(err: any){
            const appError = normalizeApiErrors(err);
            showPopup(`${appError.title} ${appError.status ? appError.status : ''}`, `${appError.message}\n${err.message}`);
        }
        finally{
            setLoading(false);
        }

    }, [id, name, sector, showPopup, typeDropdown.value, verifyInputsIsEmpty]);

    const buttonDisabled = verifyInputsIsEmpty();

    return (
        <View style={{ flex: 1, position: 'relative' }}>
            <Header subtitle={'Cadastro'} />

            <View style={styles.container}>

                <View style={styles.form}>
                    <View style={styles.inputBox}>
                        <TextInput 
                            value={id}
                            onChangeText={setId}
                            placeholder='ID'
                            placeholderTextColor='#000'
                            style={styles.input} 
                        />
                        <TextInput 
                            value={name}
                            onChangeText={setName}
                            placeholder='Nome'
                            placeholderTextColor='#000'
                            style={styles.input} 
                        />
                        <TextInput 
                            value={sector}
                            onChangeText={setSector}
                            placeholder='Setor'
                            placeholderTextColor='#000'
                            style={styles.input} 
                        />

                        <DropDownPicker
                            disabled={false}
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
                            dropDownDirection='BOTTOM'
                        />
                    </View>


                    <View style={styles.actions}>
                        <Button 
                            textButton='Cadastrar'
                            onPress={registerCollaborator}
                            style={styles.button}
                            textStyle={null}
                            disabled={false}
                        />

                        <Button 
                            textButton='Limpar'
                            onPress={clearInputs}
                            style={[styles.button, { backgroundColor: 'red' }]}
                            textStyle={null}
                            disabled={buttonDisabled}
                        />
                    </View>

                    {loading && (
                        <View style={{
                            width: '100%',
                            height: '15%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#83838317',
                        }}>
                            <ActivityIndicator size='large' color='#ffb54cff' />
                            <Text style={{ color: '#ffb54cff' }}>Enviando dados...</Text>
                        </View>
                    )}

                </View>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        gap: 16,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    form: {
        width: '100%',
        height: '80%',
        // backgroundColor: '#d3d3d3ff',
        gap: 16,
        justifyContent: 'space-between',
    },
    inputBox: {
        height: '40%', 
        gap: 16, 
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropdownBar: {
        width: '100%',
        height: '25%',
        // boxShadow: '0px 0px 2px #94949475',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffffff',
        color: '#000',
        borderWidth: 0,
        position: 'relative',
    },
    dropdownContainer: {
        width: '100%',
        backgroundColor: '#ffffffea',
        borderWidth: 0,
        // borderTopRightRadius: 2,
        // borderTopLeftRadius: 2,
        boxShadow: '0px 0px 2px #94949475',
    },
    dropdownLabel: {
        fontSize: 16,
        color: '#000000ff',
    },
    dropdownPlaceholder: {
        fontSize: 16,
        color: '#000000',
    },
    selectedItemContainer: {
        backgroundColor: '#b6b6b69c',
    },
    selectedItemLabel: {
        fontWeight: 'bold',
        color: '#000000ff',
    },
    input: {
        width: '100%',
        height: '25%',
        backgroundColor: '#fff',
        borderRadius: 4,
        fontSize: 16,
        padding: 16,
        color: '#000',
    },
    actions: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        width: '45%',
        height: '40%',
    },
});

export default Register;