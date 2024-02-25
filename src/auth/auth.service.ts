import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) { }
    async signup(dto: AuthDto) {
        try { //generate the password hash
            const hash = await argon.hash(dto.password)

            // save the user details and return
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email, hash
                },
            })
            delete user.hash
            return user
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new ForbiddenException("Credential taken")
                }
            }
            throw error
        }
    }

    async signin(dto: AuthDto) {
        try {
            const user = await this.prisma.user.findFirst({
                where: {
                    email: dto.email
                }
            })
            if (!user) {
                throw new ForbiddenException('Credentials Incorrect')
            }
            const pwMatches = await argon.verify(user.hash, dto.password)

            if (!pwMatches) {
                throw new ForbiddenException('Credentials Incorrect')
            }

            return this.signToken(user.id, user.email);

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new ForbiddenException("Credential taken")
                }
            }
            throw error
        }
    }

    async signToken(userId: number, email: string): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email
        }
        return {
            access_token: await this.jwt.signAsync(payload, {
                expiresIn: "15m",
                secret: this.config.get("JWT_SECRET")
            })
        }
    }

}