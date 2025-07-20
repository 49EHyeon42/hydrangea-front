// TODO: sender -> user
export interface SendMessageResponse {
  messageId: string;
  senderId: number;
  senderNickname: string;
  content: string;
}
