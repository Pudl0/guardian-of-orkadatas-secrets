import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export const characterService = {
    async getCharactersAsync() {
        return await client.dndCharacter.findMany({
            include: {
                Session: true
            }
        });
    },
    async getCharacterByIdAsync(id: string) {
        return await client.dndCharacter.findUnique({
            where: {
                id: id
            },
            include: {
                Session: true
            }
        });
    },
    async createCharacterAsync(name: string, userId: string, sessionId: string) {
        return await client.dndCharacter.create({
            data: {
                name: name,
                userId: userId,
                sessionId: sessionId
            }
        });
    },
    async deleteCharacterByIdAsync(id: string) {
        return await client.dndCharacter.delete({
            where: {
                id: id
            }
        });
    },
    async updateCharacterNameAsync(id: string, name: string) {
        return await client.dndCharacter.update({
            where: {
                id: id
            },
            data: {
                name: name
            }
        });
    },
    async updateCharacterUserIdAsync(id: string, userId: string) {
        return await client.dndCharacter.update({
            where: {
                id: id
            },
            data: {
                userId: userId
            }
        });
    },
    async updateCharacterSessionIdAsync(id: string, sessionId: string) {
        return await client.dndCharacter.update({
            where: {
                id: id
            },
            data: {
                sessionId: sessionId
            }
        });
    }
}