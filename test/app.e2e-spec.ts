import { Test } from "@nestjs/testing"
import { AppModule } from "../src/app.module"
import { INestApplication, ValidationPipe } from "@nestjs/common"
import { PrismaService } from "../src/prisma/prisma.service";
import * as pactum from 'pactum'
import { AuthDto } from "src/auth/dto";

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async() => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
  
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      })
    )
    await app.init()
    await app.listen(3333)

    prisma = app.get(PrismaService)
    await prisma.cleanDb()
    pactum.request.setBaseUrl('http://localhost:3333')

  });

  afterAll(() => {
      app.close()
  })

  describe('Auth', () => {
    const dto: AuthDto = {
          email:'test@test.com',
          password:'test'
    }    
    describe('Signup',() => {
      it('should throw if email empty', () => {

        return pactum
        .spec()
        .post(
          '/auth/signup'
        ).withBody({
          password: dto.password
        })
        .expectStatus(400)
      });

      it('should throw if password empty', () => {

        return pactum
        .spec()
        .post(
          '/auth/signup'
        ).withBody({
          password: dto.email
        })
        .expectStatus(400)
      });

      it('should throw if no body', () => {

        return pactum
        .spec()
        .post(
          '/auth/signup'
        ).withBody({})
        .expectStatus(400)
      });

      it('should signup', () => {

        return pactum
        .spec()
        .post(
          '/auth/signup'
        ).withBody(dto)
        .expectStatus(201)
      })

    });

    describe('Signin',() => {

      it('should throw if email empty', () => {

        return pactum
        .spec()
        .post(
          '/auth/signin'
        ).withBody({
          password: dto.password
        })
        .expectStatus(400)
      });

      it('should throw if password empty', () => {

        return pactum
        .spec()
        .post(
          '/auth/signin'
        ).withBody({
          password: dto.email
        })
        .expectStatus(400)
      });

      it('should throw if no body', () => {

        return pactum
        .spec()
        .post(
          '/auth/signin'
        ).withBody({})
        .expectStatus(400)
      });

      it('should signin', () => {

        return pactum
        .spec()
        .post(
          '/auth/signin'
        ).withBody(dto)
        .expectStatus(200)
        .stores('userAt','access_token')
      })
    });
  });

  describe('User', () => {
    describe('Get me',() => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
      })
    });
    describe('Edit user',() => {});
  });

  describe('Bookmarks', () => {
    describe('Create Bookmark',() => {});
    describe('Get Bookmarks',() => {});
    describe('Get Bookmark by id',() => {});
    describe('Edit Bookmarks',() => {});
    describe('Delete Bookmark',() => {});
  });

  it.todo('should pass')

})
