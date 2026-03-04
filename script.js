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
let incognitoMode = false;
let notificationPermission = false;

// Load data from localStorage
function loadData() {
    try {
        const savedUser = localStorage.getItem('intellect_user');
        const savedChats = localStorage.getItem('intellect_chats');
        const savedMessages = localStorage.getItem('intellect_messages');
        const savedPremium = localStorage.getItem('intellect_premium');
        const savedPinned = localStorage.getItem('intellect_pinned');
        
        if (savedUser) currentUser = JSON.parse(savedUser);
        if (savedChats) chats = JSON.parse(savedChats);
        if (savedMessages) messages = JSON.parse(savedMessages);
        if (savedPremium) isPremium = JSON.parse(savedPremium);
        if (savedPinned) pinnedMessages = JSON.parse(savedPinned);
        
        if (currentUser) {
            document.getElementById('loginScreen').classList.remove('active');
            document.getElementById('mainScreen').classList.add('active');
            document.getElementById('currentUsername').textContent = currentUser.username || 'User';
            initializeTelegramChats();
            renderChats();
            updatePremiumUI();
            requestNotificationPermission();
        }
    } catch (error) {
        console.error('Error loading data:', error);
        initializeDefaultData();
    }
}

// Save data to localStorage
function saveData() {
    try {
        if (currentUser) localStorage.setItem('intellect_user', JSON.stringify(currentUser));
        localStorage.setItem('intellect_chats', JSON.stringify(chats));
        localStorage.setItem('intellect_messages', JSON.stringify(messages));
        localStorage.setItem('intellect_premium', JSON.stringify(isPremium));
        localStorage.setItem('intellect_pinned', JSON.stringify(pinnedMessages));
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// Initialize default data
function initializeDefaultData() {
    currentUser = {
        id: 'user_1',
        username: 'Demo User',
        email: 'demo@intellect.com'
    };
    initializeTelegramChats();
    saveData();
}

// Request notification permission
function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(perm => {
            notificationPermission = perm === 'granted';
        });
    }
}

// ==================== TELEGRAM STYLE CHATS ====================
function initializeTelegramChats() {
    if (!chats || chats.length === 0) {
        chats = [
            {
                id: 'chat_1',
                name: 'MOBILE FOREX - Free Forex SIGNALS & Strategies',
                type: 'channel',
                subscribers: '18.5K',
                lastMessage: 'Exness is my Favorite Forex Broker of Choice right now with leverage option 1:2000 I can maximize profits for me and my subscribers...',
                lastMessageTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
                unread: 2,
                avatar: null,
                pinned: true,
                category: 'finance',
                hasStory: true
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
    }
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

function demoLogin() {
    currentUser = {
        id: 'demo_user',
        username: 'Demo User',
        email: 'demo@intellect.com'
    };
    
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('mainScreen').classList.add('active');
    document.getElementById('currentUsername').textContent = 'Demo User';
    
    initializeTelegramChats();
    renderChats();
    
    showNotification('Welcome to Intellect Demo!', 'success');
}

// ==================== CHAT FUNCTIONS ====================
function renderChats() {
    const chatsList = document.getElementById('chatsList');
    if (!chatsList) return;
    
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
        
        const subscriberInfo = chat.subscribers ? chat.subscribers : (chat.members ? chat.members : '');
        
        chatItem.innerHTML = `
            <div class="chat-avatar">
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
                    ${subscriberInfo ? `<span class="subscriber-badge">${subscriberInfo}</span>` : ''}
                </div>
            </div>
            ${chat.unread ? `<div class="chat-badge">${chat.unread}</div>` : ''}
            ${chat.action ? `<div class="chat-badge" style="background: #ffd700; color: #000;">${chat.action}</div>` : ''}
        `;
        
        chatsList.appendChild(chatItem);
    });
}

function filterChats(filter, element) {
    currentFilter = filter;
    
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    
    renderChats();
}

function openChat(chatId) {
    activeChat = chatId;
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;
    
    document.getElementById('currentChatName').textContent = chat.name;
    
    const subscriberCount = document.getElementById('subscriberCount');
    if (subscriberCount) {
        subscriberCount.textContent = chat.subscribers ? `${chat.subscribers} subscribers` : 
                                      chat.members ? `${chat.members} members` : '';
    }
    
    // Set appropriate icon
    const chatAvatar = document.getElementById('chatAvatar');
    if (chatAvatar) {
        if (chat.type === 'channel') {
            chatAvatar.innerHTML = '<i class="fas fa-broadcast-tower"></i>';
        } else if (chat.type === 'group') {
            chatAvatar.innerHTML = '<i class="fas fa-users"></i>';
        } else {
            chatAvatar.innerHTML = '<i class="fas fa-user"></i>';
        }
    }
    
    renderMessages();
    renderChats();
    
    // Mark as read
    chat.unread = 0;
    saveData();
    
    // On mobile, hide sidebar
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('active');
    }
    
    // Update pinned count
    updatePinnedCount();
}

function renderMessages() {
    const container = document.getElementById('messagesContainer');
    if (!container) return;
    
    if (!activeChat || !messages[activeChat] || messages[activeChat].length === 0) {
        container.innerHTML = '<div class="no-messages">No messages yet. Start the conversation!</div>';
        return;
    }
    
    let html = '';
    
    // Add pinned message at top if exists and chat has pinned message
    const activeChatData = chats.find(c => c.id === activeChat);
    if (activeChatData?.pinned) {
        html += `
            <div class="pinned-message-container">
                <div class="pinned-message">
                    <div class="pinned-header">
                        <i class="fas fa-thumbtack"></i>
                        <span>Pinned Message</span>
                    </div>
                    <div class="pinned-content">
                        Exness is my Favorite Forex Broker of Choice right now with leverage option 1:2000 I can maximize profits for me and my subscribers...
                    </div>
                </div>
            </div>
        `;
    }
    
    messages[activeChat].forEach(msg => {
        const time = new Date(msg.time);
        const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const isSent = msg.sender === 'me' || msg.sender === currentUser?.username;
        const messageClass = isSent ? 'sent' : 'received';
        
        let contentHtml = '';
        
        if (msg.media?.type === 'youtube') {
            contentHtml = `
                <div class="message-content">
                    ${msg.sender !== 'me' ? `<strong>${msg.sender}:</strong> ` : ''}
                    ${msg.content}
                    <div class="youtube-link" onclick="window.open('${msg.media.url}', '_blank')">
                        <div class="youtube-thumbnail">
                            <i class="fab fa-youtube"></i>
                            <div class="youtube-info">
                                <div class="youtube-title">${msg.media.title || 'YouTube Video'}</div>
                                <div class="youtube-channel">Click to watch</div>
                            </div>
                        </div>
                        ${msg.media.description ? `<div style="font-size: 12px; margin-top: 8px; color: #8e8e8e;">${msg.media.description.substring(0, 100)}...</div>` : ''}
                    </div>
                </div>
            `;
        } else {
            // Convert URLs to links
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const linkedContent = msg.content.replace(urlRegex, '<a href="$1" target="_blank" style="color: #ffd700;">$1</a>');
            
            contentHtml = `
                <div class="message-content">
                    ${msg.sender !== 'me' && msg.sender !== currentUser?.username ? `<strong>${msg.sender}:</strong> ` : ''}
                    ${linkedContent}
                    ${msg.pinned ? '<i class="fas fa-thumbtack" style="margin-left: 5px; font-size: 10px;"></i>' : ''}
                </div>
            `;
        }
        
        html += `
            <div class="message ${messageClass}">
                ${contentHtml}
                <div class="message-time">
                    ${timeStr}
                    ${isSent ? '<span class="message-status"><i class="fas fa-check-double"></i></span>' : ''}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    container.scrollTop = container.scrollHeight;
}

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
    
    // Simulate reply after random time
    if (Math.random() > 0.5) {
        setTimeout(simulateReply, 2000 + Math.random() * 3000);
    }
}

function simulateReply() {
    if (!activeChat) return;
    
    const chat = chats.find(c => c.id === activeChat);
    if (!chat) return;
    
    const replies = [
        "That's interesting!",
        "Thanks for sharing",
        "Great point!",
        "I'll check that out",
        "👍",
        "Thanks for the update",
        "Password: shhafx",
        "Check this out: https://example.com"
    ];
    
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    
    const replyMessage = {
        id: 'msg_' + Date.now(),
        sender: chat.name || 'User',
        content: randomReply,
        time: new Date().toISOString()
    };
    
    if (!messages[activeChat]) messages[activeChat] = [];
    messages[activeChat].push(replyMessage);
    
    chat.lastMessage = randomReply;
    chat.lastMessageTime = new Date().toISOString();
    chat.unread = (chat.unread || 0) + 1;
    
    renderMessages();
    renderChats();
    saveData();
    
    // Show notification
    showNotification(`New message from ${chat.name}`, 'info');
    
    // Browser notification if permitted
    if (notificationPermission && document.hidden) {
        new Notification('Intellect Messenger', {
            body: `${chat.name}: ${randomReply}`,
            icon: '/favicon.ico'
        });
    }
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
        
        // Show typing indicator
        const typingStatus = document.getElementById('typingStatus');
        typingStatus.textContent = 'typing...';
        typingStatus.classList.add('show');
        
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            typingStatus.textContent = '';
            typingStatus.classList.remove('show');
        }, 1000);
    } else {
        sendBtn.classList.add('hidden');
        micBtn.classList.remove('hidden');
    }
}

// ==================== TELEGRAM FEATURES ====================
function openArchived() {
    showNotification('Archived chats - Feature coming soon!', 'info');
}

function showBirthday() {
    showNotification('Add your birthday to let contacts know when you\'re celebrating! 🎂', 'info');
}

function toggleProfileMenu() {
    showNotification('Profile settings coming soon!', 'info');
}

function searchInChat() {
    if (!activeChat) {
        showNotification('Select a chat first', 'error');
        return;
    }
    showNotification('Search in chat - Coming soon!', 'info');
}

function showChatMenu() {
    if (!activeChat) {
        showNotification('Select a chat first', 'error');
        return;
    }
    showNotification('Chat options coming soon!', 'info');
}

function attachPoll() {
    showNotification('Poll creation - Coming soon!', 'info');
    document.getElementById('attachmentMenu').classList.add('hidden');
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
    
    if (!activeChat || !pinnedMessages[activeChat] || pinnedMessages[activeChat].length === 0) {
        showNotification('No pinned messages in this chat', 'info');
        return;
    }
    
    const pinnedList = pinnedMessages[activeChat]
        .map(msgId => {
            const msg = messages[activeChat]?.find(m => m.id === msgId);
            return msg ? `• ${msg.content.substring(0, 50)}...` : null;
        })
        .filter(m => m)
        .join('\n');
    
    showNotification(`Pinned Messages (${pinnedMessages[activeChat].length}/20):\n${pinnedList}`, 'info');
}

function scheduleMessage() {
    if (!isPremium) {
        togglePremiumModal();
        return;
    }
    
    const input = document.getElementById('messageInput');
    const content = input.value.trim();
    
    if (!content) {
        showNotification('Type a message to schedule', 'error');
        return;
    }
    
    showNotification('Message scheduled for later!', 'success');
    input.value = '';
}

function incognitoMode() {
    if (!isPremium) {
        togglePremiumModal();
        return;
    }
    
    incognitoMode = !incognitoMode;
    const toggle = document.getElementById('incognitoToggle');
    if (toggle) {
        toggle.className = incognitoMode ? 'fas fa-toggle-on' : 'fas fa-toggle-off';
    }
    showNotification(`Incognito mode ${incognitoMode ? 'enabled' : 'disabled'}`, 'success');
}

function customThemes() {
    if (!isPremium) {
        togglePremiumModal();
        return;
    }
    showNotification('Custom themes coming soon!', 'info');
}

function voiceTranscription() {
    if (!isPremium) {
        togglePremiumModal();
        return;
    }
    showNotification('Voice transcription coming soon!', 'info');
}

function exclusiveStickers() {
    if (!isPremium) {
        togglePremiumModal();
        return;
    }
    showNotification('Exclusive stickers coming soon!', 'info');
}

function updatePinnedCount() {
    const countElement = document.getElementById('pinnedCount');
    if (countElement && activeChat && pinnedMessages[activeChat]) {
        countElement.textContent = `${pinnedMessages[activeChat].length}/20`;
    }
}

function updatePremiumUI() {
    if (isPremium) {
        document.querySelectorAll('.premium-feature-item').forEach(item => {
            item.style.opacity = '1';
        });
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
    const emojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '✨', '⭐', '💯', '👋', '🙏', '🤔', '😎', '🥳', '💪'];
    const input = document.getElementById('messageInput');
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    input.value += randomEmoji;
    checkTyping();
    document.getElementById('attachmentMenu').classList.add('hidden');
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
    
    updatePremiumUI();
    showNotification('All premium features are now unlocked!', 'success');
}

function switchTab(tab, element) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
    
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

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
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
    
    // Add click outside listener for panels
    document.addEventListener('click', (e) => {
        const premiumPanel = document.getElementById('premiumPanel');
        const premiumBtn = document.querySelector('.premium-star')?.parentElement;
        const attachmentMenu = document.getElementById('attachmentMenu');
        const attachBtn = document.querySelector('.attach-btn');
        
        if (premiumPanel && !premiumPanel.contains(e.target) && !premiumBtn?.contains(e.target)) {
            premiumPanel.classList.add('hidden');
        }
        
        if (attachmentMenu && !attachmentMenu.contains(e.target) && !attachBtn?.contains(e.target)) {
            attachmentMenu.classList.add('hidden');
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            document.getElementById('sidebar').classList.remove('active');
        }
    });
    
    // Handle visibility change for notifications
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && activeChat) {
            const chat = chats.find(c => c.id === activeChat);
            if (chat) {
                chat.unread = 0;
                renderChats();
            }
        }
    });
});

console.log('Intellect Messenger - Fully Loaded and Ready! 🚀');
