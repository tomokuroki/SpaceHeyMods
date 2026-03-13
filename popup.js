document.addEventListener('DOMContentLoaded', () => {
    const config = window.SpaceHeyMods?.featuresConfig || [];
    const container = document.getElementById('featuresList');
    const featureIds = config.map(f => f.id);

    chrome.storage.sync.get(featureIds, (result) => {
        config.forEach(feature => {
            const isEnabled = result[feature.id] !== undefined ? result[feature.id] : feature.defaultEnabled;

            const featureEl = document.createElement('div');
            featureEl.style.marginBottom = '10px';

            const labelEl = document.createElement('label');
            labelEl.style.cursor = 'pointer';
            labelEl.style.color = '#1D4ED8';
            labelEl.style.fontWeight = 'bold';
            labelEl.style.display = 'flex';
            labelEl.style.alignItems = 'flex-start';

            const checkboxEl = document.createElement('input');
            checkboxEl.type = 'checkbox';
            checkboxEl.checked = isEnabled;
            checkboxEl.style.marginTop = '2px';
            checkboxEl.style.marginRight = '8px';
            checkboxEl.style.cursor = 'pointer';

            checkboxEl.addEventListener('change', (e) => {
                const val = e.target.checked;
                chrome.storage.sync.set({ [feature.id]: val }, () => {
                    console.log(`${feature.name} is now ${val ? 'enabled' : 'disabled'}`);
                });
            });

            const textContainer = document.createElement('div');
            const titleSpan = document.createElement('span');
            titleSpan.innerText = feature.name;
            titleSpan.style.display = 'block';

            const descSpan = document.createElement('span');
            descSpan.innerText = feature.description;
            descSpan.style.display = 'block';
            descSpan.style.fontSize = '80%';
            descSpan.style.color = '#545454';
            descSpan.style.marginTop = '2px';
            descSpan.style.fontWeight = 'normal';

            textContainer.appendChild(titleSpan);
            textContainer.appendChild(descSpan);

            labelEl.appendChild(checkboxEl);
            labelEl.appendChild(textContainer);
            featureEl.appendChild(labelEl);

            container.appendChild(featureEl);
        });
    });
});
