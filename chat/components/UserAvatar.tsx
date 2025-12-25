import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface UserAvatarProps {
  username?: string;  // Optional yaptık
  isOnline?: boolean; // Optional yaptık
  size?: 'small' | 'medium' | 'large';
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  username = '',  
  isOnline = false, 
  size = 'medium'
}) => {

  const initial = username?.charAt(0)?.toUpperCase() || '?';
  

  const sizeStyles = {
    small: { width: 32, height: 32, fontSize: 14 },
    medium: { width: 40, height: 40, fontSize: 16 },
    large: { width: 48, height: 48, fontSize: 20 },
  };

  const selectedSize = sizeStyles[size];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.avatar,
          { width: selectedSize.width, height: selectedSize.height },
          { backgroundColor: username ? generateColor(username) : '#CCCCCC' }
        ]}
      >
        <Text
          style={[
            styles.initial,
            { fontSize: selectedSize.fontSize }
          ]}
        >
          {initial}
        </Text>
      </View>
      {isOnline && <View style={styles.onlineIndicator} />}
    </View>
  );
};

const generateColor = (username: string) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'
  ];
  
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatar: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initial: {
    color: 'white',
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
  },
});