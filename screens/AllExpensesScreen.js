import {Text} from 'react-native'
import { useContext } from 'react'

import ExpensesOutput from '../components/ExpensesOutput/ExpensesOutput'
import { ExpensesContext } from '../store/expenses-context'

function AllExpenses(){

    const expensesCtx = useContext(ExpensesContext)

    return(
        <ExpensesOutput expenses={expensesCtx.expenses} expensesPeriod="Total" fallBackText="No expenses registered"/>
    )
}

export default AllExpenses