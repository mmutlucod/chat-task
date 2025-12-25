export const formatMessageTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    
    const isToday = date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();
  
    if (isToday) {
      return date.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };