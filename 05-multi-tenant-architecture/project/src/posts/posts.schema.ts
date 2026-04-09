import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../users/users.schema';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
    @Prop({ required: true })
    title!: string;

    @Prop({ required: true })
    content!: string;

    @Prop({ required: true, index: true })
    tenantId!: string;

    @Prop({ type: Types.ObjectId, ref: User.name })
    authorId?: Types.ObjectId;
}

export const PostSchema = SchemaFactory.createForClass(Post);
