import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { MessageItem } from '../components/MessageItem';
import { MessageInput } from '../components/MessageInput';
import { storage } from '../utils/storage';
import { connectSocket, disconnectSocket, getSocket } from '../services/socket';
import { Message, User } from '../types';
import { Socket } from 'socket.io-client';
import { useRouter } from 'expo-router';

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const listRef = useRef<FlashList<Message>>(null);
  const router = useRouter();

  const scrollToEnd = () => {
    if (listRef.current && messages.length > 0) {
      listRef.current.scrollToIndex({
        index: messages.length - 1,
        animated: true
      });
    }
  };

  const updateUserStatus = useCallback((userId: number, isOnline: boolean) => {
    setMessages(prev => prev.map(message => {
      if (message.sender.id === userId) {
        return {
          ...message,
          sender: {
            ...message.sender,
            isOnline
          }
        };
      }
      return message;
    }));
  }, []);

  useEffect(() => {
    let socket: Socket;

    const initializeSocket = async () => {
      try {
        const token = await storage.getToken();
        if (!token) {
          Alert.alert('Error', 'Authentication token not found');
          return;
        }

        socket = connectSocket(token);

        socket.on('connect', () => {
          console.log('Connected to chat server');
        });

        socket.on('connect_error', (error) => {
          console.error('Connection error:', error);
          Alert.alert('Connection Error', 'Failed to connect to chat server');
        });

        socket.on('previous_messages', (previousMessages: Message[]) => {
          console.log('Previous messages received:', previousMessages);
          setMessages(previousMessages);
          setTimeout(scrollToEnd, 100);
        });

        socket.on('new_message', (message: Message) => {
          console.log('New message received:', message);
          setMessages(prev => [...prev, message]);
          setTimeout(scrollToEnd, 100);
        });

        socket.on('user_status_change', ({ userId, isOnline }) => {
          console.log('User status change:', { userId, isOnline });
          updateUserStatus(userId, isOnline);
        });

        socket.on('auth_status', ({ user }) => {
          console.log('Auth status received:', user);
          setCurrentUser(user);
        });

        socket.emit('check_auth');

      } catch (error) {
        console.error('Socket initialization error:', error);
        Alert.alert('Error', 'Failed to initialize chat');
      }
    };

    initializeSocket();

    return () => {
      disconnectSocket();
    };
  }, [updateUserStatus]);

  const handleSend = useCallback((content: string) => {
    try {
      const socket = getSocket();
      socket.emit('send_message', { content });
    } catch (error) {
      console.error('Send message error:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  }, []);

  const renderMessage = useCallback(({ item }: { item: Message }) => (
    <MessageItem
      message={item}
      isOwnMessage={currentUser ? item.sender.id === currentUser.id : false}
    />
  ), [currentUser]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>General Chat</Text>
        <View style={styles.headerRight} />
      </View>

      <FlashList
        ref={listRef}
        data={messages}
        renderItem={renderMessage}
        estimatedItemSize={50}
        keyExtractor={(item) => item.id.toString()}
        inverted={false}
        onContentSizeChange={scrollToEnd}
        onLayout={scrollToEnd}
      />
      <MessageInput onSend={handleSend} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#007AFF',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginRight: 40, // backButton width ile aynı
  },
  headerRight: {
    width: 40, // Başlığı ortalamak için sağda boş alan
  },
});

