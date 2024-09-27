import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("db.todos");

class ToDoService {
    constructor() {}

    StoreToDo = async (todo) => {
        return new Promise((resolve, reject) => {
            db.transaction(
                (tx) => {
                    tx.executeSql(
                        "INSERT INTO todos (text, date) VALUES (?, ?)",
                        [todo.text, todo.date],
                        (_, { insertId }) => {
                            resolve(insertId);
                        },
                        (_, error) => {
                            reject(error);
                        }
                    );
                },
                null,
                null
            );
        });
    };

    GetAllToDos = async () => {
        return new Promise((resolve, reject) => {
            db.transaction(
                (tx) => {
                    tx.executeSql(
                        "SELECT * FROM todos",
                        [], //placeholders
                        (_, { rows }) => {
                            const todos = rows._array.map((row) => ({
                                ...row,
                                text: row.text.replace(/^"(.*)"$/, "$1"),
                                date: row.date.replace(/^"(.*)"$/, "$1"),
                            }));
                            resolve(todos);
                        },
                        (_, error) => {
                            reject(error);
                        }
                    );
                },
                null,
                null
            );
        });
    };

    RemoveToDo = async (id) => {
        return new Promise((resolve, reject) => {
            db.transaction(
                (tx) => {
                    tx.executeSql(
                        "DELETE FROM todos WHERE id = ?",
                        [id],
                        (_) => {
                            resolve(true);
                        },
                        (_, error) => {
                            reject(error);
                        }
                    );
                },
                null,
                null
            );
        });
    };

    UpdateToDo = async (todo) => {
        return new Promise((resolve, reject) => {
            db.transaction(
                (tx) => {
                    tx.executeSql(
                        "UPDATE todos SET text = ?, date = ? WHERE id = ?",
                        [todo.text, todo.date, todo.id],
                        (_) => {
                            resolve(true);
                        },
                        (_, error) => {
                            reject(error);
                        }
                    );
                },
                null,
                null
            );
        });
    };
}

const service = new ToDoService();

export default service;