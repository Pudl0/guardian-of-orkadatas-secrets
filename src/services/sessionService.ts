import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export const sessionService = {
    async getAllSessionsByNameAsync(name: string) {
        let sessions = await client.dndSession.findMany({
            where: {
                name: name
            }
        });
        return sessions;
    },
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
    async getSessionByNameAsync(name: string) {
        let sessions = await this.getAllSessionsByNameAsync(name);

        if (sessions.length == 0)
            return null;

        return sessions[0];
    },
    async createSessionAsync(name: string, dmId: string) {
        let sessionsDuplicates = await this.getAllSessionsByNameAsync(name);

        if (sessionsDuplicates.length > 0)
            return null;

        return await client.dndSession.create({
            data: {
                name: name,
                dmId: dmId
            }
        });
    },
    async deleteSessionByIdAsync(id: string) {
        return await client.dndSession.delete({
            where: {
                id: id
            }
        });
    }
}