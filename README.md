🥷 **AnonFund** is a platform for (1) anonymous (2) regulatory-friendly (3) cryptocurrency donations

## Overview

AnonFund is a platform to support anonymous cryptocurrency donations.

Possible use cases:

- Political or religious matters
- Legal cases
- Victim support
- Health-related campaigns
- ... practicaly any fund, which would benefit from the donations anonymity

Benefits:

- Preserve donations anonymity
- Hide the amount of assets the fund holds
- Disclosure transaction details only to selected parties

## Implementation

The platform is build on top of IronFish -- a L1 blockchain which preserves transactions anonymity by utilizing ZKP technology.

For each donation, a one-time use disposable IronFish account is used, which allows to preserve the transaction anonymity. The funds then are automatically transferred to the Company address on IronFish.

Both Donors and Campaign managers are able to export and share 🔑 View-Only Keys, allowing anyone else to view the details of the donation transactions. This helps verify the legitimacy of the source of funds.

The Sepolia ⇒ IronFish bridge is utilized to support donating with Ethereum assets by seamlessly bridging them onto the IronFish blockchain for donors. Once the Campaign is over, the owner has the option to utilize the bridge in the opposite direction, effectively transferring all campaign funds back onto the Ethereum blockchain, if desired

Scroll Sepolia Bridge address: `0x6F31973b9959f1089C35a15596c0bc813f1C8Dd4`

Scroll Sepolia WIRON address: `0x990e7DAdFc61C7B1bFbb4c668691De40B9e9E119`

IronFish Bridge address: `3cbc990609fe44ed235094cb77f3f3fab09113e08afc8f81fc9120d7b03515cb`

## Links

IronFish whitepaper: https://ironfish.network/learn/whitepaper/introduction

Project at Circuit Breaker hackathon: https://ethglobal.com/showcase/anonfund-diog1

Live demo: https://anonfund.meteorapp.com
