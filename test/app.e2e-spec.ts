import { Test } from "@nestjs/testing"
import { AppModule } from "../src/app.module"
import { INestApplication, ValidationPipe } from "@nestjs/common"
import { PrismaService } from "../src/prisma/prisma.service";
import * as pactum from 'pactum';
import { AuthDto } from "src/auth/dto";
import { EditUserDto } from "src/user/dto";
import { CreateBookMarkDto, EditBookMarkDto } from "src/bookmark/dto";

describe('App E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    app = moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
    await app.init()
    await app.listen(3333);
    pactum.request.setBaseUrl("http://localhost:3333")

    prisma = app.get(PrismaService)
    await prisma.cleanDb()
  })

  afterAll(() => {
    app.close()
  })

  describe('Auth', () => {
    describe('SignUp', () => {
      it("should signup", async () => {
        const dto: AuthDto = {
          email: "pokemon@gmail.com",
          password: "12121"
        }
        return pactum.spec().post('/auth/signup').withBody(dto).expectStatus(201)
      })

      it("should throw if email empty", async () => {
        const dto: AuthDto = {
          email: "pokemon@gmail.com",
          password: "12121"
        }
        return pactum.spec().post('/auth/signup').withBody({ password: dto.password }).expectStatus(400)
      })

      it("should throw if password empty", async () => {
        const dto: AuthDto = {
          email: "pokemon@gmail.com",
          password: "12121"
        }
        return pactum.spec().post('/auth/signup').withBody({ email: dto.email }).expectStatus(400)
      })

      it("should throw if no body provided", async () => {
        return pactum.spec().post('/auth/signup').withBody({}).expectStatus(400)
      })
    })

    describe('SignIn', () => {
      it("should signin", async () => {
        const dto: AuthDto = {
          email: "pokemon@gmail.com",
          password: "12121"
        }
        return pactum.spec().post('/auth/signin').withBody(dto).expectStatus(201).stores('userAt', 'access_token')
      })

      it("should throw if email empty", async () => {
        const dto: AuthDto = {
          email: "pokemon@gmail.com",
          password: "12121"
        }
        return pactum.spec().post('/auth/signin').withBody({ password: dto.password }).expectStatus(400)
      })

      it("should throw if password empty", async () => {
        const dto: AuthDto = {
          email: "pokemon@gmail.com",
          password: "12121"
        }
        return pactum.spec().post('/auth/signin').withBody({ email: dto.email }).expectStatus(400)
      })

      it("should throw if no body provided", async () => {
        return pactum.spec().post('/auth/signin').withBody({}).expectStatus(400)
      })
    })
  })
  describe('User', () => {
    describe('Get Me', () => {
      it('should get user', () => {
        return pactum.spec().get('/user/me').withHeaders({
          Authorization: `Bearer $S{userAt}`
        }).expectStatus(200)
      })
    })
    describe('Edit User', () => {
      it('should edit user', () => {

        const dto: EditUserDto = {
          email: "pokemon2@gmail.com",
          firstName: "check"
        }
        return pactum.spec().patch('/user').withHeaders({
          Authorization: `Bearer $S{userAt}`
        }).withBody(dto).expectStatus(200).expectBodyContains(dto.firstName).expectBodyContains(dto.email)
      })
    })
  })

  describe('Bookmarks', () => {
    describe('Get Bookmarks', () => {
      it('should get bookmarks', () => {

        return pactum.spec().get('/bookmarks/').withHeaders({
          Authorization: `Bearer $S{userAt}`
        }).expectStatus(200).expectJsonLength("bookmarks", 0)
      })
    })

    describe('Create Bookmarks', () => {
      it('should create bookmark', () => {

        const dto: CreateBookMarkDto = {
          title: "Alchemist",
          link: "www.google.com"
        }
        return pactum.spec().post('/bookmarks/').withHeaders({
          Authorization: `Bearer $S{userAt}`
        }).withBody(dto).expectStatus(201)
      })
    })

    describe('Get Bookmarks', () => {
      it('should get bookmarks', () => {

        return pactum.spec().get('/bookmarks/').withHeaders({
          Authorization: `Bearer $S{userAt}`
        }).expectStatus(200).expectJsonLength("bookmarks", 1).stores("bookmarkId", "bookmarks[0].id")
      })

      it('should get bookmarks for id', () => {
        return pactum.spec().get(`/bookmarks/{id}`).withPathParams('id', `$S{bookmarkId}`).withHeaders({
          Authorization: `Bearer $S{userAt}`
        }).expectStatus(200)
      })
    })

    describe('Edit Bookmarks', () => {

      it('should update data for id', () => {
        const dto: EditBookMarkDto = {
          title: "Alchemist",
          description: "sdhasjkdkajs",
          link: "www.google.com"
        }
        return pactum.spec().patch(`/bookmarks/{id}`).withPathParams('id', `$S{bookmarkId}`).withHeaders({
          Authorization: `Bearer $S{userAt}`
        }).withBody(dto).expectStatus(200).expectBodyContains("Alchemist"
        )
          .expectBodyContains("sdhasjkdkajs")
          .expectBodyContains(
            "www.google.com"
          )
      })
    })
    describe('Delete Bookmarks', () => {
      it('should get delete for id', () => {
        return pactum.spec().delete(`/bookmarks/{id}`).withPathParams('id', `$S{bookmarkId}`).withHeaders({
          Authorization: `Bearer $S{userAt}`
        }).expectStatus(204)
      })

      it('should throw error for invalid id', () => {
        return pactum.spec().delete(`/bookmarks/{id}`).withPathParams('id', `$S{bookmarkId}`).withHeaders({
          Authorization: `Bearer $S{userAt}`
        }).expectStatus(403)
      })
    })
    describe('Edit Bookmarks', () => {

      it('should throw error for invalid id', () => {

        return pactum.spec().patch(`/bookmarks/{id}`).withPathParams('id', `$S{bookmarkId}`).withHeaders({
          Authorization: `Bearer $S{userAt}`
        }).expectStatus(403)
      })
    })

  })

})