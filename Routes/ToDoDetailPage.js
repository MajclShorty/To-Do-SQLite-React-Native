import React, { useState } from "react";
import { View, StyleSheet, TextInput, Button } from "react-native";
import service from "../Models/ToDoService";
import ToDo from "../Models/ToDo";
import { useFocusEffect } from "@react-navigation/native";

export default function ToDoDetailPage({ route, navigation }) {
    const [inputText, setInputText] = useState("");
    const [todoId, setId] = useState(null);

    useFocusEffect(
        React.useCallback(() => {
            async function checkToDo() {
                if (route.params !== undefined) {
                    const todo = route.params;

                    setInputText(todo.text);
                    setId(todo.id);
                }
            }

            checkToDo();
        }, [])
    );

    const storeTodo = async () => {
        const date = new Date();
        const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        };

        const formattedDate = date.toLocaleDateString("en-US", options);

        const newTodo = new ToDo(inputText, formattedDate, null);
        if (todoId !== null) {
            newTodo.id = todoId;
            await service.UpdateToDo(newTodo);
        } else {
            await service.StoreToDo(newTodo);
        }

        navigation.navigate("ToDoListPage");
    };

    const removeToDo = async () => {
        if (todoId !== null) {
            await service.RemoveToDo(todoId);
        }

        navigation.navigate("ToDoListPage");
    };

    return (
        <View style={styles.container}>
            <TextInput
                onChangeText={(newText) => setInputText(newText)}
                style={styles.input}
                value={inputText}
            />

            <View
                style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "center",
                }}
            >
                <View style={styles.buttonWrap}>
                    <Button title="Uložit" onPress={storeTodo} />
                </View>

                <View style={styles.buttonWrap}>
                    <Button title="Smazat" onPress={() => removeToDo()} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        alignItems: "center",
    },
    buttonWrap: {
        width: "40%",
        margin: 10,
    },
    input: {
        fontSize: 22,
        width: "90%",
        height: 150,
        borderBottomWidth: 1,
        borderColor: "gray",
    },
});