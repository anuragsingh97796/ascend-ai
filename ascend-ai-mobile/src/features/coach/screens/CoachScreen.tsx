import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { getCoachHistory, sendCoachMessage, saveCoachHistory } from '../api/coachService';
import { CoachChat } from '../domain/coach.types';

export const CoachScreen = () => {
  const [messages, setMessages] = useState<CoachChat[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const history = await getCoachHistory();
      setMessages(history);
    } catch {
      setError('Failed to load chat history');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const text = input.trim();
    setInput('');
    setError(null);

    const tempUserMsg: CoachChat = {
      id: 'temp_' + Date.now(),
      userId: 'temp',
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => {
      const next = [...prev, tempUserMsg];
      saveCoachHistory(next);
      return next;
    });
    setLoading(true);

    try {
      const aiResponse = await sendCoachMessage(text);
      setMessages((prev) => {
        const next = [...prev, aiResponse];
        saveCoachHistory(next);
        return next;
      });
    } catch {
      setError('Failed to send message');
      setMessages((prev) => {
        const next = prev.filter(m => m.id !== tempUserMsg.id);
        saveCoachHistory(next);
        return next;
      });
      setInput(text);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.title}>AI Coach</Text>
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length === 0 ? (
          <Text style={styles.emptyText}>Start a conversation with your AI Coach!</Text>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <View 
                key={msg.id} 
                style={[
                  styles.messageBubble, 
                  isUser ? styles.userBubble : styles.aiBubble,
                  { alignSelf: isUser ? 'flex-end' : 'flex-start' }
                ]}
              >
                <Text style={[styles.messageText, isUser ? styles.userText : styles.aiText]}>
                  {msg.content}
                </Text>
              </View>
            );
          })
        )}
        {loading && (
          <View style={[styles.messageBubble, styles.aiBubble, { alignSelf: 'flex-start' }]}>
            <ActivityIndicator size="small" color="#fff" />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about goals, habits..."
          placeholderTextColor="#9CA3AF"
          editable={!loading}
        />
        <TouchableOpacity 
          style={[styles.sendButton, (!input.trim() || loading) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!input.trim() || loading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#1e293b', borderBottomWidth: 1, borderBottomColor: '#334155' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  errorContainer: { backgroundColor: '#ef4444', padding: 10 },
  errorText: { color: '#fff', textAlign: 'center' },
  chatArea: { flex: 1 },
  chatContent: { padding: 16, gap: 12 },
  emptyText: { color: '#9CA3AF', textAlign: 'center', marginTop: 40 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 16 },
  userBubble: { backgroundColor: '#2563EB', borderBottomRightRadius: 4 },
  aiBubble: { backgroundColor: '#1e293b', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#334155' },
  messageText: { fontSize: 16, lineHeight: 24 },
  userText: { color: '#ffffff' },
  aiText: { color: '#e2e8f0' },
  inputContainer: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: '#334155', backgroundColor: '#1e293b', gap: 12 },
  input: { flex: 1, backgroundColor: '#0f172a', borderRadius: 8, paddingHorizontal: 16, color: '#fff', fontSize: 16, height: 48 },
  sendButton: { backgroundColor: '#2563EB', paddingHorizontal: 20, justifyContent: 'center', borderRadius: 8, height: 48 },
  sendButtonDisabled: { backgroundColor: '#334155' },
  sendButtonText: { color: '#fff', fontWeight: 'bold' }
});



