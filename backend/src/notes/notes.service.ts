import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note } from './note.schema';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<Note>) {}

  async createNote(userId: string, title: string, content: string) {
    const note = new this.noteModel({ userId, title, content });
    return note.save();
  }

  async findAll(userId: string) {
    return this.noteModel.find({ userId }).sort({ createdAt: -1 });
  }

  async editNote(userId: string, noteId: string, title: string, content: string) {
    return this.noteModel.findOneAndUpdate(
      { _id: noteId, userId },
      { title, content },
      { new: true }
    );
  }

  async archiveNote(userId: string, noteId: string) {
    return this.noteModel.findOneAndUpdate(
      { _id: noteId, userId },
      { archived: true },
      { new: true }
    );
  }
}
