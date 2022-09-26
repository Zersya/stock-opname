import {Databases, Client, Functions} from "appwrite";

const client = new Client()
    .setEndpoint('https://appwrite.maresto.id/v1')
    .setProject('632dfb5a49b6434f13e3')

const database = new Databases(client)
const fun = new Functions(client)

export { database, fun }
