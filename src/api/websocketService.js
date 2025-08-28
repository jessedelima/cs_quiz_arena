/**
 * Serviço WebSocket para comunicação em tempo real na sala de espera
 * Implementa uma conexão WebSocket real com o servidor para troca de mensagens
 * e eventos em tempo real entre os jogadores em uma sala.
 */

// Classe para gerenciar eventos WebSocket
class WebSocketService {
  constructor() {
    // Configuração do WebSocket
    this.serverUrl = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8080';
    this.socket = null;
    
    // Estado da conexão
    this.listeners = {};
    this.connected = false;
    this.roomId = null;
    this.userId = null;
    this.pingInterval = null;
    this.reconnectTimeout = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  /**
   * Conecta ao servidor WebSocket
   * @param {string} [roomId] - ID da sala (opcional)
   * @param {string} [userId] - ID do usuário (opcional)
   * @returns {Promise<boolean>} - Sucesso da conexão
   */
  connect(roomId, userId) {
    return new Promise((resolve, reject) => {
      if (this.socket && this.connected) {
        this.disconnect();
      }
      
      // Armazena os IDs se fornecidos
      if (roomId) this.roomId = roomId;
      if (userId) this.userId = userId;
      
      console.log(`Conectando ao WebSocket${this.roomId ? ` para sala ${this.roomId}` : ''}${this.userId ? ` como usuário ${this.userId}` : ''}...`);
      
      try {
        // Conecta ao servidor WebSocket com parâmetros opcionais
        let url = this.serverUrl;
        const params = [];
        
        if (this.roomId) params.push(`roomId=${this.roomId}`);
        if (this.userId) params.push(`userId=${this.userId}`);
        
        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }
        
        this.socket = new WebSocket(url);
        
        // Configura os eventos do WebSocket
        this.socket.onopen = () => {
          this.connected = true;
          
          // Inicia o ping para manter a conexão ativa
          this.startPing();
          
          // Emite evento de conexão bem-sucedida
          this.emitEvent('connected', { 
            roomId: this.roomId, 
            userId: this.userId 
          });
          
          console.log(`Conectado ao WebSocket${this.roomId ? ` para sala ${this.roomId}` : ''}`);
          resolve(true);
        };
        
        this.socket.onclose = (event) => {
          console.log(`Conexão WebSocket fechada: ${event.code} - ${event.reason}`);
          this.connected = false;
          
          // Tenta reconectar se não foi um fechamento limpo
          if (event.code !== 1000) {
            this.reconnect();
          }
          
          this.emitEvent('disconnected', { code: event.code, reason: event.reason });
        };
        
        this.socket.onerror = (error) => {
          console.error('Erro na conexão WebSocket:', error);
          this.emitEvent('error', { message: 'Erro na conexão WebSocket' });
          reject(error);
        };
        
        this.socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            const { type, payload } = data;
            
            console.log(`Mensagem recebida: ${type}`, payload);
            
            // Emite o evento para os listeners
            this.emitEvent(type, payload);
          } catch (error) {
            console.error('Erro ao processar mensagem:', error);
          }
        };
      } catch (error) {
        console.error('Erro ao conectar ao WebSocket:', error);
        this.emitEvent('error', { message: 'Erro ao conectar ao WebSocket' });
        reject(error);
      }
    });
  }

  /**
   * Desconecta do servidor WebSocket
   */
  disconnect() {
    if (!this.connected || !this.socket) return;
    
    console.log(`Desconectando do WebSocket para sala ${this.roomId}...`);
    
    // Limpa os intervalos
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    try {
      // Fecha a conexão WebSocket
      this.socket.close(1000, 'Desconexão solicitada pelo cliente');
    } catch (error) {
      console.error('Erro ao fechar conexão WebSocket:', error);
    }
    
    // Reseta o estado
    this.socket = null;
    this.connected = false;
    this.roomId = null;
    this.userId = null;
    this.reconnectAttempts = 0;
    
    // Emite evento de desconexão
    this.emitEvent('disconnected', { reason: 'user_disconnect' });
    
    console.log('Desconectado do WebSocket');
  }

  /**
   * Inicia o ping para manter a conexão ativa
   */
  startPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
    
    this.pingInterval = setInterval(() => {
      if (this.connected && this.socket && this.socket.readyState === WebSocket.OPEN) {
        // Envia um ping para o servidor
        try {
          this.send('ping', { timestamp: Date.now() });
          console.log('Ping enviado');
        } catch (error) {
          console.error('Erro ao enviar ping:', error);
          this.reconnect();
        }
      } else if (this.connected) {
        // Se está marcado como conectado mas o socket não está aberto
        console.warn('Socket não está aberto, tentando reconectar...');
        this.reconnect();
      }
    }, 30000); // 30 segundos
  }

  /**
   * Tenta reconectar ao servidor WebSocket
   */
  reconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error(`Número máximo de tentativas de reconexão (${this.maxReconnectAttempts}) atingido`);
      this.emitEvent('reconnect_failed', { attempts: this.reconnectAttempts });
      return;
    }
    
    const delay = Math.min(30000, (1000 * Math.pow(2, this.reconnectAttempts)));
    this.reconnectAttempts++;
    
    console.log(`Tentando reconectar em ${delay}ms (tentativa ${this.reconnectAttempts} de ${this.maxReconnectAttempts})`);
    
    this.reconnectTimeout = setTimeout(() => {
      if (!this.connected && this.roomId && this.userId) {
        console.log(`Tentando reconectar para sala ${this.roomId}...`);
        
        // Tenta reconectar usando o método connect
        this.connect(this.roomId, this.userId)
          .then(() => {
            console.log(`Reconectado ao WebSocket para sala ${this.roomId}`);
            this.emitEvent('reconnected', { roomId: this.roomId, userId: this.userId });
            this.reconnectAttempts = 0; // Reseta o contador de tentativas após sucesso
          })
          .catch((error) => {
            console.error('Falha ao reconectar:', error);
            // Tenta novamente
            this.reconnect();
          });
      }
    }, delay);
  }

  /**
   * Registra um listener para um evento
   * @param {string} event - Nome do evento
   * @param {function} callback - Função de callback
   * @returns {function} - Função para remover o listener
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    
    this.listeners[event].push(callback);
    
    // Retorna uma função para facilitar a remoção do listener
    return () => this.off(event, callback);
  }

  /**
   * Remove um listener de um evento
   * @param {string} event - Nome do evento
   * @param {function} callback - Função de callback
   * @returns {boolean} - Indica se o listener foi removido
   */
  off(event, callback) {
    if (!this.listeners[event]) return false;
    
    const initialLength = this.listeners[event].length;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    
    return initialLength !== this.listeners[event].length;
  }

  /**
   * Emite um evento para todos os listeners registrados
   * @param {string} event - Nome do evento
   * @param {object} data - Dados do evento
   * @returns {number} - Número de listeners notificados
   */
  emitEvent(event, data) {
    if (!this.listeners[event] || !this.listeners[event].length) {
      return 0;
    }
    
    let notifiedCount = 0;
    
    this.listeners[event].forEach(callback => {
      try {
        callback(data);
        notifiedCount++;
      } catch (error) {
        console.error(`Erro ao executar callback para evento ${event}:`, error);
      }
    });
    
    return notifiedCount;
  }

  /**
   * Envia uma mensagem para o servidor
   * @param {string|object} typeOrMessage - Tipo da mensagem ou objeto completo da mensagem
   * @param {object} [payload] - Dados da mensagem (opcional se typeOrMessage for um objeto)
   * @returns {boolean} - Sucesso do envio
   */
  send(typeOrMessage, payload) {
    if (!this.connected || !this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('Tentativa de enviar mensagem sem conexão WebSocket ativa');
      return false;
    }
    
    try {
      let message;
      
      // Verifica se o primeiro parâmetro é um objeto completo ou apenas o tipo
      if (typeof typeOrMessage === 'object') {
        message = {
          ...typeOrMessage,
          roomId: typeOrMessage.roomId || this.roomId,
          userId: typeOrMessage.userId || this.userId,
          timestamp: typeOrMessage.timestamp || Date.now()
        };
        console.log(`Enviando mensagem: ${message.type}`, message.payload);
      } else {
        message = { 
          type: typeOrMessage, 
          payload: payload || {}, 
          roomId: this.roomId, 
          userId: this.userId,
          timestamp: Date.now()
        };
        console.log(`Enviando mensagem: ${typeOrMessage}`, payload);
      }
      
      this.socket.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      return false;
    }
  }

  // O método processServerEvent foi removido pois agora estamos usando um WebSocket real
  // que processa os eventos do servidor diretamente no manipulador onmessage

  /**
   * Verifica se o WebSocket está conectado
   * @returns {boolean} - Estado da conexão
   */
  isConnected() {
    return this.connected && this.socket && this.socket.readyState === WebSocket.OPEN;
  }
}

// Exporta uma instância única do serviço
const websocketService = new WebSocketService();
export default websocketService;