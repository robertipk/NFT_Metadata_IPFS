import { parse } from 'csv-parse'
const CONTRACT_ADDRESS = "0x0689a34eEd3498C5a310b93F016725f34F6246aE"
import fs from 'fs'
const METADATA_URLS_PATH = 'assets/metadata_urls.csv'

// Process CSV file
var parser = parse({columns: true}, async function (err, records) {
   console.log(records.length)
   for (let index = 0; index < records.length; index++) {
      var record = records[index]
      console.log(`Minting:${record['POKEMON']}`)
      await mintNFT(CONTRACT_ADDRESS, record['IPFS_URL'])
   }
})

fs.createReadStream(METADATA_URLS_PATH).pipe(parser)

async function mintNFT(contractAddress, metaDataURL) {
   const ExampleNFT = await ethers.getContractFactory("PokemonNFT")
   const [owner] = await ethers.getSigners()
   await ExampleNFT.attach(contractAddress).mintNFT(owner.address, metaDataURL)
   console.log("NFT minted to: ", owner.address)
}