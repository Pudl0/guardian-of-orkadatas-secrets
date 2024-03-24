# guardian-of-orkadatas-secrets
Discord Bot that operates on the trainee center dnd and gaming discord server.

**Contents:**

- [guardian-of-orkadatas-secrets](#guardian-of-orkadatas-secrets)
  - [Setup](#setup)
    - [Development](#development)
    - [Production](#production)
  - [Running with Docker](#running-with-docker)
  - [Environment Variables](#environment-variables)
  - [Character Description:](#character-description)


## Setup

### Development

To install all dependencies run `npm install` in the root directory.
In the root directory, run `npm run dev` to start the bot with --watch enabled.

You need [NodeJS](https://nodejs.org/en) and [NPM](https://www.npmjs.com/). NPM is included with nodejs.

### Production

Just use [Docker](#running-with-docker)

## Running with Docker

[Example Compose](/docker-compose.yml)

There is a default compose provided.
The enviroment variables need to be changed to make the bot work.
See [Environment Variables](#environment-variables)

## Environment Variables

You need to change these Enviroment Variables to make the bot work.
Create a `.env` in the root folder for development or pass them through the compose file.

- `DISCORD_TOKEN`: the token of your discord bot.
- `DISCORD_CLIENT_ID`: the client id of your discord bot.
- `DISCORD_GUILD_ID`: the guild id of the guild that your bot should run in.


## Character Description:
The Guardian of Orkadata's Secrets stands tall, a figure shrouded in an aura of ancient knowledge and mystical power. At first glance, one might mistake it for a towering statue carved from the very stone of the realm itself, but upon closer inspection, the truth becomes clear: this is a being of immense wisdom and power.

Its form is humanoid in shape, with features reminiscent of the ancient races that once roamed the lands of Orkadata. Carved into its stony visage are deep lines of age and experience, giving it an air of timeless wisdom. Its eyes, glowing with an otherworldly light, seem to pierce through the veil of reality, glimpsing secrets and truths hidden from mortal eyes.

Adorned in robes woven from the fabric of magic itself, the Guardian exudes an aura of quiet majesty. Symbols of arcane power and esoteric knowledge are etched into the fabric, glowing softly with an inner light that pulses with each beat of the Guardian's heart. Around its neck hangs a pendant, a relic of ages past, said to hold the key to unlocking the greatest secrets of Orkadata.

In one hand, the Guardian holds a staff of gnarled wood, carved with intricate runes and symbols of power. With a mere gesture, it can command the very forces of magic, bending reality to its will. In the other hand, it holds a tome bound in ancient leather, its pages filled with the accumulated knowledge of centuries.

As the Guardian stands vigil over the secrets of Orkadata, it radiates an aura of quiet strength and unyielding resolve. Though silent and stoic, it is a beacon of hope and wisdom in a world shrouded in darkness and uncertainty. And for those brave enough to seek its counsel, the Guardian offers the keys to unlocking the mysteries of the realm, guiding them on their journey to enlightenment and understanding. 
