window.SpaceHeyMods = window.SpaceHeyMods || {};
window.SpaceHeyMods.featuresConfig = [
    {
        id: 'enterToSend',
        name: 'Enter to Send (IM)',
        description: 'Send messages with Enter in SpaceHey IM',
        defaultEnabled: true,
        hostMatches: ['im.spacehey.com']
    },
    {
        id: 'friendNotifications',
        name: 'Friend Request Notifications',
        description: 'Get notified when you receive a new friend request',
        defaultEnabled: true,
        hostMatches: ['*']
    }
];

window.SpaceHeyMods.featuresLogic = {};
