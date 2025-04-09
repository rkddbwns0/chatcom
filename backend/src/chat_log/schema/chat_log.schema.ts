import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

export type ChatLogDocument = ChatLog & Document;

@Schema({ collection: 'chat_log' })
export class ChatLog {
    @Prop()
    room_id: number;

    @Prop()
    user_id: number;

    @Prop()
    nickname: string;

    @Prop()
    message: string;

    @Prop({default: Date.now()})
    timestamp: Date;
}

export const ChatLogSchema = SchemaFactory.createForClass(ChatLog);