import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class OrdersGateway {
  
  @WebSocketServer()
  server: Server;

  notifyNewOrder(order: any) {
    this.server.emit('new-order', order);
  }

  notifyOrderUpdated(order: any) {
    this.server.emit('order-updated', order);
  }
}
