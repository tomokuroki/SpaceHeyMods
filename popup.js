document.addEventListener('DOMContentLoaded', () => {
    const config = window.SpaceHeyMods?.featuresConfig || [];
    const container = document.getElementById('featuresList');
    const featureIds = [...config.map(f => f.id), 'notificationVolume'];

    browser.storage.sync.get(featureIds, (result) => {
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
                browser.storage.sync.set({ [feature.id]: val });
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

            if (feature.id === 'notificationSounds') {
                const volumeContainer = document.createElement('div');
                volumeContainer.style.marginLeft = '25px';
                volumeContainer.style.marginTop = '5px';
                volumeContainer.style.display = 'flex';
                volumeContainer.style.alignItems = 'center';

                const volLabel = document.createElement('span');
                volLabel.innerText = 'Volume: ';
                volLabel.style.fontSize = '80%';
                volLabel.style.color = '#545454';
                volLabel.style.marginRight = '5px';

                const slider = document.createElement('input');
                slider.type = 'range';
                slider.min = '0';
                slider.max = '100';
                slider.value = result.notificationVolume !== undefined ? result.notificationVolume : 100;
                slider.style.width = '100px';
                slider.style.cursor = 'pointer';

                slider.addEventListener('input', (e) => {
                    browser.storage.sync.set({ notificationVolume: parseInt(e.target.value) });
                });

                volumeContainer.appendChild(volLabel);
                volumeContainer.appendChild(slider);
                featureEl.appendChild(volumeContainer);
            }

            container.appendChild(featureEl);
        });
    });
});

