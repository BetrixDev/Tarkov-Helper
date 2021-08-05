require('../utils')
const { SetServerData } = require('../database')

module.exports = {
    data: {
        name: 'admin',
        description: 'ADMIN COMMAND: Assign an admin role so that role can use admin commands',
        options: [{
            type: 8,
            name: "role",
            description: "Which roles has admin access",
            required: true
        }]
    },
    message: async function(args, { interaction, guild }) {
        try {
            if (interaction.user.id === guild.ownerId) {
                let Role = args['role']
                SetServerData(interaction.guildId, 'AdminRole', Role)

                return { Type: "ephemeral", Content: `Changed Role to: **${await guild.roles.fetch(Role).then(role => {return role.name})}**` }
            } else {
                return { Type: "error", Content: ErrorMessage('Insufficient permission'), Time: 5000 }
            }
        } catch (e) {
            console.log(e)
            return { Type: "error", Content: ErrorMessage('Error changing admin role, please try again later'), Time: 5000 }
        }
    }
}