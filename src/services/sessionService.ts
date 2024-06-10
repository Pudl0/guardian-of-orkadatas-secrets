import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

/**
 * Service for managing DND sessions.
 */
export const sessionService = {
    /**
     * Retrieves all sessions with the given name.
     * @param name - The name of the sessions to retrieve.
     * @returns A promise that resolves to an array of sessions.
     */
    async getAllSessionsByNameAsync(name: string) {
        let sessions = await client.dndSession.findMany({
            where: {
                name: name
            }
        });
        return sessions;
    },

    /**
     * Retrieves all sessions.
     * @returns A promise that resolves to an array of sessions.
     */
    async getSessionsAsync() {
        return await client.dndSession.findMany({
            include: {
                DndCharacter: true
            }
        });
    },

    /**
     * Retrieves a session by its ID.
     * @param id - The ID of the session to retrieve.
     * @returns A promise that resolves to the session.
     */
    async getSessionByIdAsync(id: string) {
        return await client.dndSession.findUnique({
            where: {
                id: id
            },
            include: {
                DndCharacter: true
            }
        });
    },

    /**
     * Retrieves a session by its name.
     * @param name - The name of the session to retrieve.
     * @returns A promise that resolves to the session, or null if not found.
     */
    async getSessionByNameAsync(name: string) {
        let sessions = await this.getAllSessionsByNameAsync(name);

        if (sessions.length == 0)
            return null;

        return sessions[0];
    },

    /**
     * Creates a new session.
     * @param name - The name of the session.
     * @param dmId - The ID of the Dungeon Master.
     * @param dayOfWeek - The day of the week for the session.
     * @param time - The time of the session.
     * @returns A promise that resolves to the created session, or null if a session with the same name already exists or if the dayOfWeek or time values are invalid.
     */
    async createSessionAsync(name: string, dmId: string, dayOfWeek: number, time: number) {
        let sessionsDuplicates = await this.getAllSessionsByNameAsync(name);

        if (sessionsDuplicates.length > 0)
            return null;

        if (dayOfWeek < 0 || dayOfWeek > 6)
            return null;

        if (time < 0 || time > 23)
            return null;

        return await client.dndSession.create({
            data: {
                name: name,
                dmId: dmId,
                dayOfWeek: dayOfWeek,
                time: time 
            }
        });
    },

    /**
     * Deletes a session by its ID.
     * @param id - The ID of the session to delete.
     * @returns A promise that resolves to the deleted session.
     */
    async deleteSessionByIdAsync(id: string) {
        return await client.dndSession.delete({
            where: {
                id: id
            }
        });
    },

    /**
     * Updates the active status of a session.
     * @param id - The ID of the session to update.
     * @param active - The new active status.
     * @returns A promise that resolves to the updated session.
     */
    async updateSessionActiveAsync(id: string, active: boolean) {
        return await client.dndSession.update({
            where: {
                id: id
            },
            data: {
                active: active
            }
        });
    },

    /**
     * Updates the time of a session.
     * @param id - The ID of the session to update.
     * @param time - The new time value.
     * @returns A promise that resolves to the updated session, or null if the time value is invalid.
     */
    async updateSessionTimeAsync(id: string, time: number){

        if (time < 0 || time > 23)
            return null;

        return await client.dndSession.update({
            where: {
                id: id
            },
            data: {
                time: time
            }
        });
    },

    /**
     * Updates the day of the week of a session.
     * @param id - The ID of the session to update.
     * @param dayOfWeek - The new day of the week value.
     * @returns A promise that resolves to the updated session, or null if the dayOfWeek value is invalid.
     */
    async updateSessionDayOfWeekAsync(id: string, dayOfWeek: number) {

        if (dayOfWeek < 0 || dayOfWeek > 6)
            return null;

        return await client.dndSession.update({
            where: {
                id: id
            },
            data: {
                dayOfWeek: dayOfWeek
            }
        });
    },

    /**
     * Updates the name of a session.
     * @param id - The ID of the session to update.
     * @param name - The new name value.
     * @returns A promise that resolves to the updated session, or null if a session with the same name already exists.
     */
    async updateSessionNameAsync(id: string, name: string) {

        let sessionsDuplicates = await this.getAllSessionsByNameAsync(name);
        
        if (sessionsDuplicates.length > 0)
            return null;

        return await client.dndSession.update({
            where: {
                id: id
            },
            data: {
                name: name
            }
        });
    },

    /**
     * Updates the Dungeon Master ID of a session.
     * @param id - The ID of the session to update.
     * @param dmId - The new Dungeon Master ID.
     * @returns A promise that resolves to the updated session.
     */
    async updateSessionDmIdAsync(id: string, dmId: string) {
        return await client.dndSession.update({
            where: {
                id: id
            },
            data: {
                dmId: dmId
            }
        });
    }
}