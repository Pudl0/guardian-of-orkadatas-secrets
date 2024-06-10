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
        return await client.dndSession.findMany({
            include: {
                DndCharacter: true
            }
        });
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
    async deleteSessionByIdAsync(id: string) {
        return await client.dndSession.delete({
            where: {
                id: id
            }
        });
    },
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