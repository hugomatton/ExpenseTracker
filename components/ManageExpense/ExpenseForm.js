import { View, StyleSheet, Text, Alert } from 'react-native'
import { useState } from 'react'

import Input from './Input'
import Button from '../UI/Button'
import {getFormattedDate} from '../../util/date'
import { GlobalStyles } from '../../constants/styles'

function ExpenseForm({onCancel, onSubmit, submitButtonLabel, defaultValues}) {

    /**
     * Les données du formulaire
     * value --> contient la valeur de la donnée
     * isValid --> renseigne sur la validité de la donnée
     */
    const [inputs, setInputs] = useState({
        amount: {
            value: defaultValues ? defaultValues.amount.toString() : '',
            isValid: true
        },
        date: {
            value: defaultValues ? getFormattedDate(defaultValues.date) : '',
            isValid: true
        },
        description: {
            value: defaultValues ? defaultValues.description : '',
            isValid: true
        }
    })

    /**
     * Gére la cohérence entre la variable inputs et les champs saisies
     */
    function inputChangedHandler(inputIdentifier, enterredValue) {
        setInputs((curInputs)=>{
            return{
                ...curInputs, 
                [inputIdentifier]: {value: enterredValue, isValid: true} //target a property dinamiquely
            }
        })
    }

    /**
     * Gère l'envoie du formulaire
     *  -Création de d'un nouvel objet
     *  -Check si ce dernier est valide
     * @returns 
     */
    function submitHandler(){
        const expenseData = {
            amount: parseFloat(inputs.amount.value), //+ --> converti String en Number
            date: new Date(inputs.date.value),
            description: inputs.description.value
        }

        const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0 
        const dateIsValid = expenseData.date.toString() !== 'Invalid Date'
        const descriptionIsValid = expenseData.description.trim().length > 0

        if(!amountIsValid || !dateIsValid || !descriptionIsValid){
            //Alert.alert('Invalid Input', 'Please check your input values')
            setInputs((curInputs)=>{
                return{
                    amount: {value: curInputs.amount.value, isValid: amountIsValid},
                    date: {value: curInputs.date.value, isValid: dateIsValid},
                    description: {value: curInputs.description.value, isValid: descriptionIsValid}
                }
            })
            return
        }
        onSubmit(expenseData)
    }

    const formIsInvalid = !inputs.amount.isValid || !inputs.date.isValid || !inputs.description.isValid

    return (
        <View style={styles.form}>
            <Text style={styles.title}>Your Expense</Text>
            <View style={styles.inputsRow}>
                <Input
                    style={styles.rowInput}
                    label="Amount"
                    invalid={!inputs.amount.isValid }
                    textInputConfig={{
                        keyboardType: 'decimal-pad',
                        onChangeText: inputChangedHandler.bind(this, 'amount'),
                        value: inputs.amount.value
                    }}
                />
                <Input
                    style={styles.rowInput}
                    label="Date"
                    invalid={!inputs.date.isValid }
                    textInputConfig={{
                        placeholder: 'YYYY-MM-DD',
                        maxLength: 10,
                        onChangeText: inputChangedHandler.bind(this, 'date'),
                        value: inputs.date.value
                    }}
                />
            </View>
            <Input
                label="Descrition"
                invalid={!inputs.description.isValid }
                textInputConfig={{
                    multiline: true,
                    onChangeText: inputChangedHandler.bind(this, 'description'),
                    value: inputs.description.value                
                }}
            />
            {formIsInvalid && <Text style={styles.errorText}>Invalid input value please check your entered data</Text>}
            <View style={styles.buttonContainer}>
                <Button style={styles.button} mode="flat" onPress={onCancel}>Cancel</Button>
                <Button style={styles.button} onPress={submitHandler}>{submitButtonLabel}</Button>
            </View>
        </View>
    )
}

export default ExpenseForm

const styles = StyleSheet.create({
    form:{
        marginTop: 40
    },
    title:{
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginVertical: 24,
        textAlign: 'center',
    },
    inputsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    rowInput: {
        flex: 1,
    },
    buttonContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button:{
        minWidth: 120,
        marginHorizontal: 8
    },
    errorText: {
        textAlign: 'center',
        color: GlobalStyles.colors.error500,
        margin: 8
    }
})