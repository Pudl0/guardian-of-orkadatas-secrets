import { ChatInputCommandInteraction, SlashCommandBuilder, GuildMemberRoleManager, RoleResolvable, DiscordAPIError } from "discord.js";


module.exports = {
    data: new SlashCommandBuilder()
        .setName('removerole')
        .setDescription('Removes role from self  !! TO BE USED WITH CAUTION !!')
        .addRoleOption(option =>
            option
                .setName("role")
                .setDescription("Role to remove")
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const role = interaction.options.getRole('role');

        if (!(interaction.member?.roles as GuildMemberRoleManager).cache.some(r => r.name == role?.name)) {
            await interaction.reply({ content: `You don't have "${role?.name}"`, ephemeral: true });
            return;   
        }

        let sucessfull = await (interaction.member?.roles as GuildMemberRoleManager).remove(role as RoleResolvable).catch(async error => {
            if ((error as DiscordAPIError).code == 50013) {
                await interaction.reply(`Role "${role?.name}" could not be removed, because of missing permission :(`);
            } else {
                await interaction.reply(`An error has occurred while trying to remove "${role?.name}"`);  
            }
        });

        if (sucessfull != undefined) {
            await interaction.reply(`Role "${role?.name}" has been removed`);
        } 
    },
};

