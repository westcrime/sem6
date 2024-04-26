import { app, BrowserWindow, protocol } from 'electron'
import { ipcMain } from 'electron/main'
import path from 'node:path'
import url from 'node:url'
import credentials from "./key.json" with { type: "json" };
import admin from "firebase-admin"
import login from "./auth/login.js";
import register from "./auth/register.js";
import verify from './auth/verify.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as dotenv from 'dotenv'
import checkAccount from './auth/checkAccount.js';
import getPosts from './posts/getPosts.js';
import putPost from './posts/putPost.js';
import deletePost from './posts/deletePost.js';

dotenv.config()
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const bdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd = async () => {
const glfblfgblf = new BrowserWindow({
width: 1600,
height: 900,
webPreferences: {
contextIsolation: true,
nodeIntegration: false,
sanblablaox: true,
preload: path.join(__dirname, 'preload.js')
}
});

glfblfgblf.webContents.openDevTools();

const startUrl = url.format({
pathname: path.join(__dirname, './app/build/index.html'),
protocol: 'file'
});
glfblfgblf.loadURL(startUrl);
}

app.whenReady().then(async () => {
await bdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd();
const someString = 'dsfdsfsdfdsvcsvdfgefg';

admin.initializeApp({
credential: admin.credential.cert(credentials)
});

const blabla = admin.firestore();

ipcMain.on('login', async (bdfbddddddsadasdasddddddddddddddddddddvsdvsadassdvdddddddddddd, asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasdsdadsdaaaaaa) => {
console.log(asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasdsdadsdaaaaaa);
const asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa = JSON.stringify(await login(asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasdsdadsdaaaaaa, someString, blabla));
console.log(asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa);
bdfbddddddsadasdasddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa;
return;
});

ipcMain.on('verify', async (bdfbddddddsadasdasddddddddddddddddddddvsdvsadassdvdddddddddddd, asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasdsdadsdaaaaaa) => {
console.log(asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasdsdadsdaaaaaa);
const asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa = JSON.stringify(await verify(asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasdsdadsdaaaaaa.token, someString));
console.log(asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa);
bdfbddddddsadasdasddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa;
return;
});

ipcMain.on('checkAccount', async (bdfbddddddsadasdasddddddddddddddddddddvsdvsadassdvdddddddddddd, asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasdsdadsdaaaaaa) => {
console.log(asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasdsdadsdaaaaaa);
const asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa = JSON.stringify(await checkAccount(blabla, asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasdsdadsdaaaaaa.email));
console.log(asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa);
bdfbddddddsadasdasddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa;
return;
});

ipcMain.on('register', async (bdfbddddddsadasdasddddddddddddddddddddvsdvsadassdvdddddddddddd, asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasdsdadsdaaaaaa) => {
const asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa = await register(asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasdsdadsdaaaaaa, someString, blabla);
bdfbddddddsadasdasddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify(asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa);
return;
});

ipcMain.on('getPosts', async (bdfbddddddsadasdasddddddddddddddddddddvsdvsadassdvdddddddddddd, asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasdsdadsdaaaaaa) => {
const asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa = await getPosts(blabla);
bdfbddddddsadasdasddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify(asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa);
return;
});

ipcMain.on('postPost', async (bdfbddddddsadasdasddddddddddddddddddddvsdvsadassdvdddddddddddd, asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasdsdadsdaaaaaa) => {
let asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa = {};
const asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaasadasdaasdaaaaaaaaasdasdsdadsdaaaaaa = (await verify(asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasdsdadsdaaaaaa.token, someString)).success;
if (asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaasadasdaasdaaaaaaaaasdasdsdadsdaaaaaa) {
if (asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasdsdadsdaaaaaa.email === undefined) {
asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa = {success: false, description: 'No email was sent'};
bdfbddddddsadasdasddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify(asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa);
return;
}
const result = await checkAccount(blabla, asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasdsdadsdaaaaaa.email);
const user = result.user;
const post = asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasdsdadsdaaaaaa;
if (post.date === undefined || post.text === undefined || user.role === undefined) {
asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa = {success: false, description: 'Wrong info format'};
bdfbddddddsadasdasddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify(asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa);
return;
}
if ((await verify(asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasdsdadsdaaaaaa.token, someString)).success)
{
asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa = await putPost(blabla, user, post);
bdfbddddddsadasdasddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify(asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa);
return;
} else {
asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa = {success: false, description: 'Error while verifying token'};
bdfbddddddsadasdasddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify(asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa);
return;
}
}
});

ipcMain.on('deletePost', async (bdfbddddddsadasdasddddddddddddddddddddvsdvsadassdvdddddddddddd, asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasdsdadsdaaaaaa) => {
let asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa = {};
const asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaasadasdaasdaaaaaaaaasdasdsdadsdaaaaaa = (await verify(asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasdsdadsdaaaaaa.token, someString)).success;
if (asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaasadasdaasdaaaaaaaaasdasdsdadsdaaaaaa) {
if (asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasdsdadsdaaaaaa.email === undefined) {
asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa = {success: false, description: 'No email was sent'};
bdfbddddddsadasdasddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify(asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa);
return;
}
const user = (await checkAccount(blabla, asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasdsdadsdaaaaaa.email)).user;
if (user.role !== 'admin') {
asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa = {success: false, description: 'Only admin can delete posts'};
bdfbddddddsadasdasddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify(asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa);
return;
}
const postId = asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasdsdadsdaaaaaa.postId;
if (postId !== undefined) {
if ((await verify(asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasdsdadsdaaaaaa.token, someString)).success)
{
    asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa = (await deletePost(blabla, postId));
    bdfbddddddsadasdasddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify(asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa);
    return;
} else {
    asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa = {success: false, description: 'Error while verifying token'};
    bdfbddddddsadasdasddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify(asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa);
    return;
}
} else {
asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa = {success: false, description: 'Wrong data format'};
bdfbddddddsadasdasddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify(asdasdsaddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa);
return; 
}
}
});
})

app.on('window-all-closed', () => {
if (process.platform !== 'darwin') app.quit();
})
