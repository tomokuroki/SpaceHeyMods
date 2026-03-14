window.SpaceHeyMods = window.SpaceHeyMods || {};
window.SpaceHeyMods.featuresLogic = window.SpaceHeyMods.featuresLogic || {};

window.SpaceHeyMods.featuresLogic['messageNotifications'] = function() {
    function checkPageForMessages() {
        const messageLinks = document.querySelectorAll('a[href*="im.spacehey.com"]');
        messageLinks.forEach(link => {
            const countSpan = link.querySelector('.count') || link;
            const match = countSpan.textContent.match(/\((\d+)\)/);
            if (match && parseInt(match[1]) > 0) {
                console.log(`[SpaceHeyMods] ${match[1]} unread messages detected on page.`);
            }
        });
    }

    checkPageForMessages();
    
    const observer = new MutationObserver(() => {
        checkPageForMessages();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
};
