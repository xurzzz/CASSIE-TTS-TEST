function playAudio() {
    // Get the sentence the user typed
    const inputText = document.getElementById('inputText').value;

    // Split the sentence into words (assuming words are separated by spaces)
    const words = inputText.trim().toLowerCase().split(' ');

    // Create an array to store the audio elements for each word
    const audioQueue = [];
    const missingFiles = [];

    // Loop through the words, and for each word, create an Audio object
    words.forEach(word => {
        const audioFile = `audio/${word}.wav`; // Path to the WAV file
        const audio = new Audio(audioFile);

        // Check if the file exists
        audio.onerror = () => {
            missingFiles.push(word); // Add to missing files list
        };

        // Add the audio object to the queue if the file exists
        audioQueue.push(audio);
    });

    // After setting up the queue, check if there are missing files
    if (missingFiles.length > 0) {
        showError(`The following sound files are missing: ${missingFiles.join(', ')}`);
    } else {
        // Play the audio files in sequence
        playNextInQueue(audioQueue);
    }
}

function playNextInQueue(queue) {
    if (queue.length === 0) return; // If no more audio in the queue, exit

    const currentAudio = queue.shift(); // Get the first audio element
    currentAudio.play(); // Play the current audio

    // Once the current audio finishes, play the next one
    currentAudio.onended = () => playNextInQueue(queue);
}

function showError(message) {
    // Display the error message on the page
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = message;
}
