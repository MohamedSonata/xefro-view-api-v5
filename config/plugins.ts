export default () => ({

    email: {
        config: {
          provider: 'mailgun',
          providerOptions: {
            key: 'f061abf93dc14af996a3a0b3de563b98-d117dd33-2759f6d4', // Required
            domain: 'noreply.preduro.com', // Required
            url: ('https://api.mailgun.net/v3/noreply.preduro.com'), //Optional. If domain region is Europe use 'https://api.eu.mailgun.net'
          },
          settings: {
            defaultFrom: 'noreply@preduro.com',
            defaultReplyTo: 'predurohelp@preduro.com',
          },
        },
      },
});
