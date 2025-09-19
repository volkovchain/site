import type { PeriodicElement, ElementCategory } from '@/types'

export const periodicElements: PeriodicElement[] = [
  // Layer 1 Blockchains
  {
    symbol: 'Bt',
    name: 'Bitcoin',
    atomicNumber: 1,
    category: 'payment-coin',
    color: '#F7931A',
    description: 'The first and most well-known cryptocurrency, serving as digital gold',
    marketCap: 600000000000,
    website: 'https://bitcoin.org',
    documentation: 'https://bitcoin.org/en/developer-documentation',
    launchDate: '2009-01-03',
    consensus: 'Proof of Work'
  },
  {
    symbol: 'Eth',
    name: 'Ethereum',
    atomicNumber: 2,
    category: 'smart-contract-platform',
    color: '#627EEA',
    description: 'World computer enabling smart contracts and decentralized applications',
    marketCap: 300000000000,
    website: 'https://ethereum.org',
    documentation: 'https://ethereum.org/en/developers/docs/',
    launchDate: '2015-07-30',
    consensus: 'Proof of Stake'
  },
  {
    symbol: 'Sol',
    name: 'Solana',
    atomicNumber: 3,
    category: 'smart-contract-platform',
    color: '#14F195',
    description: 'High-performance blockchain supporting thousands of transactions per second',
    marketCap: 50000000000,
    website: 'https://solana.com',
    documentation: 'https://docs.solana.com',
    launchDate: '2020-03-16',
    consensus: 'Proof of History + Proof of Stake'
  },
  {
    symbol: 'Ada',
    name: 'Cardano',
    atomicNumber: 4,
    category: 'smart-contract-platform',
    color: '#0033AD',
    description: 'Research-driven blockchain focused on sustainability and scalability',
    marketCap: 25000000000,
    website: 'https://cardano.org',
    documentation: 'https://docs.cardano.org',
    launchDate: '2017-09-29',
    consensus: 'Proof of Stake'
  },
  {
    symbol: 'Dot',
    name: 'Polkadot',
    atomicNumber: 5,
    category: 'infrastructure',
    color: '#E6007A',
    description: 'Multi-chain network enabling blockchain interoperability',
    marketCap: 15000000000,
    website: 'https://polkadot.network',
    documentation: 'https://docs.polkadot.network',
    launchDate: '2020-05-26',
    consensus: 'Nominated Proof of Stake'
  },

  // Layer 2 Solutions
  {
    symbol: 'Pol',
    name: 'Polygon',
    atomicNumber: 6,
    category: 'layer2-solution',
    color: '#8247E5',
    description: 'Ethereum scaling solution with low fees and fast transactions',
    marketCap: 8000000000,
    website: 'https://polygon.technology',
    documentation: 'https://docs.polygon.technology',
    launchDate: '2017-10-01',
    blockchain: 'Ethereum',
    consensus: 'Proof of Stake'
  },
  {
    symbol: 'Arb',
    name: 'Arbitrum',
    atomicNumber: 7,
    category: 'layer2-solution',
    color: '#28A0F0',
    description: 'Optimistic rollup scaling Ethereum with high compatibility',
    marketCap: 5000000000,
    website: 'https://arbitrum.io',
    documentation: 'https://docs.arbitrum.io',
    launchDate: '2021-05-28',
    blockchain: 'Ethereum'
  },
  {
    symbol: 'Op',
    name: 'Optimism',
    atomicNumber: 8,
    category: 'layer2-solution',
    color: '#FF0420',
    description: 'Optimistic rollup focused on simplicity and Ethereum equivalence',
    marketCap: 3000000000,
    website: 'https://optimism.io',
    documentation: 'https://docs.optimism.io',
    launchDate: '2021-07-01',
    blockchain: 'Ethereum'
  },

  // DeFi Protocols
  {
    symbol: 'Uni',
    name: 'Uniswap',
    atomicNumber: 9,
    category: 'defi-protocol',
    color: '#FF007A',
    description: 'Leading decentralized exchange protocol for automated market making',
    marketCap: 4000000000,
    website: 'https://uniswap.org',
    documentation: 'https://docs.uniswap.org',
    launchDate: '2018-11-02',
    blockchain: 'Ethereum'
  },
  {
    symbol: 'Aave',
    name: 'Aave',
    atomicNumber: 10,
    category: 'defi-protocol',
    color: '#B6509E',
    description: 'Decentralized lending and borrowing protocol',
    marketCap: 2000000000,
    website: 'https://aave.com',
    documentation: 'https://docs.aave.com',
    launchDate: '2017-11-27',
    blockchain: 'Ethereum'
  },
  {
    symbol: 'Comp',
    name: 'Compound',
    atomicNumber: 11,
    category: 'defi-protocol',
    color: '#00D395',
    description: 'Algorithmic money market protocol for lending and borrowing',
    marketCap: 1500000000,
    website: 'https://compound.finance',
    documentation: 'https://docs.compound.finance',
    launchDate: '2018-09-27',
    blockchain: 'Ethereum'
  },

  // Stablecoins
  {
    symbol: 'Usdc',
    name: 'USD Coin',
    atomicNumber: 12,
    category: 'stablecoin',
    color: '#2775CA',
    description: 'Fully regulated digital dollar backed by US dollar reserves',
    marketCap: 25000000000,
    website: 'https://centre.io',
    documentation: 'https://developers.centre.io',
    launchDate: '2018-09-26',
    blockchain: 'Ethereum'
  },
  {
    symbol: 'Usdt',
    name: 'Tether',
    atomicNumber: 13,
    category: 'stablecoin',
    color: '#26A17B',
    description: 'Most widely used stablecoin pegged to the US dollar',
    marketCap: 80000000000,
    website: 'https://tether.to',
    documentation: 'https://docs.tether.to',
    launchDate: '2014-10-06',
    blockchain: 'Multiple'
  },
  {
    symbol: 'Dai',
    name: 'MakerDAO',
    atomicNumber: 14,
    category: 'stablecoin',
    color: '#F5AC37',
    description: 'Decentralized stablecoin backed by crypto collateral',
    marketCap: 5000000000,
    website: 'https://makerdao.com',
    documentation: 'https://docs.makerdao.com',
    launchDate: '2017-12-18',
    blockchain: 'Ethereum'
  },

  // Privacy Coins
  {
    symbol: 'Xmr',
    name: 'Monero',
    atomicNumber: 15,
    category: 'privacy-coin',
    color: '#FF6600',
    description: 'Privacy-focused cryptocurrency with untraceable transactions',
    marketCap: 3000000000,
    website: 'https://getmonero.org',
    documentation: 'https://getmonero.org/resources/developer-guides',
    launchDate: '2014-04-18',
    consensus: 'Proof of Work'
  },
  {
    symbol: 'Zec',
    name: 'Zcash',
    atomicNumber: 16,
    category: 'privacy-coin',
    color: '#F4B728',
    description: 'Privacy cryptocurrency using zero-knowledge proofs',
    marketCap: 1000000000,
    website: 'https://z.cash',
    documentation: 'https://zcash.readthedocs.io',
    launchDate: '2016-10-28',
    consensus: 'Proof of Work'
  },

  // Personal Brand Element
  {
    symbol: 'Vc',
    name: 'VolkovChain',
    atomicNumber: 117,
    category: 'personal-brand',
    color: '#6C5CE7',
    description: 'Principal Blockchain Developer specializing in Rust, Solidity, and DeFi architecture',
    website: 'https://volkovchain.dev',
    documentation: 'https://docs.volkovchain.dev',
    launchDate: '2024-01-01',
    consensus: 'Proof of Code'
  }
]

// Category colors mapping
export const categoryColors: Record<ElementCategory, string> = {
  'payment-coin': '#F7931A',
  'smart-contract-platform': '#627EEA', 
  'defi-protocol': '#FF007A',
  'layer2-solution': '#8247E5',
  'stablecoin': '#26A17B',
  'personal-brand': '#6C5CE7',
  'infrastructure': '#E6007A',
  'privacy-coin': '#FF6600',
  'nft-platform': '#00D4FF'
}

// Category translations
export const categoryTranslations = {
  ru: {
    'payment-coin': 'Платёжная монета',
    'smart-contract-platform': 'Платформа смарт-контрактов',
    'defi-protocol': 'DeFi протокол',
    'layer2-solution': 'Layer 2 решение',
    'stablecoin': 'Стейблкоин',
    'personal-brand': 'Личный бренд',
    'infrastructure': 'Инфраструктура',
    'privacy-coin': 'Приватная монета',
    'nft-platform': 'NFT платформа',
    'all': 'Все категории'
  },
  en: {
    'payment-coin': 'Payment Coin',
    'smart-contract-platform': 'Smart Contract Platform',
    'defi-protocol': 'DeFi Protocol',
    'layer2-solution': 'Layer 2 Solution',
    'stablecoin': 'Stablecoin',
    'personal-brand': 'Personal Brand',
    'infrastructure': 'Infrastructure',
    'privacy-coin': 'Privacy Coin',
    'nft-platform': 'NFT Platform',
    'all': 'All Categories'
  }
}