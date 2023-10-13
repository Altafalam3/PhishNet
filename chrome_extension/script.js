chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0];
    const currentUrl = currentTab.url;

    chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        function: (url) => {
            const currUrlElement = document.getElementById('currUrl');
            if (currUrlElement) {
                currUrlElement.textContent = url;
            }
        },
        args: [currentUrl],
    });

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
            chrome.scripting.executeScript({
                target: { tabId: currentTab.id },
                function: (analysisData) => {
                    // Send a message to the popup with the analysis data
                    chrome.runtime.sendMessage({
                        type: 'updateAnalysisData',
                        data: analysisData,
                    });
                },
                args: [data],
            });

            const result = data.result;
            const caution = data.caution;
            const predictionScore = data.prediction_score;
            const modelProbabilityScore = data.model_probability_score;
            const combinedScore = data.combined_score;

            // Check if the result is dangerous and block the webpage if it is
            if (model_probability_score <= 87) {
                chrome.tabs.update(currentTab.id, { url: 'google.com' });
            }
        })
        .catch((error) => {
            console.log(error)
        });

});


// chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     const currentTab = tabs[0];
//     const currentUrl = currentTab.url;

//     chrome.scripting.executeScript({
//         target: { tabId: currentTab.id },
//         function: (url) => {
//             const currUrlElement = document.getElementById('currUrl');
//             if (currUrlElement) {
//                 currUrlElement.textContent = url;
//             }
//         },
//         args: [currentUrl],
//     });

//     console.log(currentUrl);

//     // Now, you can use the currentUrl to make the fetch request
//     const requestData = {
//         url: currentUrl,
//     };

//     fetch('http://localhost:5000/analyze_url', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestData),
//     })
//         .then((response) => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then((data) => {
//             console.log('Analysis Response of the model:', data);
//             // Handle the analysis response here
//             chrome.scripting.executeScript({
//                 target: { tabId: currentTab.id },
//                 function: (analysisData) => {
//                     // Send a message to the popup with the analysis data
//                     chrome.runtime.sendMessage({
//                         type: 'updateAnalysisData',
//                         data: analysisData,
//                     });
//                 },
//                 args: [data],
//             });

//             // const result = data.result;
//             // const caution = data.caution;
//             // const predictionScore = data.prediction_score;
//             // const modelProbabilityScore = data.model_probability_score;
//             // const combinedScore = data.combined_score;

//         })
//         .catch((error) => {
//             console.log(error)
//         });

//         fetch('http://localhost:5000/tickNotTick', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestData),
//     })
//         .then((response) => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then((data) => {
//             console.log('Analysis Response of tick not tick:', data);
//             // Handle the analysis response here
//             // const result = data.result;
//             // const caution = data.caution;
//             // const predictionScore = data.prediction_score;
//             // const modelProbabilityScore = data.model_probability_score;
//             // const combinedScore = data.combined_score;

//         })
//         .catch((error) => {
//             console.log(error)
//         });
// });
