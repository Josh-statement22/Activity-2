import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  // REGISTER
  async register(email: string, password: string) {
    try {
      // Check if email already exists
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = await this.userModel.create({
        email,
        password: hashedPassword,
      });

      return {
        message: 'User registered successfully',
        user: {
          id: newUser._id,
          email: newUser.email,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // LOGIN
  async login(email: string, password: string) {
    try {
      // Find user
      const user = await this.userModel.findOne({ email });
      if (!user) throw new UnauthorizedException('Invalid email or password');

      // Compare password
      const isPasswordMatched = await bcrypt.compare(password, user.password);
      if (!isPasswordMatched) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Generate JWT token
      const payload = { id: user._id, email: user.email };
      const accessToken = await this.jwtService.signAsync(payload);

      return {
        message: 'Login successful',
        token: accessToken,
        user: {
          id: user._id,
          email: user.email,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // VERIFY TOKEN (optional)
  async verifyToken(token: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      return decoded;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
