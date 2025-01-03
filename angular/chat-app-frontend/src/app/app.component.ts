import { Component, OnInit } from '@angular/core';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  socket: any;
  messages: { username: string; text: string }[] = [];
  message: string = '';
  username: string = '';
  isUsernameSet: boolean = false;
  onlineUsers: string[] = []; // Liste des utilisateurs en ligne

  ngOnInit() {
    this.socket = io('http://localhost:3000'); // Connexion au backend

    // Écoute de l'événement 'message'
    this.socket.on('message', (data: { username: string; text: string }) => {
      console.log('Message reçu:', data); // Vérifiez si les messages sont reçus
      this.messages.push(data); // Ajouter le message à la liste
    });


    this.socket.on('userList', (users: string[]) => {
      console.log('Utilisateurs en ligne:', users); // Vérifier si la liste est bien reçue
      this.onlineUsers = users; // Mettre à jour la liste des utilisateurs
    });
  }

  setUsername() {
    if (this.username.trim()) {
      this.socket.emit('setUsername', this.username); // Envoyer le nom d'utilisateur au backend
      this.isUsernameSet = true;
    } else {
      alert('Veuillez entrer un nom d\'utilisateur.');
    }
  }

  sendMessage() {
    if (this.message.trim()) {
      const data = { username: this.username, text: this.message };
      this.socket.emit('message', data); // Envoyer le message avec le nom d'utilisateur
      this.message = ''; // Réinitialiser le champ
    }
  }
}
