import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RoutingEnum } from '../routes/routing';

export function swaggerSetup(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Incubator-apprenticeship')
    .setDescription('OpenAPI documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'accessToken',
        description: 'JWT access token',
      },
      'accessToken',
    )
    .addCookieAuth('refreshToken', {
      type: 'apiKey',
      name: 'refreshToken',
      in: 'cookie',
      description:
        'JWT refreshToken inside cookie. Must be correct, and must not be expired',
    })
    // .addTag('hummingbird')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const pathsToRemove = [RoutingEnum.security, RoutingEnum.admins];

  const pathsToDelete = Object.keys(document.paths).filter((path) =>
    pathsToRemove.some((pathToRemove) => path.startsWith(pathToRemove)),
  );

  pathsToDelete.forEach((path) => delete document.paths[path]);

  SwaggerModule.setup('api/v1', app, document);
}
