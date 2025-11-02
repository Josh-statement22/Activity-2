import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotesService } from './notes.service';

interface NoteBody {
  title?: string;
  content?: string;
  archived?: boolean;
}

@ApiTags('Notes')  
@ApiBearerAuth()  
@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  // CREATE NOTE
  @Post()
  @ApiOperation({ summary: 'Create a new note (requires JWT)' })
  @ApiBody({
    schema: {
      example: {
        title: 'Meeting Notes',
        content: 'Discuss project updates and next steps.',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Note created successfully',
    schema: {
      example: {
        _id: '6744d2101c4b5a0b5b3b9e33',
        title: 'Meeting Notes',
        content: 'Discuss project updates and next steps.',
        userId: '6744cfad1c4b5a0b5b3b9e11',
        createdAt: '2025-10-25T12:45:00.000Z',
      },
    },
  })
  async create(@Body() body: { title: string; content: string }, @Req() req) {
    const userId = req.user?.id;
    if (!userId) throw new Error('Unauthorized');
    return this.notesService.createNote(userId, body.title, body.content);
  }

  // GET ALL NOTES
  @Get()
  @ApiOperation({ summary: 'Get all notes for the logged-in user' })
  @ApiResponse({
    status: 200,
    description: 'Returns all notes belonging to the authenticated user',
    schema: {
      example: [
        {
          _id: '6744d2101c4b5a0b5b3b9e33',
          title: 'Meeting Notes',
          content: 'Discuss project updates and next steps.',
          archived: false,
          createdAt: '2025-10-25T12:45:00.000Z',
        },
        {
          _id: '6744d3221c4b5a0b5b3b9e44',
          title: 'Shopping List',
          content: 'Eggs, milk, bread, coffee',
          archived: true,
          createdAt: '2025-10-25T13:00:00.000Z',
        },
      ],
    },
  })
  async findAll(@Req() req) {
    const userId = req.user?.id;
    if (!userId) throw new Error('Unauthorized');
    return this.notesService.findAll(userId);
  }

  // UPDATE OR ARCHIVE NOTE
  @Patch(':id')
  @ApiOperation({ summary: 'Update or archive a note (requires JWT)' })
  @ApiParam({ name: 'id', description: 'The ID of the note' })
  @ApiBody({
    schema: {
      example: {
        title: 'Updated Meeting Notes',
        content: 'Added discussion about new deadlines.',
        archived: false,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Note updated or archived successfully',
    schema: {
      example: {
        message: 'Note updated successfully',
        updatedNote: {
          _id: '6744d2101c4b5a0b5b3b9e33',
          title: 'Updated Meeting Notes',
          content: 'Added discussion about new deadlines.',
          archived: false,
          updatedAt: '2025-10-25T13:15:00.000Z',
        },
      },
    },
  })
  async update(@Param('id') id: string, @Body() body: NoteBody, @Req() req) {
    const userId = req.user?.id;
    if (!userId) throw new Error('Unauthorized');

    if (body.archived) {
      return this.notesService.archiveNote(userId, id);
    }
    if (body.title && body.content) {
      return this.notesService.editNote(userId, id, body.title, body.content);
    }

    throw new Error('No fields to update');
  }
}
