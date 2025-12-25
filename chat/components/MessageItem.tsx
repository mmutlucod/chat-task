import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserAvatar } from './UserAvatar';
import { formatMessageTime } from '../utils/date-formatter';

interface MessageItemProps {
  message: {
    id: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    senderId: number;
    receiverId: number | null;
    sender: {
      id: number;
      username: string;
      isOnline: boolean;
    };
  };
  isOwnMessage: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isOwnMessage
}) => {
  return (
    <View style={[
      styles.container,
      isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer
    ]}>
      {!isOwnMessage && (
        <View style={styles.avatarContainer}>
          <UserAvatar
            username={message.sender.username}
            isOnline={message.sender.isOnline}
            size="small"
          />
        </View>
      )}
      <View style={[
        styles.messageContent,
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      ]}>
        {!isOwnMessage && (
          <View style={styles.senderInfo}>
            <Text style={styles.username}>{message.sender.username}</Text>
            {message.sender.isOnline && <View style={styles.onlineIndicator} />}
          </View>
        )}
        <Text style={[
          styles.content,
          isOwnMessage ? styles.ownMessageText : styles.otherMessageText
        ]}>
          {message.content}
        </Text>
        <View style={styles.bottomContainer}>
          <Text style={[
            styles.time,
            isOwnMessage ? styles.ownTimeText : styles.otherTimeText
          ]}>
            {formatMessageTime(message.createdAt)}
          </Text>
          {isOwnMessage && message.sender.isOnline && (
            <View style={styles.onlineIndicator} />
          )}
        </View>
      </View>
      {isOwnMessage && (
        <View style={styles.avatarContainer}>
          <UserAvatar
            username={message.sender.username}
            isOnline={message.sender.isOnline}
            size="small"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 5,
    marginHorizontal: 10,
    alignItems: 'flex-end',
  },
  ownMessageContainer: {
    flexDirection: 'row-reverse', // Kendi mesajını sağa yaslama
    justifyContent: 'flex-start', // İçeriği sağa hizala
  },
  otherMessageContainer: {
    flexDirection: 'row', // Diğer mesajları sola yaslama
    justifyContent: 'flex-start', // İçeriği sola hizala
  },
  avatarContainer: {
    marginHorizontal: 8,
  },
  messageContent: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 18,
  },
  ownMessage: {
    backgroundColor: '#007AFF',
    borderTopRightRadius: 4,
  },
  otherMessage: {
    backgroundColor: '#E8E8E8',
    borderTopLeftRadius: 4,
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
    marginRight: 4,
  },
  content: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#000000',
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  time: {
    fontSize: 11,
    marginRight: 4,
  },
  ownTimeText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherTimeText: {
    color: '#999',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginLeft: 4,
  },
});