chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0];
    const currentUrl = currentTab.url;
    document.getElementById('currUrl').innerHTML = currentUrl;
    console.log(currentUrl);

    // Now, you can use the currentUrl to make the fetch request
    const requestData = {
        url: currentUrl,
    };

    fetch('http://localhost:5000/analyze_url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            console.log('Analysis Response of the model:', data);
            // Handle the analysis response here
            const result = data.result;
            const caution = data.caution;
            const predictionScore = data.prediction_score;
            const modelProbabilityScore = data.model_probability_score;
            const combinedScore = data.combined_score;

        })
        .catch((error) => {
            console.log(error)
        });

        fetch('http://localhost:5000/tickNotTick', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            console.log('Analysis Response of tick not tick:', data);
            // Handle the analysis response here
            // const result = data.result;
            // const caution = data.caution;
            // const predictionScore = data.prediction_score;
            // const modelProbabilityScore = data.model_probability_score;
            // const combinedScore = data.combined_score;

        })
        .catch((error) => {
            console.log(error)
        });
});
