async function deployContract() {
    const PokemonNFT = await ethers.getContractFactory("PokemonNFT")
    const exampleNFT = await PokemonNFT.deploy()
    await exampleNFT.deployed()
    const txHash = exampleNFT.deployTransaction.hash
    const txReceipt = await ethers.provider.waitForTransaction(txHash)
    const contractAddress = txReceipt.contractAddress
    console.log("Contract deployed to address:", contractAddress)
   }
   
deployContract()
 .then(() => process.exit(0))
 .catch((error) => {
   console.error(error);
   process.exit(1);
 });