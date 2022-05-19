import { FlatList, Text, StyleSheet } from "react-native"

import ExpenseItem from "./ExpenseItem"

function renderExpenseItem(itemData){
    return(
        //nom des attributs doivent être les mêmes que le nom des props
        <ExpenseItem {...itemData.item}/>
    )
}

function ExpensesList({expenses}){
    return(
        <FlatList
            data={expenses}
            keyExtractor={(item)=> item.id}
            renderItem={renderExpenseItem}
        />
    )
}

export default ExpensesList

