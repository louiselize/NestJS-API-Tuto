import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService){}

    signin(){return 'signin function'}

    signup(){return 'signup function'}

}