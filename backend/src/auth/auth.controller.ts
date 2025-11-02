import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiTags, ApiBody, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth') // "Auth" section in Swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // REGISTER
  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    schema: {
      example: {
        email: 'test@example.com',
        password: 'password123',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      example: {
        message: 'User created successfully',
        user: {
          _id: '6744b6c8b7f9f16c4b6a1e23',
          email: 'test@example.com',
        },
      },
    },
  })
  async signup(@Body() body: { email: string; password: string }) {
    return this.authService.register(body.email, body.password);
  }

  // LOGIN
  @Post('login')
  @ApiOperation({ summary: 'Login user and return JWT token' })
  @ApiBody({
    schema: {
      example: {
        email: 'test@example.com',
        password: 'password123',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  // TEST TOKEN
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get user profile (requires JWT)' })
  @ApiBearerAuth() // for "Authorize" button sa Swagger
  @ApiResponse({
    status: 200,
    description: 'Returns the authenticated user',
    schema: {
      example: {
        _id: '6744b6c8b7f9f16c4b6a1e23',
        email: 'test@example.com',
      },
    },
  })
  getMe(@Req() req) {
    return req.user;
  }
}
