import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export const sessionService = {
    async getSessionsAsync() {
        return await client.dndSession.findMany();
    },
    async getSessionByIdAsync(id: string) {
        return await client.dndSession.findUnique({
            where: {
                id: id
            }
        });
    },
    async createSessionAsync(name: string, dmId: string) {
        return await client.dndSession.create({
            data: {
                name: name,
                dmId: dmId
            }
        });
    }
}