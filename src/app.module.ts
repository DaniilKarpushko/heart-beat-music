import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AlbumModule } from './album/album.module';
import { PrismaModule } from './prisma/prisma.module';
import { CommentModule } from './comment/comment.module';
import { ArtistModule } from './singer/artist.module';
import { SongModule } from './song/song.module';
import { UserModule } from './user/user.module';
import { NewsModule } from './news/news.module';
import { CollectionModule } from './collections/collection.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { ConfigModule } from '@nestjs/config';
import { TimeInterceptor } from './common/interceptors/time.interceptor';
import { FilesModule } from './file/files.module';
import { APP_GUARD } from '@nestjs/core';
import { SuperTokensAuthGuard } from 'supertokens-nestjs';
import { AuthModule } from './authentication/auth.module';
import { LimiterModule } from './limiter/limiter.module';

@Module({
  imports: [
    AuthModule.register(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: true,
      introspection: true,
      debug: process.env.NODE_ENV !== 'production',
      includeStacktraceInErrorResponses: process.env.NODE_ENV !== 'production',
      context: ({ req, res }) => ({ req, res }),
      formatError: (error) => {
        const originalError = error.extensions?.originalError as
          | Record<string, any>
          | undefined;

        if (process.env.NODE_ENV !== 'production') {
          console.error('GraphQL Error:', error);
          if (originalError) {
            console.error('Original Error:', originalError);
          }
        }

        return {
          message: error.message,
          locations: error.locations,
          path: error.path,
          extensions: {
            code:
              originalError?.code ||
              error.extensions?.code ||
              'INTERNAL_SERVER_ERROR',
            stacktrace:
              process.env.NODE_ENV !== 'production'
                ? error.extensions?.stacktrace
                : undefined,
            validationErrors:
              originalError?.validationErrors ||
              error.extensions?.validationErrors,
          },
        };
      },
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
    }),
    FilesModule,
    AlbumModule,
    PrismaModule,
    CommentModule,
    ArtistModule,
    SongModule,
    UserModule,
    NewsModule,
    CollectionModule,
    LimiterModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TimeInterceptor,
    {
      provide: APP_GUARD,
      useClass: SuperTokensAuthGuard,
    },
  ],
})
export class AppModule {}
