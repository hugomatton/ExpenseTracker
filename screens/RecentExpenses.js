import {Text} from 'react-native'
import { useContext, useEffect, useState} from 'react'

import ExpensesOutput from '../components/ExpensesOutput/ExpensesOutput'
import { ExpensesContext } from '../store/expenses-context'
import {getDateMinusDays} from '../util/date'
import { fetchExpense } from '../util/http'
import LoadingOverlay from '../components/UI/LoadingOverlay'
import ErrorOverlay from '../components/UI/ErrorOverlay'

function RecentExpenses(){

    //Gestion de cas précis
    const [isFetching, setIsFetching] = useState(true)
    const [error, setError] = useState()

    //Contexte
    const expensesCtx = useContext(ExpensesContext)

    //Recent expenses
    const recentExpenses = expensesCtx.expenses.filter((expense) => {
        const today = new Date();
        const date7DaysAgo = getDateMinusDays(today, 7);
        return (expense.date >= date7DaysAgo) && (expense.date <= today);
    });

    /**
     * RecentExpenses est le screen d'accueil
     * Cette fonction permet d'initialiser le contexte de l'application 
     */
    useEffect(()=>{
        async function getExpenses(){
            setIsFetching(true) //données par chargées
            try {
                const expenses = await fetchExpense()
                expensesCtx.setExpenses(expenses)
            } catch (error) {
                setError('Could not fetch expenses!')
            }
            setIsFetching(false) //données chargées
        }
        getExpenses()
    }, [])

    if (error && !isFetching){
        return <ErrorOverlay message={error} />
    }

    if(isFetching){
        return <LoadingOverlay/>
    }

    return(
        <ExpensesOutput expenses={recentExpenses} expensesPeriod="Last 7 Days" fallBackText="No exepnses registered for the last 7 days"/>
    )
}

export default RecentExpenses