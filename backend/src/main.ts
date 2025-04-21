import {NestFactory, Reflector} from '@nestjs/core';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import * as cookieParser from 'cookie-parser'

declare const module: any

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    credentials: true,
    origin: true
  });
  app.use(cookieParser())

  const config = new DocumentBuilder()
      .setTitle('ChatCom API 문서')
      .setDescription('API')
      .setVersion('1.0.0')
      .addTag('swagger')
      .build()

  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 8000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
