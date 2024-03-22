import { ChatInputCommandInteraction, SlashCommandBuilder, GuildMemberRoleManager, RoleResolvable, DiscordAPIError } from "discord.js";


module.exports = {
    data: new SlashCommandBuilder()
        .setName('giverole')
        .setDescription('Adds role to self if that role is of lower permission than the highest role of self.')
        .addRoleOption(option =>
            option
                .setName("role")
                .setDescription("Role to add")
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const role = interaction.options.getRole('role');

        if ((interaction.member?.roles as GuildMemberRoleManager).cache.some(r => r.name == role?.name)) {
            await interaction.reply({ content: `You already have "${role?.name}"`, ephemeral: true });
            return;   
        }

        let sucessfull = await (interaction.member?.roles as GuildMemberRoleManager).add(role as RoleResolvable).catch(async error => {
            if ((error as DiscordAPIError).code == 50013) {
                await interaction.reply(`Role "${role?.name}" could not be added, because of missing permission :(`);
            } else {
                await interaction.reply(`An error has occurred while trying to add "${role?.name}"`);
            }
        });

        if (sucessfull != undefined) {
            await interaction.reply(`Role "${role?.name}" has been added`);
        }        
    },
};

