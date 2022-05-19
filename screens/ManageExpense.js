import {View, StyleSheet} from 'react-native'
import { useLayoutEffect, useContext, useState } from 'react'

import IconButton from '../components/UI/IconButton'
import Button from '../components/UI/Button'
import ExpenseForm from '../components/ManageExpense/ExpenseForm'
import LoadingOverlay from '../components/UI/LoadingOverlay'
import ErrorOverlay from '../components/UI/ErrorOverlay'

import { GlobalStyles } from '../constants/styles'
import {ExpensesContext} from '../store/expenses-context'
import { storeExpense, updateExpense, deleteExpense } from '../util/http'

function ManageExpense({route, navigation}){

    const expensesCtx = useContext(ExpensesContext)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState()

    //Pour savoir si on est dans un add ou update
    const isEditing = !!editedExpenseId //!! --> permet de convertir en boolean

    const editedExpenseId = route.params?.expenseId //prend comme valeur expenseId si il existe et undefined sinon

    //Les données de l'expense selectionnée
    const selectedExpense = expensesCtx.expenses.find((expense) => expense.id === editedExpenseId)
    
    useLayoutEffect(()=>{
        navigation.setOptions({
            title: isEditing ? 'Edit Expense' : 'Add Expense'
        })
    }, [navigation, isEditing])

    function cancelHandler(){
        navigation.goBack()
    }

    /**
     * Fonction pour supprimer une expense
     */
    async function deleteExpenseHandler(){
        setIsSubmitting(true)
        try {
            await deleteExpense(editedExpenseId)
            //setIsSubmitting(false) --> pas besoin car on ferme l'écran en faisant goBack()
            expensesCtx.deleteExpense(editedExpenseId)
            navigation.goBack()
        } catch (error) {
            setError('Could not delete expense - please try again later')
            setIsSubmitting(false)
        }
    }

    /**
     * Gère l'ajout et l'update des expenses
     */
    async function confirmHandler(expenseData){
        setIsSubmitting(true)
        try {
            //update
            if(isEditing){
                expensesCtx.updateExpense(editedExpenseId, expenseData)//update localy
                await updateExpense(editedExpenseId, expenseData) //update in the back
            }
            //ajout
            else{
                const id = await storeExpense(expenseData) //on enregistre dans la bdd --> une fois que c'est ok on reçoit un id
                expensesCtx.addExpense({...expenseData, id: id}) //on enregistre l'objet dans le contexte avec le bon id
            }
            navigation.goBack()
        } catch (error) {
            setError('Could not save data - please try again later')
            setIsSubmitting(false)
        }
    }

    if(error && !isSubmitting){
        return <ErrorOverlay message={error} />
    }

    if(isSubmitting){
        return <LoadingOverlay/>
    }

    return(
        <View style={styles.container}>
            <ExpenseForm 
                onCancel={cancelHandler}
                onSubmit={confirmHandler}
                submitButtonLabel={isEditing ? 'Update' : 'Add'}
                defaultValues={selectedExpense}
            />
            {isEditing &&
                <View style={styles.deleteContainer}>
                    <IconButton icon="trash" color={GlobalStyles.colors.error500} size={26} onPress={deleteExpenseHandler}/> 
                </View>
            }
        </View>
    )
}

export default ManageExpense

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: GlobalStyles.colors.primary800
    },
    deleteContainer: {
        marginTop: 16,
        paddingTop: 8,
        borderTopWidth: 2,
        borderTopColor: GlobalStyles.colors.primary200,
        alignItems: 'center'
    }
})