// assets/js/chatbot.js
const botResponses = {
    vi: {
        welcome: "Chào bạn! Tôi là trợ lý ảo Kumpoo 🏸. Tôi có thể giúp gì cho bạn hôm nay? (Ví dụ: 'chọn vợt', 'K520', 'căng cước', 'bảo hành')",
        default: "Xin lỗi, tôi chưa hiểu rõ ý bạn. Bạn có thể nói rõ hơn không, hoặc để lại số điện thoại nhân viên sẽ gọi lại tư vấn nhé! 😊",
        keywords: [
            {
                keys: ["vợt", "racket", "chọn", "tư vấn"],
                response: "Bạn đang tìm kiếm vợt cho người mới chơi hay chuyên nghiệp? <br><br>💡 Gợi ý: Nếu bạn mới chơi, dòng <b>K520 Pro</b> rất dễ thuần, trợ lực tốt. Nếu muốn tấn công mạnh mẽ, hãy tham khảo dòng <b>Power Control R89</b> nhé!"
            },
            {
                keys: ["k520"],
                response: "Vợt cầu lông <b>Kumpoo K520 Pro</b> là dòng \"quốc dân\" dành cho người mới chơi, giá chỉ 429k. <br><br>🏸 Trọng lượng: 4U<br>🏸 Điểm cân bằng: 290mm<br>🏸 Độ cứng: Trung bình.<br>Bạn có muốn mua ngay không?"
            },
            {
                keys: ["giày", "shoes", "giay"],
                response: "Giày cầu lông Kumpoo có công nghệ giảm chấn KH Series siêu êm ái. Rất nhiều khách hàng ưa chuộng mẫu <b>KH-E55</b> và <b>KH-G826S</b>. Bạn định tìm size bao nhiêu?"
            },
            {
                keys: ["bảo hành", "bảo hành", "bao hanh", "hỏng"],
                response: "Chính sách bảo hành của Kumpoo Shop:<br>- Đổi mới 1-1 trong 7 ngày nếu lỗi nhà sản xuất.<br>- Bảo hành chính hãng 90 ngày cho vợt và giày.<br>Bạn có thể chat thêm trên Fanpage nhé!"
            },
            {
                keys: ["cước", "căng", "kg", "lbs"],
                response: "Sức căng cước (Tension) phổ biến cho người chơi phong trào là từ 10.5kg đến 11.5kg (23-25 lbs). Vợt Kumpoo thường chịu lực căng tối đa lên đến 28-30 lbs tuỳ mẫu. Bạn quen căng mấy kg?"
            },
            {
                keys: ["giá", "bao nhiêu", "tiền"],
                response: "Giá của các sản phẩm Kumpoo đang cực kỳ ưu đãi tại Shop. Vợt dao động từ 429k đến 850k. Giày từ 850k đến 1Tr2. Quần áo và phụ kiện rất đa dạng, bạn có thể bấm vào phần <b>Sản Phẩm</b> ở trên để xem đầy đủ mẫu nhé!"
            },
             {
                keys: ["hello", "chào", "hi", "alo"],
                response: "Chào bạn. Chúc bạn một ngày tốt lành! Bạn cần tìm kiếm gì tại Kumpoo Shop ạ?"
            }
        ]
    },
    en: {
        welcome: "Hello! I am your Kumpoo virtual assistant 🏸. How can I help you today? (e.g., 'racket', 'K520', 'string', 'warranty')",
        default: "Sorry, I didn't quite catch that. Could you please clarify, or leave your phone number for our staff to contact you? 😊",
        keywords: [
            {
                keys: ["racket", "recommend", "choose", "buy"],
                response: "Are you looking for a beginner or professional racket? <br><br>💡 Tip: For beginners, the <b>K520 Pro</b> is very easy to handle. If you prefer a powerful attack, check out the <b>Power Control R89</b>!"
            },
            {
                keys: ["k520"],
                response: "The <b>Kumpoo K520 Pro</b> is our most popular racket for beginners, priced at only 429k VND. <br><br>🏸 Weight: 4U<br>🏸 Balance point: 290mm<br>🏸 Flex: Medium.<br>Would you like to purchase it?"
            },
            {
                keys: ["shoes", "shoe"],
                response: "Kumpoo badminton shoes feature our super comfortable KH Series shock absorption technology. Popular models include <b>KH-E55</b> and <b>KH-G826S</b>. What size are you looking for?"
            },
            {
                keys: ["warranty", "guarantee"],
                response: "Kumpoo Shop's Warranty Policy:<br>- 1-to-1 exchange within 7 days for manufacturing defects.<br>- 90 days official warranty for rackets and shoes.<br>Feel free to contact our Fanpage for more info!"
            },
            {
                keys: ["string", "tension", "kg", "lbs"],
                response: "Standard string tension for recreational players is 10.5kg to 11.5kg (23-25 lbs). Kumpoo rackets can handle max tension up to 28-30 lbs depending on the model. What tension do you normally use?"
            },
            {
                keys: ["price", "cost", "how much"],
                response: "Our Kumpoo products are priced very competitively. Rackets range from 429k to 850k VND. Shoes range from 850k to 1.2M VND. You can click on the <b>Products</b> menu to see the full collection!"
            },
            {
                keys: ["hello", "hi", "hey"],
                response: "Hello there! Have a great day. What are you looking for at Kumpoo Shop today?"
            }
        ]
    }
};

let isChatOpen = false;
let hasOpenedBefore = false;

function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    const badge = document.getElementById('chatBadge');
    
    isChatOpen = !isChatOpen;
    
    if (isChatOpen) {
        chatWindow.classList.add('open');
        badge.style.display = 'none'; // hide badge
        
        // Greet on first open
        if (!hasOpenedBefore) {
            hasOpenedBefore = true;
            setTimeout(() => {
                const lang = document.documentElement.lang === 'en' ? 'en' : 'vi'; // default mapped via language system
                // Usually current_language is stored globally, we check localStorage or window
                const currentLang = localStorage.getItem('kumpooLang') || 'vi';
                appendMessage(botResponses[currentLang].welcome, 'bot');
            }, 500);
        }
        
        document.getElementById('chatInput').focus();
    } else {
        chatWindow.classList.remove('open');
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    
    if (!text) return;
    
    // 1. Add user message
    appendMessage(text, 'user');
    input.value = '';
    
    // 2. Show typing indicator
    showTypingIndicator();
    
    // 3. Process response after delay
    setTimeout(() => {
        hideTypingIndicator();
        const response = getBotResponse(text);
        appendMessage(response, 'bot');
    }, 1000 + Math.random() * 500); // 1-1.5s delay
}

function getBotResponse(text) {
    const currentLang = localStorage.getItem('kumpooLang') || 'vi';
    const lowerText = text.toLowerCase();
    const kpData = botResponses[currentLang];
    
    for (let item of kpData.keywords) {
        for (let key of item.keys) {
            if (lowerText.includes(key)) {
                return item.response;
            }
        }
    }
    
    return kpData.default;
}

function appendMessage(text, sender) {
    const msgsContainer = document.getElementById('chatMessages');
    const typingIndicator = document.getElementById('typingIndicator');
    
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    msgDiv.innerHTML = `<p>${text}</p><span class="time">${time}</span>`;
    
    if (typingIndicator) {
        // Insert before typing indicator if it exists
        msgsContainer.insertBefore(msgDiv, typingIndicator);
    } else {
        msgsContainer.appendChild(msgDiv);
    }
    
    msgsContainer.scrollTop = msgsContainer.scrollHeight;
}

function showTypingIndicator() {
    const msgsContainer = document.getElementById('chatMessages');
    let typingInd = document.getElementById('typingIndicator');
    
    if (!typingInd) {
        typingInd = document.createElement('div');
        typingInd.id = 'typingIndicator';
        typingInd.className = 'typing-indicator';
        typingInd.innerHTML = '<span></span><span></span><span></span>';
        msgsContainer.appendChild(typingInd);
    }
    
    typingInd.style.display = 'flex';
    msgsContainer.scrollTop = msgsContainer.scrollHeight;
}

function hideTypingIndicator() {
    const typingInd = document.getElementById('typingIndicator');
    if (typingInd) {
        typingInd.style.display = 'none';
    }
}

// Add event listener for Enter key
document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
    
    // Handle language switch auto-update greeting if open
    const langToggleBtn = document.getElementById('langToggleBtn');
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
             // We can optionally clear chat or dynamically switch if needed, but not strictly required.
        });
    }
});
