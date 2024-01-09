import bodyParser from 'body-parser';
import jsonServer from 'json-server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from "./app/auth/user.model";
import express from 'express';

const server = express();
server.use(bodyParser.json());

const secretKey = 'your-secret-key';

server.post('/login', (req, res) => {
    const { email, password } = req.body;
    const users = require('./db.json/users');
    
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (user) {
        const token = jwt.sign({ email: user.email, id: user.id }, secretKey, { expiresIn: '1h' });
        res.json({ userFound: true, token });
    } else {
        res.json({ userFound: false });
    }
});

server.get('/get-user', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
        try {
            const decodedToken: any = jwt.verify(token, secretKey);
            const users = require('./db.json').users;
            const user = users.find((u: any) => u.email === decodedToken.email && u.id === decodedToken.id);
            
            if (user) {
                res.json({ user });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(401).json({ message: 'Invalid token' });
        }
    } else {
        res.status(401).json({ message: 'Token not provided' });
    }
});

server.post('/users', (req, res) => {
    const { email, password } = req.body;
    const users = require('./db.json').users;
    
    const existingUser = users.find((u: any) => u.email === email);
    if (existingUser) {
        res.status(400).json({ message: 'Email already exists' });
        return;
    }
    
    const hashedPassword = bcrypt.hashSync(password, 10);
    const nextId = (Math.max(...users.map((user: User) => +user.id)) + 1).toString();
    
    const newUser = {
        id: nextId,
        email: email,
        password: hashedPassword,
        _token: '',
        _tokenExpirationDate: new Date(),
        token: ''
    };
    
    users.push(newUser);
    
    const fs = require('fs');
    const path = require('path');
    const dbPath = path.join(__dirname, 'db.json');
    fs.writeFileSync(dbPath, JSON.stringify({ users: users }));
    
    const token = jwt.sign({ email: newUser.email, id: newUser.id }, secretKey, { expiresIn: '1h' });
    
    res.json({ userFound: true, token });
});

server.use(jsonServer.router('./db.json'));

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
