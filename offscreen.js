chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'play-notification-sound') {
        const audio = new Audio(message.url);
        if (message.volume !== undefined) audio.volume = message.volume;
        audio.play().catch(() => {});
    }
});

