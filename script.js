async function correctSentence() {
    const sentence = document.getElementById('sentenceInput').value;
    if (!sentence) {
        alert('Please enter a sentence!');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/corrections', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sentence })
        });

        const data = await response.json();

        document.getElementById('result').textContent = data.corrected;
    } catch (err) {
        alert('Error correcting the sentence.');
    }
}
