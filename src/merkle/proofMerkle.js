const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const round1List = require("../whitelist/round1.json");
const round2List = require("../whitelist/round2.json");

const hashedAddresses1 = round1List.map((addr) => keccak256(addr));
const merkleTree1 = new MerkleTree(hashedAddresses1, keccak256, {
  sortPairs: true,
});
const root1 = merkleTree1.getHexRoot();

const hashedAddresses2 = round2List.map((addr) => keccak256(addr));
const merkleTree2 = new MerkleTree(hashedAddresses2, keccak256, {
  sortPairs: true,
});
const root2 = merkleTree2.getHexRoot();
/*
// const myAddress = "0xd136EB70B571cEf8Db36FAd5be07cB4F76905B64";
const hashedAddress = keccak256(myAddress);
const proof = merkleTree.getHexProof(hashedAddress);
const root = merkleTree.getHexRoot();

// just for front-end display convenience
// proof will be validated in smart contract as well
const valid = merkleTree.verify(proof, hashedAddress, root);

console.log(proof);
console.log(root);
console.log(valid);
*/

export function proofMerkle(myAddress) {
  let category = -1;
  let proof;
  const hashedAddress = keccak256(myAddress);
  const proof1 = merkleTree1.getHexProof(hashedAddress);
  const valid1 = merkleTree1.verify(proof1, hashedAddress, root1);

  const proof2 = merkleTree2.getHexProof(hashedAddress);
  const valid2 = merkleTree2.verify(proof2, hashedAddress, root2);
  if (valid1) {
    category = 0;
    proof = proof1;
  } else if (valid2) {
    category = 1;
    proof = proof2;
  }

  return { category, proof };
}
