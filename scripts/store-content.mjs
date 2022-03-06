dotenv.config()
import { NFTStorage, File } from "nft.storage"
import fs from 'fs'
import dotenv from 'dotenv'
import { parse } from 'csv-parse';
const API_KEY = process.env.NFT_STORAGE_API_KEY
const POKEMON_CSV_PATH = 'assets/pokemon_metadata.csv'
const POKEMON_PHOTO_PATH = 'assets/original_150_pokemon_photos/'

// Process CSV file
var parser = await parse({columns: true}, async function (err, records) {
    for (let index = 0; index < 50; index++) {
        var element = records[index]
        // Each row of the CSV represents a single Pokemon extract the
        // name, description, type, attack, defense, speed, and number.
        var name = element['Pokemon']
        var description = element['Description']
        var type = element['Type 1']
        var hp = element['HP']
        var attack = element['Attack']
        var defense = element['Defense']
        var speed = element['Speed']
        var number = element['Number']
        var picture = `${POKEMON_PHOTO_PATH}${number}.PNG`

        var attributes = createAttributes(type, hp, attack, defense, speed)
        // store the metadata for this Pokemon
        await storeAsset(name, description, attributes, picture)
    }
});

fs.createReadStream(POKEMON_CSV_PATH).pipe(parser);

function createAttributes(type, hp, attack, defense, speed){
    let type_attr = JSON.parse(`{ "trait_type": "Type", "value": "${type}" }`)
    let hp_attr = JSON.parse(`{ "trait_type": "HP", "value": ${hp} }`)
    let attack_attr = JSON.parse(`{ "trait_type": "Attack", "value": ${attack} }`)
    let defense_attr = JSON.parse(`{ "trait_type": "Defense", "value": ${defense} }`)
    let speed_attr = JSON.parse(`{ "trait_type": "Speed", "value": ${speed} }`)
    return [type_attr, hp_attr, attack_attr, defense_attr, speed_attr]
}

// Store metadata for one Pokemon on IPFS
async function storeAsset(name, description, attributes, picture_path) {
   const client = new NFTStorage({ token: API_KEY })
   const metadata = await client.store({
       name: `BlockchainBob ${name}`,
       description: description,
       attributes: attributes,
       image: new File(
           [await fs.promises.readFile(picture_path)],
           `${name}Photo.png`,
           { type: 'image/png' }
       ),
   })
   console.log(`${name}: ${metadata.url}`)
}