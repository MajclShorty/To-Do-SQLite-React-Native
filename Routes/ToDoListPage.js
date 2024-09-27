import React, { useState, useEffect } from "react";
import {
    View,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";
import { CheckBox } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import service from "../Models/ToDoService";
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("db.todos");

const Todo = ({ text, date }) => {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <View style={styles.todo}>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{text}</Text>
                <Text>{date}</Text>
            </View>
            <CheckBox
                containerStyle={styles.checkboxContainer}
                checked={isChecked}
                onPress={() => setIsChecked(!isChecked)}
            />
        </View>
    );
};

const Separator = () => <View style={styles.separator} />;

export default function ToDoListPage({ route, navigation }) {
    const [ToDos, setToDos] = useState([]);

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, date TEXT)"
            );
        });
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            async function getToDos() {
                let todos = await service.GetAllToDos();

                setToDos(todos);
            }

            getToDos();
        }, [])
    );

    const openToDo = (todo) => {
        navigation.navigate("ToDoDetailPage", todo);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={ToDos}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => openToDo(item)}>
                        <Todo text={item.text} date={item.date} />
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={Separator}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    todo: {
        margin: 5,
        width: 350,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    textContainer: {
        flex: 1,
        flexDirection: "column",
    },
    text: {
        fontSize: 20,
    },
    separator: {
        height: 1,
        backgroundColor: "#ccc",
    },
});