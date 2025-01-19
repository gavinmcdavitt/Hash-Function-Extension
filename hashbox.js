// Hash Text Button
document.getElementById("hashTextButton").addEventListener("click", async () => {
  event.preventDefault();
  const inputText = document.getElementById("inputText").value;
  const spinner = document.getElementById("spinner");
  const outputText = document.getElementById("outputText");

  spinner.style.display = "block";
  outputText.textContent = "Calculating hash...";

  // Hash Text
  async function hashText(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
  }

  try {
    const hash = await hashText(inputText);
    outputText.textContent = `Text Hash: ${hash}`;
  } catch (err) {
    outputText.textContent = "Error calculating hash.";
  } finally {
    spinner.style.display = "none";
  }
});

document.getElementById("hashFileButton").addEventListener("click", (event) => {
  event.preventDefault();
  const inputFile = document.getElementById("inputFile").files[0];
  const spinner = document.getElementById("spinner");
  const outputText = document.getElementById("outputText");

  if (!inputFile) {
    outputText.textContent = "Please select a file.";
    return;
  }

  spinner.style.display = "block";
  outputText.textContent = "Reading and hashing file...";

  const reader = new FileReader();
 
  reader.onload = async function (event) {
    try {
      const fileData = event.target.result;
      const hashBuffer = await crypto.subtle.digest("SHA-256", fileData);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hash = hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
      outputText.textContent = `File Hash: ${hash}`;
    } catch (err) {
      console.error("Error hashing file:", err);
      outputText.textContent = "Error hashing file.";
    } finally {
      spinner.style.display = "none";
    }
  };

  reader.onerror = function () {
    console.error("Error reading file.");
    outputText.textContent = "Error reading file.";
    spinner.style.display = "none";
  };

  reader.readAsArrayBuffer(inputFile);
  checkforequality();
})
function checkforequality() {
  // Get the values from the input and the checksum textarea
  const inputText = document.getElementById("inputText").value;
  const publishersCheckSum = document.getElementById("publishersCheckSum").value;

  // Compare the two
  if (inputText === publishersCheckSum) {
    document.getElementById("checkSumMatch").textContent = "The text and checksum match!";
    document.getElementById("checkSumMatch").style.color = "green";
  } else {
    document.getElementById("checkSumMatch").textContent = "The text and checksum do not match.";
    document.getElementById("checkSumMatch").style.color = "red";
  }
}