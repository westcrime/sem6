import { app, BrowserWindow, protocol } from 'electron'
import { ipcMain } from 'electron/main'
import path from 'node:path'
import url from 'node:url'
import credentials from "./key.json" with { type: "json" };
import admin from 'firebase-admin'
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

const createWindow = async () => {
    const win = new BrowserWindow({
        width: 1600,
        height: 900,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.webContents.openDevTools();

    const startUrl = url.format({
        pathname: path.join(__dirname, './app/build/index.html'),
        protocol: 'file'
    });
    win.loadURL(startUrl);
}

app.whenReady().then(async () => {
    await createWindow();
    const jwtSecretKey = 'dsfdsfsdfdsvcsvdfgefg';

    admin.initializeApp({
        credential: admin.credential.cert(credentials)
    });

    const db = admin.firestore();

    ipcMain.on('login', async (event, args) => {
        console.log(args);
        const response = JSON.stringify(await login(args, jwtSecretKey, db));
        console.log(response);
        event.returnValue = response;
        return;
    });

    ipcMain.on('verify', async (event, args) => {
        console.log(args);
        const response = JSON.stringify(await verify(args.token, jwtSecretKey));
        console.log(response);
        event.returnValue = response;
        return;
    });

    ipcMain.on('checkAccount', async (event, args) => {
        console.log(args);
        const response = JSON.stringify(await checkAccount(db, args.email));
        console.log(response);
        event.returnValue = response;
        return;
    });

    ipcMain.on('register', async (event, args) => {
        const response = await register(args, jwtSecretKey, db);
        event.returnValue = JSON.stringify(response);
        return;
    });

    ipcMain.on('getPosts', async (event, args) => {
        const response = await getPosts(db);
        event.returnValue = JSON.stringify(response);
        return;
    });

    ipcMain.on('postPost', async (event, args) => {
        let response = {};
        const isVerified = (await verify(args.token, jwtSecretKey)).success;
        if (isVerified) {
            if (args.email === undefined) {
                response = {success: false, description: 'No email was sent'};
                event.returnValue = JSON.stringify(response);
                return;
            }
            const result = await checkAccount(db, args.email);
            const user = result.user;
            const post = args;
            if (post.date === undefined || post.text === undefined || user.role === undefined) {
                response = {success: false, description: 'Wrong info format'};
                event.returnValue = JSON.stringify(response);
                return;
            }
            if ((await verify(args.token, jwtSecretKey)).success)
            {
                response = await putPost(db, user, post);
                event.returnValue = JSON.stringify(response);
                return;
            } else {
                response = {success: false, description: 'Error while verifying token'};
                event.returnValue = JSON.stringify(response);
                return;
            }
        }
    });

    ipcMain.on('deletePost', async (event, args) => {
        let response = {};
        const isVerified = (await verify(args.token, jwtSecretKey)).success;
        if (isVerified) {
            if (args.email === undefined) {
                response = {success: false, description: 'No email was sent'};
                event.returnValue = JSON.stringify(response);
                return;
            }
            const user = (await checkAccount(db, args.email)).user;
            if (user.role !== 'admin') {
                response = {success: false, description: 'Only admin can delete posts'};
                event.returnValue = JSON.stringify(response);
                return;
            }
            const postId = args.postId;
            if (postId !== undefined) {
                if ((await verify(args.token, jwtSecretKey)).success)
                {
                    response = (await deletePost(db, postId));
                    event.returnValue = JSON.stringify(response);
                    return;
                } else {
                    response = {success: false, description: 'Error while verifying token'};
                    event.returnValue = JSON.stringify(response);
                    return;
                }
            } else {
                response = {success: false, description: 'Wrong data format'};
                event.returnValue = JSON.stringify(response);
                return; 
            }
        }
    });
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})
