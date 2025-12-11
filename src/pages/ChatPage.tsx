import {
  Clock,
  Code,
  Grid3x3,
  List,
  Loader,
  MessageSquare,
  Paperclip,
  Plus,
  Send,
  Settings,
  Users
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import '../assets/styles/ChatPage.css';
import optimizeCar from '../utils/apis/Car/optimizeCar';
import predictCar from '../utils/apis/Car/predictCar';
import type { CarInfo } from '../utils/nlp/parseCarInfo';
import { generateMissingQuestions, hasCompleteInfo, parseCarInfo } from '../utils/nlp/parseCarInfo';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isLoading?: boolean;
}

type DecisionTarget = 'unacc' | 'acc' | 'good' | 'vgood';

const VIETNAMESE_PROMPTS = [
  'Xe giá thấp, bảo trì thấp, 4 cửa, 4 người, khoang hành lý lớn, an toàn cao',
  'Tôi muốn đánh giá xe có giá cao, bảo trì trung bình, 5 cửa, nhiều người, khoang hành lý trung bình, an toàn cao',
  'Xe giá trung bình, bảo trì thấp, 2 cửa, 2 người, khoang hành lý nhỏ, an toàn trung bình',
  'Đánh giá xe: giá rất cao, bảo trì cao, 4 cửa, 4 người, khoang hành lý lớn, an toàn cao'
];

export default function ChatInterface() {
  const [message, setMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState('Sonnet 4.5');
  const [role, setRole] = useState<'buyer' | 'manufacturer'>('buyer');
  const [targetDecision, setTargetDecision] = useState<DecisionTarget>('vgood');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Xin chào! Tôi có thể giúp bạn đánh giá xe hơi. Hãy mô tả thông tin về chiếc xe bạn muốn đánh giá, ví dụ: "Xe giá thấp, bảo trì thấp, 4 cửa, 4 người, khoang hành lý lớn, an toàn cao"',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [carInfo, setCarInfo] = useState<CarInfo>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Delay scroll để đảm bảo DOM đã render
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  }, [messages]);

  const addMessage = (text: string, sender: 'user' | 'bot', isLoading = false) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      isLoading
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  };

  const buildManufacturerGuidance = (decision: string, input: CarInfo, target: 'unacc' | 'acc' | 'good' | 'vgood') => {
    const decisionLabel: Record<string, string> = {
      unacc: 'Không chấp nhận',
      acc: 'Chấp nhận',
      good: 'Tốt',
      vgood: 'Rất tốt'
    };
    const currentLabel = decisionLabel[decision] || decision;
    const targetLabel = decisionLabel[target] || target;

    // Mục tiêu tối ưu: vgood với các ràng buộc rõ ràng
    if (target === 'vgood') {
      const unmet: string[] = [];
      if (input.safety !== 'high') unmet.push('Safety lên mức high');
      if (input.persons !== 'more') unmet.push('Số chỗ (persons) lên mức more/5+');

      if (unmet.length === 0) {
        return 'Đã đạt mục tiêu vgood (Safety high, Persons 5+).';
      }
      return `Để đạt vgood, cần: ${unmet.join('; ')}.`;
    }

    // Với mục tiêu khác: cung cấp trạng thái hiện tại và mục tiêu
    return `Xe hiện ở mức ${currentLabel}. Mục tiêu: ${targetLabel}.`;
  };

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    
    try {
      // Thêm tin nhắn người dùng
      addMessage(userMessage, 'user');

      setIsLoading(true);
      
      // Parse thông tin từ tin nhắn
      const newInfo = parseCarInfo(userMessage);
      const updatedInfo = { ...carInfo, ...newInfo };
      setCarInfo(updatedInfo);

      // Kiểm tra xem có đủ thông tin không
      if (hasCompleteInfo(updatedInfo)) {
        // Gọi API để dự đoán
        try {
          const response = await predictCar({
            buying: updatedInfo.buying!,
            maint: updatedInfo.maint!,
            doors: updatedInfo.doors!,
            persons: updatedInfo.persons!,
            lug_boot: updatedInfo.lug_boot!,
            safety: updatedInfo.safety!
          });

          if (response.success) {
            const decisionLabel: Record<string, string> = {
              unacc: 'Không chấp nhận',
              acc: 'Chấp nhận',
              good: 'Tốt',
              vgood: 'Rất tốt'
            };

            const baseText = `Kết quả (${role === 'buyer' ? 'Người mua' : 'Nhà sản xuất'}):\n\n` +
              `📊 Mức độ chấp nhận: ${response.decision_vn}\n` +
              `🎯 Mục tiêu hiện tại: ${decisionLabel[targetDecision] || targetDecision}\n\n` +
              `Thông tin xe đã đánh giá:\n` +
              `• Giá mua: ${getVietnameseValue(response.input.buying, 'buying')}\n` +
              `• Chi phí bảo trì: ${getVietnameseValue(response.input.maint, 'maint')}\n` +
              `• Số cửa: ${response.input.doors}\n` +
              `• Số người: ${response.input.persons}\n` +
              `• Khoang hành lý: ${getVietnameseValue(response.input.lug_boot, 'lug_boot')}\n` +
              `• Mức độ an toàn: ${getVietnameseValue(response.input.safety, 'safety')}`;

            let guidance = '';
            if (role === 'manufacturer' && response.decision !== targetDecision) {
              guidance = `\n\n📐 Gợi ý thiết kế: ${buildManufacturerGuidance(response.decision, updatedInfo, targetDecision)}`;

              // Thử gọi tối ưu hóa để đưa gợi ý cụ thể
              try {
                const opt = await optimizeCar({
                  buying: updatedInfo.buying!,
                  maint: updatedInfo.maint!,
                  doors: updatedInfo.doors!,
                  persons: updatedInfo.persons!,
                  lug_boot: updatedInfo.lug_boot!,
                  safety: updatedInfo.safety!,
                  target: targetDecision
                });
                if (opt.success && opt.result?.changes?.length) {
                  const stepsText = opt.result.changes
                    .map((c, idx) => `${idx + 1}. Đổi ${c.feature} → ${c.value}`)
                    .join('\n');
                  guidance += `\n\n⚙️ Phương án tối ưu (ít bước nhất):\n${stepsText}\n→ Dự đoán mới: ${opt.result.decision_vn}`;
                }
              } catch (err) {
                console.warn('Optimize error', err);
              }
            }

            const resultText = baseText + guidance + `\n\nCảm ơn bạn đã sử dụng dịch vụ! Bạn muốn đánh giá chiếc xe khác không?`;
            
            addMessage(resultText, 'bot');
            setCarInfo({}); // Reset thông tin
          } else {
            addMessage('Xin lỗi, có lỗi xảy ra khi đánh giá xe. Vui lòng thử lại!', 'bot');
          }
        } catch (error: any) {
          console.error('Error calling API:', error);
          addMessage(`Xin lỗi, có lỗi xảy ra: ${error.message || 'Không thể kết nối đến server'}. Vui lòng thử lại sau!`, 'bot');
        }
      } else {
        // Thiếu thông tin, hỏi người dùng
        const missingQuestions = generateMissingQuestions(updatedInfo);
        let questionText: string;
        if (missingQuestions.length > 0) {
          const questionsList = missingQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n');
          questionText = `Tôi cần thêm một số thông tin:\n\n${questionsList}\n\nBạn có thể cung cấp thông tin này không?`;
        } else {
          questionText = 'Vui lòng cung cấp đầy đủ thông tin về xe để tôi có thể đánh giá.';
        }
        
        addMessage(questionText, 'bot');
      }
    } catch (error: any) {
      console.error('Error in handleSend:', error);
      addMessage('Xin lỗi, có lỗi xảy ra. Vui lòng thử lại!', 'bot');
    } finally {
      setIsLoading(false);
    }
  };

  const getVietnameseValue = (value: string, type: string): string => {
    const maps: { [key: string]: { [key: string]: string } } = {
      buying: { 'low': 'Thấp', 'med': 'Trung bình', 'high': 'Cao', 'vhigh': 'Rất cao' },
      maint: { 'low': 'Thấp', 'med': 'Trung bình', 'high': 'Cao', 'vhigh': 'Rất cao' },
      lug_boot: { 'small': 'Nhỏ', 'med': 'Trung bình', 'big': 'Lớn' },
      safety: { 'low': 'Thấp', 'med': 'Trung bình', 'high': 'Cao' }
    };
    
    return maps[type]?.[value] || value;
  };

  const handlePromptClick = (prompt: string) => {
    setMessage(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Chỉ ẩn prompts khi đã có ít nhất 2 tin nhắn (1 user + 1 bot)
  const hasMessages = messages.length >= 2;

  return (
    <div className="chat-interface">
      {/* Sidebar */}
      <div className="sidebar">
        <button className="sidebar-btn">
          <Grid3x3 size={18} />
        </button>
        
        <button 
          className="sidebar-btn new-chat"
          onClick={() => {
            setMessages([{
              id: '1',
              text: 'Xin chào! Tôi có thể giúp bạn đánh giá xe hơi. Hãy mô tả thông tin về chiếc xe bạn muốn đánh giá.',
              sender: 'bot',
              timestamp: new Date()
            }]);
            setCarInfo({});
          }}
        >
          <Plus size={18} />
        </button>

        <button className="sidebar-btn">
          <MessageSquare size={18} />
        </button>

        <button className="sidebar-btn">
          <Users size={18} />
        </button>

        <button className="sidebar-btn">
          <Settings size={18} />
        </button>

        <button className="sidebar-btn">
          <Code size={18} />
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header Badge */}
        <div className="header-badge">
          <span>Free plan</span>
          <span>·</span>
          <span>Upgrade</span>
        </div>

        {/* Chat Messages Area */}
        <div className="chat-messages-container" ref={chatContainerRef}>
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                <div className="message-content">
                  {msg.isLoading ? (
                    <div className="loading-indicator">
                      <Loader size={16} className="spinner" />
                      <span>Đang xử lý...</span>
                    </div>
                  ) : (
                    <div className="message-text">{msg.text}</div>
                  )}
                  <div className="message-time">
                    {msg.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot">
                <div className="message-content">
                  <div className="loading-indicator">
                    <Loader size={16} className="spinner" />
                    <span>Đang xử lý...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompts Section - chỉ hiển thị khi chưa có tin nhắn hoặc ít tin nhắn */}
          {!hasMessages && (
            <div className="prompts-section">
              <div className="prompts-title">Gợi ý câu hỏi:</div>
              <div className="prompts-grid">
                {VIETNAMESE_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    className="prompt-button"
                    onClick={() => handlePromptClick(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="chat-input-container">
          <textarea 
            className="chat-input" 
            placeholder="Mô tả thông tin về chiếc xe bạn muốn đánh giá..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isLoading}
          />

          <div className="input-controls">
            <div className="input-left">
              <button className="control-btn" title="Attach file">
                <Paperclip size={18} />
              </button>

              <button className="control-btn" title="Options">
                <List size={18} />
              </button>

              <button className="control-btn" title="Recent">
                <Clock size={18} />
              </button>
            </div>

            <div className="input-right">
              <select 
                className="model-selector"
                value={role}
                onChange={(e) => setRole(e.target.value as 'buyer' | 'manufacturer')}
              >
                <option value="buyer">Bạn là người mua</option>
                <option value="manufacturer">Bạn là nhà sản xuất</option>
              </select>

              <select 
                className="model-selector"
                value={targetDecision}
                onChange={(e) => setTargetDecision(e.target.value as 'unacc' | 'acc' | 'good' | 'vgood')}
              >
                <option value="vgood">Mục tiêu: vgood</option>
                <option value="good">Mục tiêu: good</option>
                <option value="acc">Mục tiêu: acc</option>
                <option value="unacc">Mục tiêu: unacc</option>
              </select>

              <select 
                className="model-selector"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                <option>Sonnet 4.5</option>
                <option>Opus 4</option>
                <option>Haiku 4</option>
              </select>

              <button 
                className="send-btn" 
                onClick={handleSend}
                disabled={!message.trim() || isLoading}
              >
                {isLoading ? <Loader size={18} className="spinner" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}