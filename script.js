function playAudio() {
    // Get the sentence the user typed
    const inputText = document.getElementById('inputText').value;

    // Split the sentence into words (assuming words are separated by spaces)
    const words = inputText.trim().toLowerCase().split(' ');

    // Create an array to store the audio elements for each word
    const audioQueue = [];
    const missingFiles = [];

    // Loop through the words
    words.forEach(word => {
        const sanitizedWord = sanitizeWord(word);
        const audioFileSanitized = `audio/${sanitizedWord}.wav`;
        const audioFileOriginal = `audio/${word}.wav`; // Original file path

        // Attempt to play sanitized file
        const audioSanitized = new Audio(audioFileSanitized);
        audioSanitized.onerror = () => {
            // If sanitized file is missing, try original file
            const audioOriginal = new Audio(audioFileOriginal);
            audioOriginal.onerror = () => {
                missingFiles.push(word); // Add to missing files list
            };
            audioQueue.push(audioOriginal);
        };
        audioQueue.push(audioSanitized);
    });

    // After setting up the queue, check if there are missing files
    if (missingFiles.length > 0) {
        showError(`The following sound files are missing: ${missingFiles.join(', ')}`);
    } else {
        // Play the audio files in sequence
        playNextInQueue(audioQueue);
        // Clear any previous errors
        showError('');
    }
}

function sanitizeWord(word) {
    // Remove anything that is not a letter or a number
    return word.replace(/[^a-z0-9]/g, '');
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
