dotenv.config()
import { NFTStorage, File } from "nft.storage"
import fs from 'fs'
import dotenv from 'dotenv'
import { parse } from 'csv-parse';
const API_KEY = process.env.NFT_STORAGE_API_KEY
const POKEMON_CSV_PATH = 'assets/pokemon_descriptions.csv'
const POKEMON_PHOTO_PATH = 'assets/original_150_pokemon_photos/'

// Process CSV file
var parser = parse({columns: true}, function (err, records) {
    for (let index = 0; index < 30; index++) {
    //records.forEach(element => {
        var element = records[index]
        // Each row of the CSV represents a single Pokemon.
        // Extract the name, description, and number.
        var name = element['Name']
        var description = element['Description']
        console.log(`Processing ${name}, Description ${description}`)
        var number = element['Number']
        var picture = `${POKEMON_PHOTO_PATH}${number}.PNG`
        // store the metadata for this Pokemon
        storeAsset(name, description, picture)
    }
});

fs.createReadStream(POKEMON_CSV_PATH).pipe(parser);

// Store metadata (name, description, picture)
// for one Pokemon in on IPFS
async function storeAsset(name, description, picture_path) {
   const client = new NFTStorage({ token: API_KEY })
   const metadata = await client.store({
       name: `BlockchainBob ${name}`,
       description: description,
       image: new File(
           [await fs.promises.readFile(picture_path)],
           `${name}Photo.png`,
           { type: 'image/png' }
       ),
   })
   // create URL so web browser can fetch resource from ipfs.io gateway
   var url = metadata.url.replace('ipfs://', 'https://ipfs.io/ipfs/')
   console.log(`Content for ${name} been stored on Filecoin and IPFS with URL: ${url}`)
   // Example:
   // https://ipfs.io/ipfs/bafyreicpsm7ndvlowmqoizufxvq65m6leh4n4stg4vuuzcdyykf6ha4g7a/metadata.json
}