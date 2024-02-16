import { Meteor } from 'meteor/meteor';
import { TemplateController } from 'meteor/space:template-controller';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { showToast } from 'meteor/imajus:bootstrap-helpers';
import { Campaigns } from '/api/campaigns';
import { Transfers } from '/api/transfers';
import { Accounts, TokenContract, getProvider } from '/api/ethers/client';
import './funding.html';

const { tokenSymbol } = Meteor.settings.public.Scroll;

TemplateController('CampaignFunding', {
  state: {
    network: null,
    balance: null,
    status: null,
    key: null,
  },
  onRendered() {
    const provider = getProvider();
    provider.getNetwork().then(({ chainId }) => {
      this.state.network = chainId;
    });
    provider.on('network', ({ chainId }) => {
      this.state.network = chainId;
    });
    this.autorun(async () => {
      if (Accounts.isConnected()) {
        await this.updateBalance();
      }
    });
  },
  helpers: {
    campaign() {
      return this.campaign();
    },
    isCorrectNetwork() {
      return this.state.network === 534351;
    },
    isLoading() {
      return Boolean(this.state.status);
    },
    isError() {
      return this.state.status instanceof Error;
    },
  },
  events: {
    async 'click [data-action=connect]'() {
      await Accounts.connect();
    },
    async 'submit #funding'(e) {
      e.preventDefault();
      const form = e.currentTarget;
      const campaign = this.campaign();
      const amount = form['amount'].value * 10 ** 8;
      this.state.status = `Please confirm depositing ${tokenSymbol}...`;
      try {
        this.state.status = 'Creating disposable transfer address...';
        const { transferId, address } = await Meteor.callAsync(
          'Transfers.create',
          campaign._id,
          amount,
          Accounts.current.get(),
        );
        this.state.status = 'Please confirm the trasfer operation...';
        try {
          const tx = await TokenContract.transferWithMetadata(
            Meteor.settings.public.Scroll.bridgeAddress,
            amount,
            `0x${address}`,
          );
          this.state.status = 'Waiting for the transaction to be confirmed...';
          await tx.wait();
        } catch (err) {
          // Cleanup
          await Transfers.removeAsync(transferId);
          throw err;
        }
        await this.updateBalance();
        this.state.status = null;
        form.reset();
        showToast({
          heading: 'Funding successful',
          message: `You have successfully funded ${
            amount / 10 ** 8
          } ${tokenSymbol} to the campaign`,
          brand: 'success',
        });
        FlowRouter.go('/donations');
      } catch (err) {
        this.state.status = err;
      }
    },
    'reset #funding'() {
      this.state.status = null;
    },
  },
  private: {
    campaignId: () => FlowRouter.getParam('_id'),
    campaign() {
      return Campaigns.findOne(this.campaignId());
    },
    async updateBalance() {
      const balance = await TokenContract.balanceOf(Accounts.current.get());
      this.state.balance = balance.toNumber() / 10 ** 8;
    },
  },
});
