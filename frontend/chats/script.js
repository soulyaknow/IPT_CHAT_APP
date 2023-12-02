    const token = localStorage.getItem('token');

    const socket = io("http://localhost:4002", {
        query: {token}
    });

    const url = "http://localhost:4001/messages";
    
    function sendMessage() {
        var messageInput = document.getElementById("message-input");
        var messageText = messageInput.value.trim();

        if (messageText !== "") {

            const id = localStorage.getItem('userid');
            const name = localStorage.getItem('name');
            socket.emit('chat', { userid: id, message: messageText, username : name });

            var chatMessages = document.getElementById("chat-messages");
            
            var userMessage = document.createElement("div");
            userMessage.className = "message user-message";
            userMessage.innerHTML = '<p>' + messageText + '</p>';

            chatMessages.appendChild(userMessage);
            messageInput.value = "";
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    function fetchAndDisplayMessages() {
        
        fetch(url, {
            method: "GET",
            headers: {
                "Authorization" : token
            }
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            const chatMessages = document.getElementById('chat-messages');
            data.forEach((messageObj) => {

                const currentUserID = parseInt(localStorage.getItem('userid'));
                const messageElement = document.createElement('div');
                if(messageObj.userid === currentUserID){
                    messageElement.className = "message user-message";
                    messageElement.innerHTML = `<p>${messageObj.message}</p>`;
                }else{              
                    messageElement.className = 'message other-message';
                    messageElement.innerHTML = `<img src="/Images/user-profile3.png" width="25" height="25" id="user-profile"><p><span>${messageObj.username}</span>  ${messageObj.message}</p>`;
                }
                chatMessages.appendChild(messageElement);
            });

            chatMessages.scrollTop = chatMessages.scrollHeight;
        })
        .catch((error) => {
            console.error('Error fetching messages:', error);
        });
    }

    function toggleEmojiPicker() {
        var emojiPicker = document.getElementById("emojiPicker");
        emojiPicker.style.display = (emojiPicker.style.display === "block") ? "none" : "block";
    }

    function insertEmoji(emoji) {
        var messageInput = document.getElementById("message-input");
        messageInput.value += emoji;
    }

    socket.on("connect", ()=>{
        console.log("connected");

        fetch(url, {
            method: "GET",
            headers: {
                "Authorization" : token
            }
        })
        .then((response)=>{
            return response.json();
        })
        .then((data) =>{
            
            if(data.code_number == 403){
                throw new Error("Forbidden");              
            }
        })
        .catch((err) =>{
            console.log(err);
        })
    });

    socket.on('chat', function (messageObj) {
    const chatMessages = document.getElementById('chat-messages');
    const currentUserID = localStorage.getItem('userid');

    if (messageObj.userid != currentUserID) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message other-message';
        messageElement.innerHTML = `<p><i class="fas fa-user-circle"></i> ${messageObj.username}: ${messageObj.message}</p>`;
        chatMessages.appendChild(messageElement);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    });

    function logout(){
        localStorage.clear();
    }
    fetchAndDisplayMessages();