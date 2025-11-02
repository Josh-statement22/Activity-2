import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // allow origin
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('Notes API')
    .setDescription('API for personal notes with user authentication.')
    .setVersion('1.0')
    .addBearerAuth() 
    .addTag('Auth')
    .addTag('Notes')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, 
    },
    customSiteTitle: 'Notes API Docs 📝',
  });

  const port = process.env.PORT ?? 5000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📘 Swagger Docs at http://localhost:${port}/api-docs`);
}

bootstrap();
