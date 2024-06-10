import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

/**
 * Service for managing DND characters.
 */
export const characterService = {
    /**
     * Retrieves all characters with their associated sessions.
     * @returns A promise that resolves to an array of characters.
     */
    async getCharactersAsync() {
        return await client.dndCharacter.findMany({
            include: {
                Session: true
            }
        });
    },

    /**
     * Retrieves a character by its ID with its associated session.
     * @param id - The ID of the character.
     * @returns A promise that resolves to the character.
     */
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

    /**
     * Creates a new character.
     * @param name - The name of the character.
     * @param userId - The ID of the user who owns the character.
     * @param sessionId - The ID of the session the character belongs to.
     * @returns A promise that resolves to the created character.
     */
    async createCharacterAsync(name: string, userId: string, sessionId: string) {
        return await client.dndCharacter.create({
            data: {
                name: name,
                userId: userId,
                sessionId: sessionId
            }
        });
    },

    /**
     * Deletes a character by its ID.
     * @param id - The ID of the character to delete.
     * @returns A promise that resolves when the character is deleted.
     */
    async deleteCharacterByIdAsync(id: string) {
        return await client.dndCharacter.delete({
            where: {
                id: id
            }
        });
    },

    /**
     * Updates the name of a character.
     * @param id - The ID of the character to update.
     * @param name - The new name for the character.
     * @returns A promise that resolves to the updated character.
     */
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

    /**
     * Updates the user ID of a character.
     * @param id - The ID of the character to update.
     * @param userId - The new user ID for the character.
     * @returns A promise that resolves to the updated character.
     */
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

    /**
     * Updates the session ID of a character.
     * @param id - The ID of the character to update.
     * @param sessionId - The new session ID for the character.
     * @returns A promise that resolves to the updated character.
     */
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