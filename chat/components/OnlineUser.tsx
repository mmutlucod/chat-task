import React from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { UserAvatar } from './UserAvatar';

interface User {
  id: number;
  username: string;
  isOnline: boolean;
}

interface OnlineUsersProps {
  users?: User[];  
  onUserSelect?: (userId: number) => void;
}

export const OnlineUsers: React.FC<OnlineUsersProps> = ({
  users = [],  
  onUserSelect
}) => {
  if (!users || users.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Online Users</Text>
        <Text style={styles.emptyText}>No users online</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Online Users ({users.length})</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {users.map((user) => (
          <TouchableOpacity
            key={user.id}
            style={styles.userContainer}
            onPress={() => onUserSelect?.(user.id)}
          >
            <UserAvatar
              username={user.username}
              isOnline={user.isOnline}
              size="medium"
            />
            <Text style={styles.username} numberOfLines={1}>
              {user.username}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 15,
    marginBottom: 10,
    color: '#1c1c1e',
  },
  scrollContent: {
    paddingHorizontal: 15,
  },
  userContainer: {
    alignItems: 'center',
    marginRight: 20,
    width: 60,
  },
  username: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    padding: 10,
  },
});