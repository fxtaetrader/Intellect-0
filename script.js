// ==================== STATE MANAGEMENT ====================
let currentUser = null;
let activeChat = null;
let chats = [];
let messages = {};
let typingTimeout = null;
let isPremium = false;
let pinnedMessages = {};
let scheduledMessages = {};
let currentFilter = 'all';

// Load data from localStorage
function loadData() {
    const savedUser = localStorage.getItem('intellect_user');
    const savedChats = localStorage.getItem('intellect_chats');
    const savedMessages = localStorage.getItem('intellect_messages');
    const savedPremium = localStorage.getItem('intellect_premium');
    
    if (savedUser) currentUser = JSON.parse(savedUser);
    if (savedChats) chats = JSON.parse(savedChats);
    if (savedMessages) messages = JSON.parse(savedMessages);
    if (savedPremium) isPremium = JSON.parse(savedPremium);
    
    if (currentUser) {
        document.getElementById('loginScreen').classList.remove('active');
        document.getElementById('mainScreen').classList.add('active');
        document.getElementById('currentUsername').textContent = currentUser.username;
        initializeTelegramChats();
        renderChats();
    }
}

// Save data to localStorage
function saveData() {
    if (currentUser) localStorage.setItem('intellect_user', JSON.stringify(currentUser));
    localStorage.setItem('intellect_chats', JSON.stringify(chats));
    localStorage.setItem('intellect_messages', JSON.stringify(messages));
    localStorage.setItem('intellect_premium', JSON.stringify(isPremium));
}

// ==================== AUTHENTICATION ====================
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    if (tab === 'login') {
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
        document.getElementById('loginForm').classList.add('active');
    } else {
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
        document.getElementById('registerForm').classList.add('active');
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const users = JSON.parse(localStorage.getItem('intellect_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        saveData();
        
        document.getElementById('loginScreen').classList.remove('active');
        document.getElementById('mainScreen').classList.add('active');
        document.getElementById('currentUsername').textContent = user.username;
        
        initializeTelegramChats();
        renderChats();
        
        showNotification('Welcome back, ' + user.username + '!', 'success');
    } else {
        showNotification('Invalid email or password', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const phone = document.getElementById('regPhone').value;
    
    const users = JSON.parse(localStorage.getItem('intellect_users') || '[]');
    if (users.find(u => u.email === email)) {
        showNotification('Email already registered', 'error');
        return;
    }
    
    const newUser = {
        id: 'user_' + Date.now(),
        username,
        email,
        password,
        phone,
        avatar: null,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('intellect_users', JSON.stringify(users));
    
    currentUser = newUser;
    saveData();
    
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('mainScreen').classList.add('active');
    document.getElementById('currentUsername').textContent = username;
    
    initializeTelegramChats();
    renderChats();
    
    showNotification('Account created successfully!', 'success');
}

// ==================== TELEGRAM STYLE CHATS ====================
function initializeTelegramChats() {
    if (chats.length === 0) {
        chats = [
            {
                id: 'chat_1',
                name: 'MOBILE FOREX - Free Forex SIGNALS & Strategies',
                type: 'channel',
                subscribers: '18.5K',
                lastMessage: 'Exness is my Favorite Forex Broker of Choice right now with leverage option 1:2000 I can maximize profits for me and my s...',
                lastMessageTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
                unread: 2,
                avatar: null,
                pinned: true,
                category: 'finance',
                hasStory: false
            },
            {
                id: 'chat_2',
                name: 'MOBILE FOREX - Free Forex SIGNALS & Strate...',
                type: 'channel',
                subscribers: '15.2K',
                lastMessage: 'https://youtu.be/QGQp-IhKTes',
                lastMessageTime: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
                unread: 0,
                avatar: null,
                pinned: false,
                category: 'finance',
                media: {
                    type: 'youtube',
                    title: 'Scaling a $15 Forex Account Using Horizontal Lines Only on BTCUSD (Bitcoin) Ahmed Xm',
                    url: 'https://youtu.be/QGQp-IhKTes'
                }
            },
            {
                id: 'chat_3',
                name: 'FundedNext Official Channel',
                type: 'channel',
                subscribers: '34K',
                lastMessage: 'SNAP a BOLT Discount — March 4th–6th...',
                lastMessageTime: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
                unread: 34,
                avatar: null,
                pinned: false,
                category: 'finance'
            },
            {
                id: 'chat_4',
                name: 'Hamster Kombat',
                type: 'channel',
                subscribers: '89K',
                lastMessage: 'How to play Hamster Kombat Full...',
                lastMessageTime: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
                unread: 0,
                avatar: null,
                pinned: false,
                category: 'games',
                action: 'Open'
            },
            {
                id: 'chat_5',
                name: 'APEX TRADERS CIRCLE chat',
                type: 'group',
                members: '2.4K',
                lastMessage: 'FX TAE TRADING CIRCLE: https://one.exnessu...',
                lastMessageTime: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
                unread: 8,
                avatar: null,
                pinned: false,
                category: 'fx-tae'
            },
            {
                id: 'chat_6',
                name: 'FX TAE TRADING CIRCLE',
                type: 'channel',
                subscribers: '2.3K',
                lastMessage: 'Password: shhafx',
                lastMessageTime: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
                unread: 1,
                avatar: null,
                pinned: false,
                category: 'fx-tae',
                password: 'shhafx'
            }
        ];
        
        messages = {
            'chat_1': [
                {
                    id: 'msg_1',
                    sender: 'MOBILE FOREX',
                    content: 'Exness is my Favorite Forex Broker of Choice right now with leverage option 1:2000 I can maximize profits for me and my subscribers. Get started with the best conditions!',
                    time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
                    pinned: true
                }
            ],
            'chat_2': [
                {
                    id: 'msg_2',
                    sender: 'MOBILE FOREX',
                    content: 'https://youtu.be/QGQp-IhKTes',
                    time: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
                    media: {
                        type: 'youtube',
                        title: 'Scaling a $15 Forex Account Using Horizontal Lines Only on BTCUSD (Bitcoin) Ahmed Xm',
                        description: '📹 Recommended Forex Broker - https://one.exnesstrack.org/a/jj5orl7w72\n\nGet The Pip Rocket Scalper Here:\nhttps://superfastrobot.bigcartel.com/'
                    }
                }
            ],
            'chat_6': [
                {
                    id: 'msg_6',
                    sender: 'FX TAE TRADING CIRCLE',
                    content: 'FX TAE TRADING CIRCLE: https://one.exnessu...',
                    time: new Date(Date.now() - 1000 * 60 * 300).toISOString()
                },
                {
                    id: 'msg_7',
                    sender: 'FX TAE TRADING CIRCLE',
                    content: 'Password: shhafx',
                    time: new Date(Date.now() - 1000 * 60 * 295).toISOString()
                }
            ]
        };
        
        saveData();
    }
}

function renderChats() {
    const chatsList = document.getElementById('chatsList');
    chatsList.innerHTML = '';
    
    let filteredChats = chats;
    if (currentFilter !== 'all') {
        if (currentFilter === 'unread') {
            filteredChats = chats.filter(chat => chat.unread > 0);
        } else if (currentFilter === 'fx-tae') {
            filteredChats = chats.filter(chat => chat.category === 'fx-tae');
        } else if (currentFilter === 'finance') {
            filteredChats = chats.filter(chat => chat.category === 'finance');
        } else if (currentFilter === 'personal') {
            filteredChats = chats.filter(chat => chat.category === 'personal');
        }
    }
    
    filteredChats.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
    
    filteredChats.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.className = `chat-item ${activeChat === chat.id ? 'active' : ''}`;
        chatItem.onclick = () => openChat(chat.id);
        
        const time = new Date(chat.lastMessageTime);
        const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        let chatIcon = 'fa-users';
        if (chat.type === 'channel') chatIcon = 'fa-broadcast-tower';
        if (chat.type === 'group') chatIcon = 'fa-users';
        
        let lastMessageDisplay = chat.lastMessage;
        if (chat.media?.type === 'youtube') {
            lastMessageDisplay = '📹 YouTube video';
        }
        
        chatItem.innerHTML = `
            <div class="chat-avatar" style="background: linear-gradient(135deg, #2F5BFF, #6A5CFF);">
                <i class="fas ${chatIcon}"></i>
                ${chat.hasStory ? '<span class="story-indicator"></span>' : ''}
            </div>
            <div class="chat-info">
                <div class="chat-name-row">
                    <span class="chat-name">${chat.name}</span>
                    <span class="chat-time">${timeStr}</span>
                </div>
                <div class="chat-last-message">
                    ${chat.pinned ? '<i class="fas fa-thumbtack pinned-indicator"></i>' : ''}
                    ${lastMessageDisplay}
                    ${chat.subscribers ? `<span class="subscriber-badge">${chat.subscribers}</span>` : ''}
                    ${chat.members ? `<span class="subscriber-badge">${chat.members}</span>` : ''}
                </div>
            </div>
            ${chat.unread ? `<div class="chat-badge">${chat.unread}</div>` : ''}
            ${chat.action ? `<div class="chat-badge" style="background: #2F5BFF;">${chat.action}</div>` : ''}
        `;
        
        chatsList.appendChild(chatItem);
    });
}

function filterChats(filter) {
    currentFilter = filter;
    
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    renderChats();
}

function openChat(chatId) {
    activeChat = chatId;
    const chat = chats.find(c => c.id === chatId);
    
    document.getElementById('currentChatName').textContent = chat.name;
    document.getElementById('subscriberCount').textContent = 
        chat.subscribers ? `${chat.subscribers} subscribers` : 
        chat.members ? `${chat.members} members` : '';
    
    renderMessages();
    renderChats();
    
    chat.unread = 0;
    saveData();
    
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('active');
    }
}

function renderMessages() {
    const container = document.getElementById('messagesContainer');
    if (!activeChat || !messages[activeChat]) {
        container.innerHTML = '<div class="no-messages">Select a chat to start messaging</div>';
        return;
    }
    
    let html = '';
    
    const activeChatData = chats.find(c => c.id === activeChat);
    if (activeChatData?.pinned) {
        html += `
            <div class="pinned-message-container">
                <div class="pinned-message" style="background: #F5F2FF; border-left: 3px solid #2F5BFF;">
                    <div class="pinned-header">
                        <i class="fas fa-thumbtack" style="color: #2F5BFF;"></i>
                        <span style="color: #2F5BFF;">Pinned Message</span>
                    </div>
                    <div class="pinned-content" style="color: #6A5CFF;">
                        Exness is my Favorite Forex Broker of Choice right now with leverage option 1:2000 I can maximize profits for me and my s...
                    </div>
                </div>
            </div>
        `;
    }
    
    messages[activeChat].forEach(msg => {
        const messageClass = `message ${msg.sender === 'me' ? 'sent' : 'received'}`;
        const time = new Date(msg.time);
        const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        if (msg.media?.type === 'youtube') {
            html += `
                <div class="${messageClass}">
                    <div class="message-content">
                        ${msg.content}
                        <div class="youtube-link">
                            <div class="youtube-thumbnail">
                                <i class="fab fa-youtube"></i>
                                <div class="youtube-info">
                                    <div class="youtube-title">${msg.media.title}</div>
                                    <div class="youtube-channel">Ahmed Xm</div>
                                </div>
                            </div>
                            <div style="font-size: 12px; margin-top: 8px; color: #6A5CFF;">${msg.media.description || ''}</div>
                        </div>
                    </div>
                    <div class="message-time">
                        ${timeStr}
                        ${msg.sender === 'me' ? '<span class="message-status"><i class="fas fa-check-double"></i></span>' : ''}
                    </div>
                </div>
            `;
        } else {
            html += `
                <div class="${messageClass}">
                    <div class="message-content">
                        ${msg.sender !== 'me' ? `<strong>${msg.sender}:</strong> ` : ''}
                        ${msg.content.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color: #2F5BFF;">$1</a>')}
                        ${msg.pinned ? '<i class="fas fa-thumbtack" style="margin-left: 5px; font-size: 10px;"></i>' : ''}
                    </div>
                    <div class="message-time">
                        ${timeStr}
                        ${msg.sender === 'me' ? '<span class="message-status"><i class="fas fa-check-double" style="color: #2F5BFF;"></i></span>' : ''}
                    </div>
                </div>
            `;
        }
    });
    
    container.innerHTML = html;
    container.scrollTop = container.scrollHeight;
}

// ==================== BOTTOM NAVIGATION ====================
function switchTab(tab) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    event.target.closest('.nav-item').classList.add('active');
    
    switch(tab) {
        case 'chats':
            document.getElementById('sidebar').classList.remove('hidden');
            break;
        case 'contacts':
            showNotification('Contacts section coming soon!', 'info');
            break;
        case 'settings':
            showNotification('Settings section coming soon!', 'info');
            break;
        case 'profile':
            showNotification('Profile section coming soon!', 'info');
            break;
    }
}

// ==================== TELEGRAM FEATURES ====================
function openArchived() {
    showNotification('Archived chats - Feature coming soon!', 'info');
}

function showBirthday() {
    showNotification('Add your birthday to let contacts know when you\'re celebrating!', 'info');
}

function toggleProfileMenu() {
    showNotification('Profile menu - Feature coming soon!', 'info');
}

function searchChat() {
    showNotification('Search in chat - Feature coming soon!', 'info');
}

function showMenu() {
    showNotification('Chat menu - Feature coming soon!', 'info');
}

function attachPoll() {
    showNotification('Poll creation - Feature coming soon!', 'info');
}

// ==================== PREMIUM FEATURES ====================
function togglePremiumFeatures() {
    if (!isPremium) {
        togglePremiumModal();
        return;
    }
    document.getElementById('premiumPanel').classList.toggle('hidden');
}

function showPinnedMessages() {
    if (!isPremium) {
        togglePremiumModal();
        return;
    }
    showNotification('Pinned messages - Premium feature activated!', 'success');
}

function scheduleMessage() {
    if (!isPremium) {
        togglePremiumModal();
        return;
    }
    showNotification('Schedule message - Premium feature activated!', 'success');
}

function incognitoMode() {
    if (!isPremium) {
        togglePremiumModal();
        return;
    }
    showNotification('Incognito mode - Premium feature activated!', 'success');
}

function customThemes() {
    if (!isPremium) {
        togglePremiumModal();
        return;
    }
    showNotification('Custom themes - Premium feature activated!', 'success');
}

function voiceTranscription() {
    if (!isPremium) {
        togglePremiumModal();
        return;
    }
    showNotification('Voice transcription - Premium feature activated!', 'success');
}

// ==================== MESSAGE FUNCTIONS ====================
function sendMessage() {
    const input = document.getElementById('messageInput');
    const content = input.value.trim();
    
    if (!content || !activeChat) return;
    
    const newMessage = {
        id: 'msg_' + Date.now(),
        sender: 'me',
        content: content,
        time: new Date().toISOString(),
        status: 'sent'
    };
    
    if (!messages[activeChat]) messages[activeChat] = [];
    messages[activeChat].push(newMessage);
    
    const chat = chats.find(c => c.id === activeChat);
    if (chat) {
        chat.lastMessage = content;
        chat.lastMessageTime = new Date().toISOString();
    }
    
    input.value = '';
    
    renderMessages();
    renderChats();
    saveData();
    
    setTimeout(simulateReply, 2000);
}

function simulateReply() {
    if (!activeChat) return;
    
    const replies = [
        "That's interesting!",
        "Thanks for sharing!",
        "Great point!",
        "I'll check that out",
        "Awesome!"
    ];
    
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    const chat = chats.find(c => c.id === activeChat);
    
    const replyMessage = {
        id: 'msg_' + Date.now(),
        sender: chat?.name || 'Other',
        content: randomReply,
        time: new Date().toISOString()
    };
    
    messages[activeChat].push(replyMessage);
    
    if (chat) {
        chat.lastMessage = randomReply;
        chat.lastMessageTime = new Date().toISOString();
        chat.unread = (chat.unread || 0) + 1;
    }
    
    renderMessages();
    renderChats();
    saveData();
    
    showNotification(`New message from ${chat?.name}`, 'info');
}

function handleMessageKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

function checkTyping() {
    const input = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendButton');
    const micBtn = document.getElementById('micButton');
    
    if (input.value.trim()) {
        sendBtn.classList.remove('hidden');
        micBtn.classList.add('hidden');
        
        document.getElementById('typingStatus').textContent = 'typing...';
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            document.getElementById('typingStatus').textContent = '';
        }, 1000);
    } else {
        sendBtn.classList.add('hidden');
        micBtn.classList.remove('hidden');
    }
}

// ==================== UI FUNCTIONS ====================
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

function togglePremiumModal() {
    document.getElementById('premiumModal').classList.toggle('active');
}

function showAttachmentMenu() {
    document.getElementById('attachmentMenu').classList.toggle('hidden');
}

function showEmojiPicker() {
    const emojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '✨', '⭐', '💯', '👋'];
    const input = document.getElementById('messageInput');
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    input.value += randomEmoji;
    checkTyping();
}

function attachImage() {
    showNotification('Image attachment coming soon!', 'info');
    document.getElementById('attachmentMenu').classList.add('hidden');
}

function attachFile() {
    showNotification('File attachment coming soon!', 'info');
    document.getElementById('attachmentMenu').classList.add('hidden');
}

function attachLocation() {
    showNotification('Location sharing coming soon!', 'info');
    document.getElementById('attachmentMenu').classList.add('hidden');
}

function attachContact() {
    showNotification('Contact sharing coming soon!', 'info');
    document.getElementById('attachmentMenu').classList.add('hidden');
}

function searchChats(query) {
    const chatItems = document.querySelectorAll('.chat-item');
    chatItems.forEach(item => {
        const name = item.querySelector('.chat-name')?.textContent.toLowerCase() || '';
        item.style.display = name.includes(query.toLowerCase()) ? 'flex' : 'none';
    });
}

function subscribe(plan) {
    isPremium = true;
    saveData();
    togglePremiumModal();
    showNotification(`✨ Subscribed to ${plan} plan! Thank you for going premium!`, 'success');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}" style="color: white;"></i>
        <span style="color: white;">${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #2F5BFF, #6A5CFF)' : type === 'error' ? '#ff6b6b' : '#2F5BFF'};
        border-radius: 8px;
        box-shadow: 0 3px 10px rgba(47, 91, 255, 0.3);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    
    document.addEventListener('click', (e) => {
        const premiumPanel = document.getElementById('premiumPanel');
        const premiumBtn = document.querySelector('.fa-star')?.parentElement;
        const attachmentMenu = document.getElementById('attachmentMenu');
        const attachBtn = document.querySelector('.attach-btn');
        
        if (premiumPanel && !premiumPanel.contains(e.target) && !premiumBtn?.contains(e.target)) {
            premiumPanel.classList.add('hidden');
        }
        
        if (attachmentMenu && !attachmentMenu.contains(e.target) && !attachBtn?.contains(e.target)) {
            attachmentMenu.classList.add('hidden');
        }
    });
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            document.getElementById('sidebar').classList.remove('active');
        }
    });
});

console.log('Intellect Messenger is ready with your custom colors! 🚀');
