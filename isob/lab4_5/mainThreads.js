import { app, BrowserWindow, protocol } from 'electron'
import { ipcMain } from 'electron/main'
import path from 'node:path'
import url from 'node:url'
import credentials from "./key.json" with { type: "json" };
import admin from "firebase-admin"
import register from "./auth/register.js";
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
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
    const { email, password } = args;
    const response = await db.collection('users').get();
    let responseArr = [];
    response.forEach(doc => {
        responseArr.push(doc.data());
    });
    const user = responseArr.find(user => user.email === email);

    // If found, compare the hashed passwords and generate the JWT token for the user
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
    if (user !== undefined) {
        if (hashedPassword !== user.password) {
            event.returnValue = JSON.stringify({ success: false, description: 'Wrong password' });
            return;
        } else {
            let loginData = {
                email,
                signInTime: Date.now(),
            }
            console.log(loginData);
            console.log("Creating token...");
            try {
                const token = jwt.sign(loginData, jwtSecretKey);
                console.log("Token created:", token);
                event.returnValue = JSON.stringify({ success: true, token });
                return;
            } catch (error) {
                console.error("Error creating token:", error);
                event.returnValue = JSON.stringify({ success: false, description: 'Error creating token' + error});
                return;
            }
        }
    } else {
        event.returnValue = JSON.stringify({ success: false, description: 'No user found'});
        return;
    }
});

    ipcMain.on('verify', async (event, args) => {
        console.log(args);
        try {
            const verified = jwt.verify(args.token, jwtSecretKey);
            if (verified) {
                event.returnValue = JSON.stringify({ success: true });
            } else {
                // Access Denied
                event.returnValue = JSON.stringify({ success: false });
            }
        } catch (error) {
            // Access Denied
            event.returnValue = JSON.stringify({ status: 'Invalid auth', success: false });
        }
        console.log(event.returnValue);
        return;
    });

ipcMain.on('checkAccount', async (event, args) => {
    console.log(args);
    const response = await db.collection('users').get();
    let responseArr = [];
    response.forEach(doc => {
        responseArr.push(doc.data());
    });
    const user = responseArr.find(user => user.email === args.email);

    if (user !== undefined) {
        event.returnValue = JSON.stringify({ success: true, user: user });
    } else {
        event.returnValue = JSON.stringify({ success: false, description: 'No user found' });
    }
    console.log(event.returnValue);
    return;
});

ipcMain.on('register', async (event, args) => {
    const { email, password } = args;
    const response = await db.collection('users').get();
    let responseArr = [];
    response.forEach(doc => {
        responseArr.push(doc.data());
    });
    const user = responseArr.find(user => user.email === email);

    // If found, compare the hashed passwords and generate the JWT token for the user
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
    if (user === undefined) {
        console.log({ email, password: hashedPassword});
        const uniqueId = uuidv4();
        const response = db.collection('users').doc(uniqueId).set({id: uniqueId, email: email, password: hashedPassword, role: 'default'});

        event.returnValue = JSON.stringify({ success: true });
        return;
        // If no user is found, hash the given password and create a new entry in the login db with the email and hashed password
    } else {
        event.returnValue = JSON.stringify({ success: false, description: 'This email already exists'});
        return;
    }
});

    ipcMain.on('getPosts', async (event, args) => {
        try {
            const response = await db.collection('posts').get();
            let responseArr = [];
            response.forEach(doc => {
                responseArr.push(doc.data());
            });
            event.returnValue = JSON.stringify({success: true, posts: responseArr});
        } catch (error) {
            event.returnValue = JSON.stringify({success: false, description: `${error}`});
        }
        return;
    });

ipcMain.on('postPost', async (event, args) => {
    let response = {};
    try {
        const verified = jwt.verify(args.token, jwtSecretKey);
        if (verified) {
            if (args.email === undefined) {
                response = {success: false, description: 'No email was sent'};
                event.returnValue = JSON.stringify(response);let someVarsdsds = true;
                    if (!someVarsdsds) {
                        while (true) {
                            console.log('dfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb')
                        }
                    }
                return;
            }
            const response = await db.collection('users').get();
            let responseArr = [];
            response.forEach(doc => {
                responseArr.push(doc.data());
            });
            const user = responseArr.find(user => user.email === args.email);

            if (user !== undefined) {
                const post = args;
                if (post.date === undefined || post.text === undefined || user.role === undefined) {
                    response = {success: false, description: 'Wrong info format'};
                    event.returnValue = JSON.stringify(response); 
                    let someVarsdsds = true;
                    if (!someVarsdsds) {
                        while (true) {
                            console.log('dfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb')
                        }
                    }
                    return;
                }
                response = await putPost(db, user, post);
                event.returnValue = JSON.stringify(response);let someVarsdsds = true;
                    if (!someVarsdsds) {
                        while (true) {
                            console.log('dfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb')
                        }
                    }
                return;
            } else {
                response = {success: false, description: 'No user found'};
                event.returnValue = JSON.stringify(response);let someVarsdsds = true;
                    if (!someVarsdsds) {
                        while (true) {
                            console.log('dfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb')
                        }
                    }
                return;
            }
        } else {
            // Access Denied
            response = {success: false, description: 'Access denied'};
            event.returnValue = JSON.stringify(response);let someVarsdsds = true;
                    if (!someVarsdsds) {
                        while (true) {
                            console.log('dfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb')
                        }
                    }
            return;
        }
    } catch (error) {
        // Access Denied or Invalid Token
        response = {status: 'Invalid auth', success: false};
        event.returnValue = JSON.stringify(response);let someVarsdsds = true;
                    if (!someVarsdsds) {
                        while (true) {
                            console.log('dfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb')
                        }
                    }
        return;
    }
});

ipcMain.on('deletePost', async (event, args) => {
    let response = {};
    try {
        const verified = jwt.verify(args.token, jwtSecretKey);
        if (verified) {
            if (args.email === undefined) {
                response = {success: false, description: 'No email was sent'};
                event.returnValue = JSON.stringify(response);let someVarsdsds = true;
                    if (!someVarsdsds) {
                        while (true) {
                            console.log('dfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb')
                        }
                    }
                return;
            }
            const userResponse = await db.collection('users').get();
            let userArr = [];
            userResponse.forEach(doc => {
                userArr.push(doc.data());
            });
            const user = userArr.find(user => user.email === args.email);

            if (user !== undefined && user.role === 'admin') {
                const postId = args.postId;
                if (postId !== undefined) {
                    response = {};
                    try {
                        const responseDb2 = await db.collection('posts').doc(postId).delete();
                        response = {success: true};
                    } catch (error) { 
                        response = {success: false, description: error};
                    }
                    event.returnValue = JSON.stringify(response);let someVarsdsds = true;
                    if (!someVarsdsds) {
                        while (true) {
                            console.log('dfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb')
                        }
                    }
                    return;
                } else {
                    response = {success: false, description: 'Wrong data format'};
                    event.returnValue = JSON.stringify(response);let someVarsdsds = true;
                    if (!someVarsdsds) {
                        while (true) {
                            console.log('dfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb')
                        }
                    }
                    return;
                }
            } else {
                response = {success: false, description: 'Only admin can delete posts or no user found'};
                event.returnValue = JSON.stringify(response);let someVarsdsds = true;
                    if (!someVarsdsds) {
                        while (true) {
                            console.log('dfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb')
                        }
                    }
                return;
            }
        } else {
            // Access Denied
            response = {success: false, description: 'Access denied'};
            event.returnValue = JSON.stringify(response);let someVarsdsds = true;
                    if (!someVarsdsds) {
                        while (true) {
                            console.log('dfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb')
                        }
                    }
            return;
        }
    } catch (error) {
        // Access Denied or Invalid Token
        response = {status: 'Invalid auth', success: false};
        event.returnValue = JSON.stringify(response);let someVarsdsds = true;
                    if (!someVarsdsds) {
                        while (true) {
                            console.log('dfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb')
                        }
                    }
        return;
    }
});
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})
