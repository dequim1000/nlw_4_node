import {Connection, createConnection, getConnectionOptions } from "typeorm";

export default async (): Promise<Connection> => {
    const defaultOptions = await getConnectionOptions();
    return createConnection(
        Object.assign(defaultOptions, {
            database: process.env.NODE_ENV === 'test' // Sefor igual
            ? "./src/database/database.test.sqlite"  // executa esse comando
            : defaultOptions.database, // Caso contrario executa esse comando
        })
    );
};