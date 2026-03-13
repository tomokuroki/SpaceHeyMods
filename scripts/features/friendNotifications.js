window.SpaceHeyMods = window.SpaceHeyMods || {};
window.SpaceHeyMods.featuresLogic = window.SpaceHeyMods.featuresLogic || {};

window.SpaceHeyMods.featuresLogic['friendNotifications'] = function() {
    function checkPageForRequests() {
        const navLinks = document.querySelectorAll('nav a, div.top a');
        navLinks.forEach(link => {
            if (link.textContent.includes('Friend Requests')) {
                const match = link.textContent.match(/\((\d+)\)/);
                if (match && parseInt(match[1]) > 0) {
                    console.log(`[SpaceHeyMods] ${match[1]} pending friend requests detected on page.`);
                }
            }
        });
    }

    checkPageForRequests();
    
    const observer = new MutationObserver(() => {
        checkPageForRequests();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
};
