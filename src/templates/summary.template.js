export const summaryTemplate = (summary, recommendations, risks, highlights) => {
    return `
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                    }
                </style>
            </head>
            <body>
                <h1>Daily CRM Summary</h1>
                <p>${summary.overview}</p>
                <h2>Key Metrics</h2>
                <p>${JSON.stringify(summary.keyMetrics)}</p>
                <h2>Recommendations</h2>
                <ul>${recommendations.map((rec) => `<li>${rec}</li>`).join("")}</ul>
                <h2>Risks</h2>
                <ul>${risks.map((risk) => `<li>${risk}</li>`).join("")}</ul>
                <h2>Highlights</h2>
                <ul>${highlights.map((highlight) => `<li>${highlight}</li>`).join("")}</ul>
            </body>
        </html>
    `;
};