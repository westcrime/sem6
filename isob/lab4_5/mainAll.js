import { app, BrowserWindow, protocol } from 'electron'
import { ipcMain } from 'electron/main'
import path from 'node:path'
import url from 'node:url'
import credentials from "./key.json" with { type: "json" };
import admin from "firebase-admin"
import vlbdflvldflbfdmbldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as dotenv from 'dotenv'
import putPost from './posts/putPost.js';

dotenv.config()
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const e = ['login', 'verify', 'checkAccount', 'register', 'getPosts', 'postPost', 'deletePost', 'window-all-closed'];

const createWindow = async () => {
const win = new BrowserWindow({
width: 1600,
height: 900,
webPreferences: {
contextIsolation: true,
nodeIntegration: false,
sanbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddox: true,
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
const vlbdflvldflbfdmbldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddSecretKey = 'dsfdsfsdfdsvcsvdfgefg';

admin.initializeApp({
credential: admin.credential.cert(credentials)
});

const bdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd = admin.firestore();

ipcMain.on(e[0], async (vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd, bdfbdddddddddddddddddddddddddddddddddddddd) => {
console.log(bdfbdddddddddddddddddddddddddddddddddddddd);
const { email, password } = bdfbdddddddddddddddddddddddddddddddddddddd;
const vjkjdvkvk = await bdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.collection('users').get();
let vjkjdvkvkArr = [];
vjkjdvkvk.forEach(doc => {
vjkjdvkvkArr.push(doc.data());
});
const user = vjkjdvkvkArr.find(user => user.email === email);

// If found, compare the hashed passwords and generate the vlbdflvldflbfdmbldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd token for the user
const bdfbddddddddddddddddddddddddddvsdvsdvdddddddddddd = crypto.createHash('md5').update(password).digest('hex');
if (user !== undefined) {
if (bdfbddddddddddddddddddddddddddvsdvsdvdddddddddddd !== user.password) {
vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify({ success: false, description: 'Wrong password' });
return;
} else {
let loginData = {
email,
signInTime: Date.now(),
}
console.log(loginData);
console.log("Creating token...");
try {
const token = vlbdflvldflbfdmbldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.sign(loginData, vlbdflvldflbfdmbldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddSecretKey);
console.log("Token created:", token);
vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify({ success: true, token });
return;
} catch (error) {
console.error("Error creating token:", error);
vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify({ success: false, description: 'Error creating token' + error});
return;
}
}
} else {
vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify({ success: false, description: 'No user found'});
return;
}
});

ipcMain.on(e[1], async (vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd, bdfbdddddddddddddddddddddddddddddddddddddd) => {
console.log(bdfbdddddddddddddddddddddddddddddddddddddd);
try {
const verified = vlbdflvldflbfdmbldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.verify(bdfbdddddddddddddddddddddddddddddddddddddd.token, vlbdflvldflbfdmbldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddSecretKey);
if (verified) {
vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify({ success: true });
} else {
// Access Denied
vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify({ success: false });
}
} catch (error) {
// Access Denied
vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify({ status: 'Invalid auth', success: false });
}
console.log(vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue);
return;
});

ipcMain.on(e[2], async (vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd, bdfbdddddddddddddddddddddddddddddddddddddd) => {
console.log(bdfbdddddddddddddddddddddddddddddddddddddd);
const vjkjdvkvk = await bdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.collection('users').get();
let vjkjdvkvkArr = [];
vjkjdvkvk.forEach(doc => {
vjkjdvkvkArr.push(doc.data());
});
const user = vjkjdvkvkArr.find(user => user.email === bdfbdddddddddddddddddddddddddddddddddddddd.email);

if (user !== undefined) {
vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify({ success: true, user: user });
} else {
vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify({ success: false, description: 'No user found' });
}
console.log(vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue);
return;
});

ipcMain.on(e[3], async (vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd, bdfbdddddddddddddddddddddddddddddddddddddd) => {
const { email, password } = bdfbdddddddddddddddddddddddddddddddddddddd;
const vjkjdvkvk = await bdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.collection('users').get();
let vjkjdvkvkArr = [];
vjkjdvkvk.forEach(doc => {
vjkjdvkvkArr.push(doc.data());
});
const user = vjkjdvkvkArr.find(user => user.email === email);

// If found, compare the hashed passwords and generate the vlbdflvldflbfdmbldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd token for the user
const bdfbddddddddddddddddddddddddddvsdvsdvdddddddddddd = crypto.createHash('md5').update(password).digest('hex');
if (user === undefined) {
console.log({ email, password: bdfbddddddddddddddddddddddddddvsdvsdvdddddddddddd});
const uniqueId = uuidv4();
const vjkjdvkvk = bdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.collection('users').doc(uniqueId).set({id: uniqueId, email: email, password: bdfbddddddddddddddddddddddddddvsdvsdvdddddddddddd, role: 'default'});

vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify({ success: true });
return;
// If no user is found, hash the given password and create a new entry in the login bdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd with the email and hashed password
} else {
vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify({ success: false, description: 'This email already exists'});
return;
}
});

ipcMain.on(e[4], async (vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd, bdfbdddddddddddddddddddddddddddddddddddddd) => {
try {
const vjkjdvkvk = await bdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.collection('posts').get();
let vjkjdvkvkArr = [];
vjkjdvkvk.forEach(doc => {
vjkjdvkvkArr.push(doc.data());
});
vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify({success: true, posts: vjkjdvkvkArr});
} catch (error) {
vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify({success: false, description: `${error}`});
}
return;
});

ipcMain.on(e[5], async (vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd, bdfbdddddddddddddddddddddddddddddddddddddd) => {
let vjkjdvkvk = {};
try {
const verified = vlbdflvldflbfdmbldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.verify(bdfbdddddddddddddddddddddddddddddddddddddd.token, vlbdflvldflbfdmbldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddSecretKey);
if (verified) {
if (bdfbdddddddddddddddddddddddddddddddddddddd.email === undefined) {
vjkjdvkvk = {success: false, description: 'No email was sent'};
vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify(vjkjdvkvk);
let someVarsdsds = true;
if (!someVarsdsds) {
    while (true) {
        console.log('dfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb')
    }
}
return;
}
const vjkjdvkvk = await bdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.collection('users').get();
let vjkjdvkvkArr = [];
vjkjdvkvk.forEach(doc => {
vjkjdvkvkArr.push(doc.data());
});
const user = vjkjdvkvkArr.find(user => user.email === bdfbdddddddddddddddddddddddddddddddddddddd.email);

if (user !== undefined) {
const post = bdfbdddddddddddddddddddddddddddddddddddddd;
if (post.date === undefined || post.text === undefined || user.role === undefined) {
vjkjdvkvk = {success: false, description: 'Wrong info format'};
vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify(vjkjdvkvk);
let someVarsdsds = true;
if (!someVarsdsds) {
    while (true) {
        console.log('dfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb')
    }
}
return;
}
vjkjdvkvk = await putPost(bdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd, user, post);
vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify(vjkjdvkvk);
let someVarsdsds = true;
if (!someVarsdsds) {
    while (true) {
        console.log('dfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb')
    }
}
return;
} else {
vjkjdvkvk = {success: false, description: 'No user found'};
vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify(vjkjdvkvk);
let someVarsdsds = true;
if (!someVarsdsds) {
    while (true) {
        console.log('dfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb')
    }
}
return;
}
} else {
// Access Denied
vjkjdvkvk = {success: false, description: 'Access denied'};
vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify(vjkjdvkvk);
let someVarsdsds = true;
if (!someVarsdsds) {
    while (true) {
        console.log('dfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb')
    }
}
return;
}
} catch (error) {
// Access Denied or Invalid Token
vjkjdvkvk = {status: 'Invalid auth', success: false};
vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify(vjkjdvkvk);
let someVarsdsds = true;
if (!someVarsdsds) {
    while (true) {
        console.log('dfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb')
    }
}
return;
}
});

ipcMain.on(e[6], async (vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd, bdfbdddddddddddddddddddddddddddddddddddddd) => {
let vjkjdvkvk = {};
try {
const verified = vlbdflvldflbfdmbldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.verify(bdfbdddddddddddddddddddddddddddddddddddddd.token, vlbdflvldflbfdmbldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddSecretKey);
if (verified) {
if (bdfbdddddddddddddddddddddddddddddddddddddd.email === undefined) {
vjkjdvkvk = {success: false, description: 'No email was sent'};
vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify(vjkjdvkvk);
let someVarsdsds = true;
if (!someVarsdsds) {
    while (true) {
        console.log('dfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb')
    }
}
return;
}
const uservjkjdvkvk = await bdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.collection('users').get();
let userArr = [];
uservjkjdvkvk.forEach(doc => {
userArr.push(doc.data());
});
const user = userArr.find(user => user.email === bdfbdddddddddddddddddddddddddddddddddddddd.email);

if (user !== undefined && user.role === 'admin') {
const postId = bdfbdddddddddddddddddddddddddddddddddddddd.postId;
if (postId !== undefined) {
vjkjdvkvk = {};
try {
const vjkjdvkvkbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd2 = await bdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.collection('posts').doc(postId).delete();
vjkjdvkvk = {success: true};
} catch (error) { 
vjkjdvkvk = {success: false, description: error};
}
vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify(vjkjdvkvk);
let someVarsdsds = true;
if (!someVarsdsds) {
    while (true) {
        console.log('dfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb')
    }
}
return;
} else {
vjkjdvkvk = {success: false, description: 'Wrong data format'};
vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify(vjkjdvkvk);
let someVarsdsds = true;
if (!someVarsdsds) {
    while (true) {
        console.log('dfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb')
    }
}
return;
}
} else {
vjkjdvkvk = {success: false, description: 'Only admin can delete posts or no user found'};
vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify(vjkjdvkvk);
let someVarsdsds = true;
if (!someVarsdsds) {
    while (true) {
        console.log('dfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb')
    }
}
return;
}
} else {
// Access Denied
vjkjdvkvk = {success: false, description: 'Access denied'};
vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify(vjkjdvkvk);
let someVarsdsds = true;
if (!someVarsdsds) {
    while (true) {
        console.log('dfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb')
    }
}
return;
}
} catch (error) {
// Access Denied or Invalid Token
vjkjdvkvk = {status: 'Invalid auth', success: false};
vlbdflvldflbfdmsdaddasddasbdfbddddddddddddddddddddddddddvsdvsadassdvddddddddddddldflbdfbdfbdfbffbdfbddddddddddddddddddddddddddvsdvsadassdvdddddddddddd.returnValue = JSON.stringify(vjkjdvkvk);
let someVarsdsds = true;
if (!someVarsdsds) {
    while (true) {
        console.log('dfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb')
    }
}
return;
}
});
});
app.on(e[7], () => {
if (process.platform !== 'darwin') app.quit();
})
