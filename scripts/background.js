const CONFIG = {
    POLL_INTERVAL: 1,
    ALARM_NAME: 'check-friend-requests',
    HOME_URL: 'https://spacehey.com/home'
};

chrome.runtime.onInstalled.addListener(() => {
    checkUpdates();
    
    chrome.alarms.clear(CONFIG.ALARM_NAME, () => {
        chrome.alarms.create(CONFIG.ALARM_NAME, { periodInMinutes: CONFIG.POLL_INTERVAL });
    });
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === CONFIG.ALARM_NAME) {
        checkUpdates();
    }
});

async function checkUpdates() {
    try {
        const settings = await chrome.storage.sync.get(['friendNotifications', 'messageNotifications']);
        const friendEnabled = settings.friendNotifications !== undefined ? settings.friendNotifications : true;
        const messageEnabled = settings.messageNotifications !== undefined ? settings.messageNotifications : true;
        
        if (!friendEnabled && !messageEnabled) {
            return;
        }

        const response = await fetch(CONFIG.HOME_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();

        if (friendEnabled) {
            const blockMatch = html.match(/<h4>Friend Requests<\/h4>[\s\S]*?<table class="comments-table"[^>]*>([\s\S]*?)<\/table>/);
            if (blockMatch) {
                const tableHtml = blockMatch[1];
                const rowRegex = /<tr>[\s\S]*?<a href="\/profile\?id=(\d+)">\s*<p>(.*?)<\/p>\s*<\/a>[\s\S]*?<img[^>]*src="([^"]+)"[^>]*>[\s\S]*?<b>Friend Request<\/b>[\s\S]*?<input type="hidden" name="request_id" value="(\d+)">[\s\S]*?<\/tr>/g;
                
                const currentRequests = [];
                let match;
                while ((match = rowRegex.exec(tableHtml)) !== null) {
                    currentRequests.push({
                        userId: match[1],
                        name: match[2],
                        image: match[3],
                        requestId: match[4]
                    });
                }

                if (currentRequests.length > 0) {
                    chrome.storage.local.get(['notifiedRequests'], (result) => {
                        const notifiedRequests = result.notifiedRequests || [];
                        const newRequests = currentRequests.filter(req => !notifiedRequests.includes(req.requestId));

                        if (newRequests.length > 0) {
                            newRequests.forEach(req => {
                                notifyFriendRequest(req);
                            });

                            const updatedNotified = [...notifiedRequests, ...newRequests.map(req => req.requestId)];
                            if (updatedNotified.length > 100) {
                                updatedNotified.splice(0, updatedNotified.length - 100);
                            }
                            chrome.storage.local.set({ notifiedRequests: updatedNotified });
                        }
                    });
                }
            }
        }

        if (messageEnabled) {
            const messageMatch = html.match(/messages\s*<span class="count">\((\d+)\)<\/span>/i);
            const currentMessageCount = messageMatch ? parseInt(messageMatch[1]) : 0;
            
            chrome.storage.local.get(['lastMessageCount'], (result) => {
                const lastCount = result.lastMessageCount || 0;
                if (currentMessageCount > lastCount) {
                    notifyMessages(currentMessageCount);
                }
                if (currentMessageCount !== lastCount) {
                    chrome.storage.local.set({ lastMessageCount: currentMessageCount });
                }
            });
        }

    } catch (error) {
        console.error('[SpaceHeyMods] Error checking updates:', error);
    }
}

function notifyFriendRequest(request) {
    let iconUrl = request.image;
    if (iconUrl && !iconUrl.startsWith('http')) {
        iconUrl = 'https://spacehey.com' + (iconUrl.startsWith('/') ? '' : '/') + iconUrl;
    }

    chrome.notifications.create(`friend-request-${request.requestId}`, {
        type: 'basic',
        iconUrl: iconUrl || 'https://spacehey.com/favicon.ico',
        title: 'New Friend Request',
        message: `${request.name} sent you a friend request!`,
        contextMessage: 'SpaceHeyMods',
        priority: 2
    });
}

function notifyMessages(count) {
    chrome.notifications.create(`new-messages-${Date.now()}`, {
        type: 'basic',
        iconUrl: 'https://spacehey.com/favicon.ico',
        title: 'New Messages',
        message: `You have ${count} unread message${count > 1 ? 's' : ''} on SpaceHey!`,
        contextMessage: 'SpaceHeyMods',
        priority: 2
    });
}
