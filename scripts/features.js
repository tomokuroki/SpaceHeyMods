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
    },
    {
        id: 'messageNotifications',
        name: 'Message Notifications',
        description: 'Get notified when someone sends you a message',
        defaultEnabled: true,
        hostMatches: ['*']
    },
    {
        id: 'blogNotifications',
        name: 'New Blog Comments Notifications',
        description: 'Get notified when you receive new comments on your blog',
        defaultEnabled: true,
        hostMatches: ['*']
    },
    {
        id: 'notificationSounds',
        name: 'Notification Sounds',
        description: 'Play a sound when you receive a new notification',
        defaultEnabled: true,
        hostMatches: ['*']
    }
];

window.SpaceHeyMods.featuresLogic = {};

