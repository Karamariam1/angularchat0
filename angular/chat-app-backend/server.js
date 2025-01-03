const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:4200', // URL du frontend Angular
        methods: ['GET', 'POST']
    }
});

app.use(cors());

app.get('/', (req, res) => {
    res.send('Bienvenue sur le serveur Socket.io');
});

// Liste des utilisateurs connectés
const onlineUsers = [];


io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté');

    socket.on('setUsername', (username) => {
        socket.data.username = username;
        onlineUsers.push(username); // Ajouter l'utilisateur à la liste
        io.emit('userList', onlineUsers); // Envoyer la liste des utilisateurs à tous
        console.log(`${username} s'est connecté`);
    });

    socket.on('message', (data) => {
        console.log(`Message reçu de ${data.username}: ${data.text}`);
        io.emit('message', data); // Diffuser à tous les clients
    });

    // Lorsqu'un utilisateur se déconnecte
    socket.on('disconnect', () => {
        console.log(`${socket.data.username || 'Un utilisateur inconnu'} s'est déconnecté`);
        onlineUsers = onlineUsers.filter(user => user !== socket.data.username); // Retirer l'utilisateur
        io.emit('userList', onlineUsers); // Mettre à jour la liste des utilisateurs
    });
});


const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
