# NextEdge Bank

<img width="1600" alt="credit" src="https://user-images.githubusercontent.com/67114280/195503756-f633b1f2-5b6d-4be9-8452-560e6196708a.png">

### Built with Next Js, Hardhat, Solidity, and Tailwind CSS.

### Stack

- Frontend : [Next Js](https://nextjs.org/)
- Smart Contract Lang : [Solidity](https://docs.soliditylang.org/en/v0.8.17/)
- Dev Environment for ETH Software: [Hardhat](https://hardhat.org/)
- Network : [Polygon](https://polygon.technology/)
- Style : [Tailwind CSS](https://tailwindcss.com/)

### Installation

####  Fork The Repo 

Click on the Right Side of the Top Bar to After the Watch button. <img src="https://upload.wikimedia.org/wikipedia/commons/3/38/GitHub_Fork_Button.png" width="120px" />

Now It will be available in GitHub Account.

#### OR

#### Clone

- Clone this repo with url

```shell
git clone https://github.com/Aakrut/nextedge-bank
```

##### Setup

> Install npm dependencies using npm install

```shell
$ npm install && cd nextedge-bank && npm install
```

> Set up environment Variables I already Provided .env.example file.

> Create a .env file in the root directory.

> Set up required environment variables.

```
URL="POLYGON_TESTNET_URI"
PRIVATE_KEY="METAMASK_PRIVATE_KEY"
NEXT_PUBLIC_CONTRACT_ADDRESS="CONTRACT_ADDRESS"
```

> In the Root Directory First Compile Your Smart Contract with This Following Command.

```shell
npx hardhat compile
```

> After Deploy Smart Contract to the Polygon Mumbai Testnet with this command.

```shell
npx hardhat run scripts/deploy.js --network mumbai
```

> Copy Smart Contract Address and replace it in with your "CONTRACT_ADDRESS"

```
NEXT_PUBLIC_CONTRACT_ADDRESS="CONTRACT_ADDRESS"
```

Let's Run this command for dev

```shell
npm run dev
--or--
yarn dev
```

### Screenshots

<img width="1600" alt="NextEdge" src="https://user-images.githubusercontent.com/67114280/195503736-df69ee58-f14f-42c3-8056-57b75011d8cc.png">

<img width="1600" alt="dashboard" src="https://user-images.githubusercontent.com/67114280/195503726-c58ad7f9-5ab3-426a-bc1a-dec3cf9e7859.png">

<img width="1600" alt="dashboard 2" src="https://user-images.githubusercontent.com/67114280/195503711-1585bc2f-cf7b-4084-896d-379a2c6fc4ea.png">

<img width="1600" alt="responsive" src="https://user-images.githubusercontent.com/67114280/195503745-3965b35c-3a4b-4a5e-87fe-7aa15e86228d.png">
