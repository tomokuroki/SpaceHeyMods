window.SpaceHeyMods = window.SpaceHeyMods || {};
window.SpaceHeyMods.featuresLogic = window.SpaceHeyMods.featuresLogic || {};

window.SpaceHeyMods.featuresLogic['blogNotifications'] = function() {
    function checkPageForBlogComments() {
        const notificationLinks = document.querySelectorAll('a[href="/notifications"]');
        notificationLinks.forEach(link => {
            if (link.textContent.includes('New Blog Comments')) {
                const match = link.textContent.match(/\((\d+)\)/);
                if (match && parseInt(match[1]) > 0) {
                    console.log(`[SpaceHeyMods] ${match[1]} new blog comments detected on page.`);
                } else if (link.parentElement.classList.contains('text-green')) {
                    console.log('[SpaceHeyMods] New blog comments detected on page.');
                }
            }
        });
    }

    checkPageForBlogComments();
    
    const observer = new MutationObserver(() => {
        checkPageForBlogComments();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
};
