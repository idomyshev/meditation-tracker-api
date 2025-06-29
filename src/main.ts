import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Meditation Tracker API')
    .setDescription('API for tracking meditation sessions and user progress')
    .setVersion('1.0')
    .addTag('users', 'User management endpoints')
    .addTag('meditations', 'Meditation session management endpoints')
    .addTag('records', 'Meditation records and progress tracking endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
