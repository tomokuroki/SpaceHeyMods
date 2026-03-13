window.SpaceHeyMods = window.SpaceHeyMods || {};
window.SpaceHeyMods.featuresLogic = window.SpaceHeyMods.featuresLogic || {};

window.SpaceHeyMods.featuresLogic['enterToSend'] = function() {
    function enableEnterToSend() {
        const textarea = document.querySelector('textarea.message-composer');
        if (!textarea) return;

        const oldListener = textarea._enterListener;
        if (oldListener) {
            textarea.removeEventListener('keydown', oldListener);
        }

        function handler(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const sendButton = document.querySelector('button.message-send');
                if (sendButton) {
                    sendButton.click();
                }
            }
        }

        textarea.addEventListener('keydown', handler);
        textarea._enterListener = handler;
    }

    const observer = new MutationObserver(() => {
        enableEnterToSend();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(enableEnterToSend, 800);
};
