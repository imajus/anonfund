import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { IronFish } from '/api/ironfish/server';
import { Campaigns } from '/api/campaigns';

Meteor.startup(async () => {
  if ((await Meteor.users.estimatedDocumentCount()) === 0) {
    await Accounts.createUserAsync({
      email: 'user1@example.com',
      password: 'password',
    });
    await Accounts.createUserAsync({
      email: 'user2@example.com',
      password: 'password',
    });
  }
});

Meteor.startup(async () => {
  if ((await Campaigns.estimatedDocumentCount()) === 0) {
    const owner = Meteor.users.findOne();
    const campaigns = [
      {
        name: 'Support Jason Mitchel for Local Government elections',
        description:
          "Goal: Our campaign for the upcoming local government elections is driven by a solid commitment to creating positive change in our community. With a focus on transparency, inclusivity, and efficiency, our mission is to serve as a catalyst for progress. We aim to forge a path towards a better future in which every citizen's voice is heard, and their needs are met.\nShort Bio: Born and raised in our beloved community, I, Jason Mitchel, am an experienced and dedicated individual seeking to serve as your representative. With a background in [relevant expertise or community involvement], I have developed a deep understanding of the challenges we face and the opportunities that lie before us. I bring [X years] of experience in [relevant field] and a proven track record of delivering results.\nPublic Funding Request: To effectively serve our community and ensure a fair and transparent campaign, we kindly request your support in securing public funding.",
        contact: 'Jason Mitchel <jason.mitchel@example.com>',
      },
      {
        name: 'Supporting Victims of Domestic Violence',
        description:
          'I am writing on behalf of a nonprofit organization committed to assisting victims of domestic violence and promoting community awareness and support. We are dedicated to providing comprehensive services to individuals affected by domestic violence, including shelter, counseling, legal assistance, and empowerment programs.\nWe are reaching out to seek financial support for our ongoing efforts in supporting victims of domestic violence. The current COVID-19 pandemic has amplified the challenges faced by survivors, with incidents of domestic violence increasing worldwide. As a result, our organization has witnessed a surge in demand for our services, putting a strain on our existing resources.',
        contact: 'Ann Victory <ann@domesticviolence.com>',
      },
      {
        name: 'Empower the Opposition in Wonderia',
        description:
          'Introduction: We are writing to request your support in funding our crucial mission to aid the opposition movement in Wonderia, a country currently oppressed by a corrupt and totalitarian government. As advocates for justice, democracy, and human rights, we firmly believe in the importance of standing with those fighting for a better future.\nBackground: Wonderia, a nation rich in potential, is facing immense challenges due to a government riddled with corruption and a disregard for basic human rights. The opposition movement, composed of courageous individuals from diverse backgrounds, is tirelessly working towards bringing about meaningful change and establishing a just and democratic society in Wonderia.\nGoals: With your support, we aim to empower the opposition movement in Wonderia.',
        contact: 'Mark Bolnev <mark.bolnev@example.com>',
      },
    ];
    for await (const { name, description, contact } of campaigns) {
      const id = Campaigns.insert({
        userId: owner._id,
        name,
        description,
        contact,
      });
      const address = await IronFish.createAccount(id);
      Campaigns.update(id, { $set: { address } });
    }
  }
});
