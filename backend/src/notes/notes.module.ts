import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { Note, NoteSchema } from './note.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
    forwardRef(() => AuthModule), // fix circular dependency
  ],
  providers: [NotesService],
  controllers: [NotesController],
  exports: [NotesService], // export if AuthService needs it
})
export class NotesModule {}
