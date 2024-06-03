import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export const characterService = {
    async getCharactersAsync() {
        return await client.dndCharacter.findMany();
    },
    async getCharacterByIdAsync(id: string) {
        return await client.dndCharacter.findUnique({
            where: {
                id: id
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
    }
}