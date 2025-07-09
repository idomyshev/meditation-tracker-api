import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TypeOrmExceptionFilter } from './common/filters/typeorm-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply global exception filter for TypeORM errors
  app.useGlobalFilters(new TypeOrmExceptionFilter());

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

  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'defined' : 'undefined');

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
