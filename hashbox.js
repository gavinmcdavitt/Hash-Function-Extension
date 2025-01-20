document.getElementById("hashTextButton").addEventListener("click", async (event) => {
  event.preventDefault();
  const inputText = document.getElementById("inputText").value;
  const selectedAlgorithms = Array.from(document.querySelectorAll("input[name='hashAlgorithm']:checked"))
                                .map(checkbox => checkbox.value);
  const spinner = document.getElementById("spinner");
  const outputText = document.getElementById("outputText");

  if (!inputText) {
    outputText.textContent = "Please enter some text.";
    return;
  }
  if (selectedAlgorithms.length === 0) {
    outputText.textContent = "Please select at least one hash algorithm.";
    return;
  }

  spinner.style.display = "block";
  outputText.innerHTML = ""; // Clear previous results

  // Function to hash text with selected algorithms
  async function hashText(text, algorithm) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
  }

  try {
    // Loop through selected algorithms and compute the hash for each
    for (const algorithm of selectedAlgorithms) {
      const hash = await hashText(inputText, algorithm);
      const isMatch = checkforequality(hash);
      
      // Create a new paragraph element for the hash
      const hashElement = document.createElement("p");
      hashElement.textContent = `${algorithm} Hash: ${hash}`;

      const copyButton = document.createElement("button");
      copyButton.textContent = "Copy";
      copyButton.classList.add('copy-button');
      copyButton.onclick = () => {
        navigator.clipboard.writeText(hash)
          .then(() => {
            console.log("Hash copied to clipboard");
          })
          .catch(err => {
            console.error("Failed to copy hash:", err);
          });
      };

      // Append the hash and copy button to the output
      hashElement.appendChild(copyButton);
      
      // Apply styling based on match
      if (isMatch) {
        hashElement.classList.add('match-highlight');
        console.log('found a match');
      } else {
        hashElement.style.color = "black";
      }
      
      // Append each hash element to the output
      outputText.appendChild(hashElement);
    }
  } catch (err) {
    outputText.textContent = "Error calculating hash.";
    console.error("Error hashing text:", err);
  } finally {
    spinner.style.display = "none";
  }
});


document.getElementById("hashFileButton").addEventListener("click", (event) => {
  event.preventDefault();
  const inputFile = document.getElementById("inputFile").files[0];
  const selectedAlgorithms = Array.from(document.querySelectorAll("input[name='hashAlgorithm']:checked"))
                                .map(checkbox => checkbox.value);
  const spinner = document.getElementById("spinner");
  const outputText = document.getElementById("outputText");

  if (!inputFile) {
    outputText.textContent = "Please select a file.";
    return;
  }
  if (selectedAlgorithms.length === 0) {
    outputText.textContent = "Please select at least one hash algorithm.";
    return;
  }

  spinner.style.display = "block";
  outputText.innerHTML = ""; // Clear previous results

  const reader = new FileReader();

  reader.onload = async function(event) {
    try {
      const fileData = event.target.result;

      // Loop through selected algorithms and compute the hash for each
      for (const algorithm of selectedAlgorithms) {
        const hashBuffer = await crypto.subtle.digest(algorithm, fileData);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hash = hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
        
        // Create a new paragraph element for the hash
        const hashElement = document.createElement("p");
        hashElement.textContent = `${algorithm} Hash: ${hash}`;

        const copyButton = document.createElement("button");
      copyButton.textContent = "Copy";
      copyButton.classList.add('copy-button');
      copyButton.onclick = () => {
        navigator.clipboard.writeText(hash)
          .then(() => {
            console.log("Hash copied to clipboard");
          })
          .catch(err => {
            console.error("Failed to copy hash:", err);
          });
      };

      // Append the hash and copy button to the output
      hashElement.appendChild(copyButton);
        
        // Check for match and apply styling
        const isMatch = checkforequality(hash);
        console.log('isMatch:', isMatch); // Debug line
        
        if (isMatch) {
          hashElement.classList.add('match-highlight');
          console.log('found a match');
        } else {
          hashElement.style.color = "black";
        }
        
        // Append each hash element to the output
        outputText.appendChild(hashElement);
      }
    } catch (err) {
      console.error("Error hashing file:", err);
      outputText.textContent = "Error hashing file.";
    } finally {
      spinner.style.display = "none";
    }
  };

  reader.onerror = function() {
    console.error("Error reading file.");
    outputText.textContent = "Error reading file.";
    spinner.style.display = "none";
  };

  reader.readAsArrayBuffer(inputFile);
});

function checkforequality(hash) {
  // Get the value of the publisher's checksum
  const publishersCheckSum = document.getElementById("publishersCheckSum").value;

  // Compare the computed hash with the publisher's checksum
  const isMatch = hash === publishersCheckSum;
  return isMatch;
}
