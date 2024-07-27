import { Test } from "@nestjs/testing"
import { AppModule } from "../src/app.module"
import { INestApplication, ValidationPipe } from "@nestjs/common"
import { PrismaService } from "../src/prisma/prisma.service";
import * as pactum from 'pactum'
import { AuthDto } from "src/auth/dto";
import { EditUserDto } from "../src/user/dto";
import { CreateBookmarkDto } from "src/bookmark/dto";
import { inspect } from "util";

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
    describe('Edit user',() => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: "EditFirstname",
          email: "EditEmail@test.com"
        }
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email)
      })
    });
  });

  describe('Bookmarks', () => {
    describe('Get Empty Bookmarks',() => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
          .expectBody([])
      })
    });
    describe('Create Bookmark',() => {
      const dto: CreateBookmarkDto = {
        title: "First bookmark",
        link: "https.//www.youtube.com",
      }
      it('should create bookmark', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId', 'id')
      })
    });
    describe('Get Bookmarks',() => {
      it('should get bookmark', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
          .expectJsonLength(1)
      })
    });
    describe('Get Bookmark by id',() => {
      it('should get bookmark', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}')
      })
    });
    describe('Edit Bookmarks',() => {});
    describe('Delete Bookmark',() => {});
  });

  it.todo('should pass')

})
