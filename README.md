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

Sepolia Deposit address: `0x664b8b9892b7560b356ef0f8d44cbd1f6628e388`

Sepolia WIRON address: `0x3dE166740d64d522AbFDa77D9d878dfedfDEEEDE`

IronFish Bridge address: `1d1a1fb9fafd7de32c7f02115207d6fe9df1272f5b4bedbbfa1330eba88c5ce2`

## Links

IronFish whitepaper: https://ironfish.network/learn/whitepaper/introduction

Project at Circuit Breaker hackathon: https://ethglobal.com/showcase/anonfund-diog1

Live demo: https://anonfund.meteorapp.com
