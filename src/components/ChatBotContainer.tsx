import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatWindow } from './ChatWindow';
import { ChatBotProps } from '../types/chatbot';

export const ChatBotContainer: React.FC<ChatBotProps> = ({ loanData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] z-50 shadow-2xl rounded-lg overflow-hidden"
            style={{ maxHeight: 'calc(100vh - 120px)' }}
          >
            <ChatWindow loanData={loanData} onClose={toggleChat} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow z-50 flex items-center justify-center group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageCircle className="w-6 h-6" />
              {/* Notification pulse */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Tooltip */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-6 right-24 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg z-40 pointer-events-none"
        >
          Need help? Ask our AI assistant
          <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
        </motion.div>
      )}
    </>
  );
};
